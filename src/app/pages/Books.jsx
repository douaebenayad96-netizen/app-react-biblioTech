import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createBook, deleteBook, loadBooks } from '../store/slices/booksSlice';
import { toggleFavorite, addToCart } from '../store/slices/memberSpaceSlice';
import BookCard from '../components/BookCard';
import { Plus, X, Filter, Grid3x3, List, Lock, LogIn, Heart, ShoppingCart, Check } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function Collection() {
  const dispatch = useAppDispatch();
  const books = useAppSelector((state) => state.books.books);
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin';
  const { favorites, cart } = useAppSelector((state) => state.memberSpace);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState('grille');
  const [filterGenre, setFilterGenre] = useState('tous');
  const [filterStatus, setFilterStatus] = useState('tous');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: new Date().getFullYear(),
    genre: '',
    description: '',
    coverImage: '',
  });

  const normalizeGenre = (g) => (typeof g === 'string' ? g : '');
  const booksGenres = books.map((book) => normalizeGenre(book.genre)).filter(Boolean);
  const genres = ['tous', ...Array.from(new Set(booksGenres))];

  const filteredBooks = books.filter((book) => {
    const matchGenre = filterGenre === 'tous' || normalizeGenre(book.genre) === filterGenre;
    const matchStatus =
      filterStatus === 'tous' ||
      (filterStatus === 'disponible' && book.available) ||
      (filterStatus === 'emprunte' && !book.available);

    return matchGenre && matchStatus;
  });

  const availableCount = filteredBooks.filter((book) => book.available).length;

  useEffect(() => {
    dispatch(loadBooks());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createBook({
        ...formData,
        statut: 'Disponible',
      })
    ).then(() => dispatch(loadBooks()));

    setFormData({ title: '', author: '', year: new Date().getFullYear(), genre: '', description: '', coverImage: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteBook(id));
  };

  return (
    <div className="min-h-screen">
      <section className="relative h-[40vh] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1746458258966-83fcb7e92081?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2000"
            alt="Rayons de bibliothèque"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/90 to-background/70" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-8 flex items-center">
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-accent mb-4">Archive complète</p>
            <h1 className="text-7xl mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
              Notre Collection
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              {books.length} {books.length === 1 ? 'ouvrage soigneusement sélectionné' : 'ouvrages soigneusement sélectionnés'} couvrant philosophie, design, sciences et arts
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 sm:mb-12 pb-8 border-b" style={{ borderWidth: '0.5px' }}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 lg:gap-8 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <select
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                className="w-full sm:w-auto min-w-0 px-4 py-2 border text-xs sm:text-sm tracking-wider uppercase bg-white focus:outline-none focus:ring-1 focus:ring-accent"
                style={{ borderWidth: '0.5px' }}
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre === 'tous' ? 'Tous les genres' : genre}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-auto min-w-0 px-4 py-2 border text-xs sm:text-sm tracking-wider uppercase bg-white focus:outline-none focus:ring-1 focus:ring-accent"
              style={{ borderWidth: '0.5px' }}
            >
              <option value="tous">Tous les statuts</option>
              <option value="disponible">Disponible</option>
              <option value="emprunte">Emprunté</option>
            </select>

            <div className="text-xs sm:text-sm text-muted-foreground">
              {availableCount} sur {filteredBooks.length} disponibles
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex border" style={{ borderWidth: '0.5px' }}>
              <button
                onClick={() => setViewMode('grille')}
                className={`flex-1 sm:flex-none p-3 transition-colors ${viewMode === 'grille' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('liste')}
                className={`flex-1 sm:flex-none p-3 transition-colors border-l ${viewMode === 'liste' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                style={{ borderWidth: '0.5px' }}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {isAdmin ? (
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-primary text-primary-foreground text-xs sm:text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
              >
                {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showForm ? 'Annuler' : 'Ajouter un livre'}
              </button>
            ) : (
              <Link
                to="/connexion"
                state={{ from: '/collection' }}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 border text-xs sm:text-sm tracking-widest uppercase text-muted-foreground hover:bg-foreground hover:text-background transition-colors duration-300"
                style={{ borderWidth: '0.5px' }}
                title="Réservé aux administrateurs"
              >
                <Lock className="w-4 h-4" />
                Ajouter un livre
              </Link>
            )}
          </div>
        </div>

        {/* Bannière info visiteur */}
        {!user && (
          <div className="mb-8 flex items-center justify-between gap-4 px-6 py-4 bg-accent/5 border border-accent/20" style={{ borderWidth: '0.5px' }}>
            <div className="flex items-center gap-3">
              <LogIn className="w-5 h-5 text-accent flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Vous consultez la collection en mode visiteur. <strong>Connectez-vous</strong> pour emprunter des livres.
              </p>
            </div>
            <Link
              to="/connexion"
              state={{ from: '/collection' }}
              className="flex-shrink-0 px-5 py-2 bg-primary text-primary-foreground text-xs tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Se connecter
            </Link>
          </div>
        )}

        {showForm && isAdmin && (
          <div className="mb-16 bg-white border p-10" style={{ borderWidth: '0.5px' }}>
            <h2 className="text-3xl mb-8" style={{ fontFamily: 'var(--font-serif)' }}>
              Nouvelle acquisition
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm tracking-wider uppercase mb-3 text-muted-foreground">
                    Titre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-5 py-4 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    style={{ borderWidth: '0.5px' }}
                    placeholder="Titre du livre"
                  />
                </div>
                <div>
                  <label className="block text-sm tracking-wider uppercase mb-3 text-muted-foreground">
                    Auteur *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-5 py-4 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    style={{ borderWidth: '0.5px' }}
                    placeholder="Nom de l'auteur"
                  />
                </div>
                <div>
                  <label className="block text-sm tracking-wider uppercase mb-3 text-muted-foreground">
                    Année *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full px-5 py-4 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    style={{ borderWidth: '0.5px' }}
                    placeholder="Année de publication"
                  />
                </div>
                <div>
                  <label className="block text-sm tracking-wider uppercase mb-3 text-muted-foreground">
                    Genre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-5 py-4 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    style={{ borderWidth: '0.5px' }}
                    placeholder="ex. Philosophie, Design"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm tracking-wider uppercase mb-3 text-muted-foreground">
                    URL de la couverture
                  </label>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="w-full px-5 py-4 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    style={{ borderWidth: '0.5px' }}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm tracking-wider uppercase mb-3 text-muted-foreground">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-5 py-4 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    style={{ borderWidth: '0.5px' }}
                    placeholder="Brève description du livre..."
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-10 py-4 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
              >
                Ajouter à la collection
              </button>
            </form>
          </div>
        )}

        {viewMode === 'grille' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} onDelete={isAdmin ? handleDelete : undefined}
                onFavorite={() => dispatch(toggleFavorite(book.id))}
                isFavorite={favorites.includes(book.id)}
                onCart={() => dispatch(addToCart(book.id))}
                inCart={cart.some((c) => c.bookId === book.id)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-white border p-4 sm:p-6 lg:p-8 hover:shadow-lg transition-shadow duration-500 flex flex-col sm:flex-row gap-5 sm:gap-6 lg:gap-8" style={{ borderWidth: '0.5px' }}>
                <Link to={`/collection/${book.id}`} className="w-full sm:w-28 lg:w-32 aspect-[3/4] sm:h-40 lg:h-44 flex-shrink-0 overflow-hidden block bg-muted">
                  <ImageWithFallback
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/collection/${book.id}`} className="hover:text-accent transition-colors">
                    <h3 className="text-xl sm:text-2xl mb-2 break-words" style={{ fontFamily: 'var(--font-serif)' }}>
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-4">{book.author}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {book.description}
                  </p>
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4 mt-4">
                    <div className="flex items-center gap-3 sm:gap-6 text-xs tracking-wider flex-wrap">
                      <span className="uppercase text-muted-foreground">{book.genre}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="uppercase text-muted-foreground">{book.year}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className={`uppercase ${book.available ? 'text-accent' : 'text-muted-foreground'}`}>
                        {book.available ? 'Disponible' : 'Emprunté'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 lg:ml-auto flex-wrap">
                      <button onClick={() => dispatch(toggleFavorite(book.id))}
                        className={`p-2 border transition-colors ${favorites.includes(book.id) ? 'border-red-300 bg-red-50 text-red-500' : 'border-muted-foreground/20 hover:border-red-300 hover:text-red-500'}`}
                        style={{ borderWidth: '0.5px' }}>
                        <Heart className={`w-4 h-4 ${favorites.includes(book.id) ? 'fill-red-500' : ''}`} />
                      </button>
                      <button onClick={() => { if (!cart.some(c => c.bookId === book.id) && book.available) dispatch(addToCart(book.id)); }}
                        disabled={!book.available}
                        className={`p-2 border transition-colors ${cart.some(c => c.bookId === book.id) ? 'border-green-300 bg-green-50 text-green-600' : !book.available ? 'border-muted bg-muted text-muted-foreground cursor-not-allowed' : 'border-muted-foreground/20 hover:border-accent hover:text-accent'}`}
                        style={{ borderWidth: '0.5px' }}>
                        {cart.some(c => c.bookId === book.id) ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                      </button>
                      <Link to={`/collection/${book.id}`}
                        className="flex-1 sm:flex-none text-center px-4 py-2 bg-primary text-primary-foreground text-xs tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors">
                        Voir les détails
                      </Link>
                    </div>
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="p-3 h-fit self-start sm:self-auto hover:bg-muted transition-colors"
                    aria-label="Supprimer le livre"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {filteredBooks.length === 0 && (
          <div className="text-center py-32">
            <p className="text-3xl text-muted-foreground italic mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              {filterGenre === 'tous' ? 'L\'archive attend son premier volume.' : `Aucun livre trouvé dans ${filterGenre}.`}
            </p>
            {filterGenre !== 'tous' && (
              <button
                onClick={() => setFilterGenre('tous')}
                className="text-sm tracking-widest uppercase text-accent hover:underline"
              >
                Voir tous les livres
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
