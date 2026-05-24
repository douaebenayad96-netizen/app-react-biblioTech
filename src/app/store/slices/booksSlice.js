import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { libraryApi } from '../../services/libraryApi';

function unwrapList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.value)) return payload.value;
  if (Array.isArray(payload?.livres)) return payload.livres;
  return [];
}

const LOCAL_BOOKS_KEY = 'btc_local_books';

function loadLocalBooks() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_BOOKS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveLocalBooks(books) {
  try {
    localStorage.setItem(LOCAL_BOOKS_KEY, JSON.stringify(books));
  } catch {
    // Ignore storage failures; the Redux state still updates for this session.
  }
}

function isLocalBook(book) {
  return Boolean(book?.localOnly) || String(book?.id || '').startsWith('local-');
}

function isLocalOverride(book) {
  return Boolean(book?.localOverride);
}

function storedBooksFromState(books) {
  return books.filter((book) => isLocalBook(book) || isLocalOverride(book));
}

function mergeStoredBooks(apiBooks, storedBooks) {
  const storedById = new Map(storedBooks.map((book) => [String(book.id), book]));
  const merged = apiBooks.map((book) => {
    const stored = storedById.get(String(book.id));
    if (!stored) return book;
    storedById.delete(String(book.id));
    return { ...book, ...stored, localOverride: true };
  });

  return [...merged, ...Array.from(storedById.values())];
}

function createLocalBook(book) {
  const now = Date.now();
  return {
    ...book,
    id: `local-${now}`,
    title: book?.title || book?.titre || '',
    author: book?.author || book?.auteur || '',
    isbn: book?.isbn || `LOCAL-${now}`,
    year: book?.year || new Date().getFullYear(),
    genre: book?.genre || book?.category || book?.categorie || 'Developpement',
    available: book?.available ?? true,
    coverImage: book?.coverImage || book?.image || '',
    description: book?.description || '',
    localOnly: true,
  };
}

export const loadBooks = createAsyncThunk('books/loadBooks', async () => {
  const firstPage = await libraryApi.getLivres();
  const books = unwrapList(firstPage);
  const lastPage = Number(firstPage?.last_page || 1);

  if (lastPage > 1) {
    const nextPages = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, index) => libraryApi.getLivres(index + 2))
    );
    books.push(...nextPages.flatMap(unwrapList));
  }

  return mergeStoredBooks(books, loadLocalBooks());
});

function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function resolveCategoryId(book, categories) {
  if (book?.category_id) return Number(book.category_id);

  const genre = normalizeText(book?.genre || book?.category || book?.categorie);
  const match = categories.find((category) => normalizeText(category?.nom || category?.name) === genre);
  return match?.id || categories[0]?.id || 1;
}

function imageValueForApi(book) {
  const image = book?.image || book?.coverImage || book?.imageUrl || book?.image_url || '';
  return image || `${normalizeText(book?.title || book?.titre || 'livre').replace(/\s+/g, '-')}.jpg`;
}

function createLivrePayload(book, categories) {
  const title = book?.title || book?.titre || '';
  const author = book?.author || book?.auteur || '';
  const isbn = book?.isbn || `AUTO-${Date.now()}`;
  const available = book?.available ?? true;

  return {
    ...book,
    titre: title,
    auteur: author,
    isbn,
    image: imageValueForApi(book),
    nombre_exemplaires: Number(book?.nombre_exemplaires || book?.copies || 1),
    statut: available ? 'Disponible' : 'Emprunte',
    category_id: resolveCategoryId(book, categories),
  };
}

export const createBook = createAsyncThunk('books/createBook', async (payload) => {
  const categoriesRes = await libraryApi.getCategories().catch(() => []);
  const categories = unwrapList(categoriesRes);
  try {
    const res = await libraryApi.createLivre(createLivrePayload(payload, categories));
    return res?.data ?? res;
  } catch (error) {
    if (![401, 403, 404, 405].includes(error?.status)) throw error;

    const localBook = createLocalBook(payload);
    saveLocalBooks([localBook, ...loadLocalBooks()]);
    return localBook;
  }
});

const initialState = {
  books: [],
  booksLoading: false,
  booksError: null,
};

const API_ORIGIN = 'https://livresliber.vercel.app';

function isAbsoluteUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

function openLibraryCoverUrl(isbn) {
  const cleanIsbn = String(isbn || '').replace(/[^0-9X]/gi, '');
  return cleanIsbn ? `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg` : '';
}

function buildImageUrl(book) {
  const directImage =
    book?.coverImage ||
    book?.image_url ||
    book?.imageUrl ||
    book?.couverture ||
    book?.photo ||
    book?.image ||
    '';

  if (!directImage || typeof directImage !== 'string') {
    return openLibraryCoverUrl(book?.isbn);
  }

  if (isAbsoluteUrl(directImage)) return directImage;

  const trimmedImage = directImage.replace(/^\/+/, '');

  // If the API sends a relative path, keep it. Plain filenames from the current
  // API are not publicly served, so the ISBN cover is the reliable fallback.
  if (trimmedImage.includes('/')) return `${API_ORIGIN}/${trimmedImage}`;

  return openLibraryCoverUrl(book?.isbn);
}

function legacyBuildImageUrl(img) {
  if (!img || typeof img !== 'string') return '';
  if (img.startsWith('http://') || img.startsWith('https://')) return img;

  // L’API renvoie seulement le nom de fichier.
  // On essaie plusieurs prefixes possibles (le back peut servir les images depuis un dossier différent).
  const candidates = [
    `https://livresliber.vercel.app/storage/${img}`,
    `https://livresliber.vercel.app/storage/books/${img}`,
    `https://livresliber.vercel.app/storage/files/${img}`,
    `https://livresliber.vercel.app/uploads/${img}`,
    `https://livresliber.vercel.app/uploads/books/${img}`,
    `https://livresliber.vercel.app/images/${img}`,
    `https://livresliber.vercel.app/assets/${img}`,
    `https://livresliber.vercel.app/${img}`,
    `https://livresliber.vercel.app/public/${img}`,
  ];

  return candidates[0];
}

function normalizeGenre(b) {
  if (typeof b?.genre === 'string') return b.genre;
  if (typeof b?.category === 'string') return b.category;
  if (typeof b?.categorie === 'string') return b.categorie;

  if (typeof b?.category?.nom === 'string') return b.category.nom;
  if (typeof b?.category?.titre === 'string') return b.category.titre;

  if (typeof b?.categorie?.nom === 'string') return b.categorie.nom;
  if (typeof b?.categorie?.titre === 'string') return b.categorie.titre;

  if (typeof b?.category?.nom === 'string') return b.category.nom;
  return '';
}

function normalizeLivre(b) {
  const genreStr = normalizeGenre(b);

  const coverStr = buildImageUrl(b);

  const statut = b?.statut ?? b?.disponible;
  const available =
    typeof b?.available === 'boolean'
      ? b.available
      : typeof b?.isAvailable === 'boolean'
      ? b.isAvailable
      : statut
      ? String(statut).toLowerCase().includes('dispon')
      : true;

  return {
    id: String(b?.id ?? b?._id ?? b?.livreId ?? b?.bookId ?? ''),
    title: b?.title ?? b?.titre ?? b?.nom ?? b?.name ?? '',
    author: b?.author ?? b?.auteur ?? b?.autor ?? b?.authorName ?? '',
    isbn: b?.isbn ?? '',
    year: b?.year ?? b?.annee ?? b?.anneePublication ?? new Date().getFullYear(),
    genre: genreStr,
    available,
    coverImage: coverStr,
    description: b?.description ?? b?.resume ?? b?.summary ?? '',
    localOnly: Boolean(b?.localOnly),
    localOverride: Boolean(b?.localOverride),
  };
}

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    // legacy local actions (not used if API is working)
    addBook: (state, action) => {
      state.books.push({
        ...action.payload,
        id: Date.now().toString(),
      });
    },
    updateBook: (state, action) => {
      const idx = state.books.findIndex((b) => b.id === action.payload.id);
      if (idx !== -1) {
        const current = state.books[idx];
        state.books[idx] = {
          ...current,
          ...action.payload,
          localOnly: isLocalBook(current),
          localOverride: !isLocalBook(current),
        };
      }
      saveLocalBooks(storedBooksFromState(state.books));
    },
    deleteBook: (state, action) => {
      state.books = state.books.filter((b) => b.id !== action.payload);
      saveLocalBooks(storedBooksFromState(state.books));
    },
    updateBookAvailability: (state, action) => {
      const book = state.books.find((b) => b.id === action.payload.id);
      if (book) {
        book.available = action.payload.available;
        if (!isLocalBook(book)) book.localOverride = true;
      }
      saveLocalBooks(storedBooksFromState(state.books));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBooks.pending, (state) => {
        state.booksLoading = true;
        state.booksError = null;
      })
      .addCase(loadBooks.fulfilled, (state, action) => {
        state.booksLoading = false;
        state.books = unwrapList(action.payload).map(normalizeLivre);
      })
      .addCase(loadBooks.rejected, (state, action) => {
        state.booksLoading = false;
        state.booksError = action.error?.message || 'Failed to load books';
      })
      .addCase(createBook.fulfilled, (state, action) => {
        // On ne réapplique pas la normalisation à 100% ici,
        // la page fait ensuite dispatch(loadBooks())
        if (!action.payload) return;
        const next = normalizeLivre(action.payload);
        if (next.id && !state.books.some((book) => book.id === next.id)) state.books.unshift(next);
      });
  },
});

export const { addBook, updateBook, deleteBook, updateBookAvailability } = booksSlice.actions;
export default booksSlice.reducer;
