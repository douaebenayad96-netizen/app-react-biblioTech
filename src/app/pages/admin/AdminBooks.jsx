import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createBook, updateBook, deleteBook, loadBooks } from '../../store/slices/booksSlice';
import { Plus, Pencil, Trash2, X, Search, Check } from 'lucide-react';

const EMPTY = { title: '', author: '', isbn: '', year: new Date().getFullYear(), genre: '', description: '', coverImage: '', available: true };

export default function AdminBooks() {
  const dispatch = useAppDispatch();
  const books = useAppSelector((s) => s.books.books);
  const loans = useAppSelector((s) => s.loans.loans);

  const [search, setSearch] = useState('');
  const [filterGenre, setFilterGenre] = useState('tous');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(loadBooks());
  }, [dispatch]);

  const genres = ['tous', ...Array.from(new Set(books.map((b) => b.genre)))];

  const filtered = books.filter((b) => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    const matchGenre = filterGenre === 'tous' || b.genre === filterGenre;
    return matchSearch && matchGenre;
  });

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (book) => { setSelected(book); setForm({ ...book }); setModal('edit'); };
  const openDelete = (book) => { setSelected(book); setModal('delete'); };
  const closeModal = () => { setModal(null); setSelected(null); setForm(EMPTY); setSaveError(''); setSaving(false); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');

    try {
      if (modal === 'add') {
        await dispatch(createBook(form)).unwrap();
        await dispatch(loadBooks()).unwrap();
      } else {
        dispatch(updateBook({ ...form, id: selected.id }));
      }
      closeModal();
    } catch (error) {
      setSaveError(error?.message || "Impossible d'enregistrer le livre.");
      setSaving(false);
    }
  };

  const handleDelete = () => {
    dispatch(deleteBook(selected.id));
    closeModal();
  };

  const isOnLoan = (bookId) => loans.some((l) => l.bookId === bookId && l.status === 'active');

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-1" style={{ fontFamily: 'var(--font-serif)' }}>Gestion des livres</h1>
          <p className="text-sm text-muted-foreground">{books.length} ouvrages dans la collection</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par titre ou auteur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            style={{ borderWidth: '0.5px' }}
          />
        </div>
        <select
          value={filterGenre}
          onChange={(e) => setFilterGenre(e.target.value)}
          className="px-4 py-2.5 bg-white border text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          style={{ borderWidth: '0.5px' }}
        >
          {genres.map((g) => <option key={g} value={g}>{g === 'tous' ? 'Tous les genres' : g}</option>)}
        </select>
      </div>

      {/* Tableau */}
      <div className="bg-white border overflow-hidden" style={{ borderWidth: '0.5px' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30" style={{ borderWidth: '0.5px' }}>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-muted-foreground font-normal">Livre</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-muted-foreground font-normal hidden md:table-cell">Genre</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-muted-foreground font-normal hidden lg:table-cell">Année</th>
                <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-muted-foreground font-normal">Statut</th>
                <th className="text-right px-4 py-3 text-xs tracking-widest uppercase text-muted-foreground font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderWidth: '0.5px' }}>
              {filtered.map((book) => (
                <tr key={book.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 flex-shrink-0 overflow-hidden bg-muted">
                        <img src={book.coverImage} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate max-w-[200px]">{book.title}</p>
                        <p className="text-xs text-muted-foreground">{book.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="px-2 py-1 bg-muted text-xs">{book.genre}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{book.year}</td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1.5 text-xs w-fit px-2 py-1 ${book.available ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {book.available ? <><Check className="w-3 h-3" /> Disponible</> : 'Emprunté'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(book)} className="p-1.5 hover:bg-muted transition-colors" title="Modifier">
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => openDelete(book)}
                        disabled={isOnLoan(book.id)}
                        className="p-1.5 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title={isOnLoan(book.id) ? 'Livre actuellement emprunté' : 'Supprimer'}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-12 text-muted-foreground text-sm">Aucun livre trouvé.</p>
          )}
        </div>
      </div>

      {/* Modal Ajouter / Modifier */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderWidth: '0.5px' }}>
              <h2 className="text-xl" style={{ fontFamily: 'var(--font-serif)' }}>
                {modal === 'add' ? 'Ajouter un livre' : 'Modifier le livre'}
              </h2>
              <button onClick={closeModal}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">Titre *</label>
                  <input required type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent" style={{ borderWidth: '0.5px' }} placeholder="Titre du livre" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">Auteur *</label>
                  <input required type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full px-4 py-3 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent" style={{ borderWidth: '0.5px' }} placeholder="Nom de l'auteur" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">ISBN</label>
                  <input type="text" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                    className="w-full px-4 py-3 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent" style={{ borderWidth: '0.5px' }} placeholder="978..." />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">Année *</label>
                  <input required type="number" value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent" style={{ borderWidth: '0.5px' }} />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">Genre *</label>
                  <input required type="text" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}
                    className="w-full px-4 py-3 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent" style={{ borderWidth: '0.5px' }} placeholder="ex. Philosophie" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">Disponibilité</label>
                  <select value={form.available ? 'oui' : 'non'} onChange={(e) => setForm({ ...form, available: e.target.value === 'oui' })}
                    className="w-full px-4 py-3 bg-background border text-sm focus:outline-none focus:ring-1 focus:ring-accent" style={{ borderWidth: '0.5px' }}>
                    <option value="oui">Disponible</option>
                    <option value="non">Non disponible</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">URL de la couverture</label>
                  <input type="url" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                    className="w-full px-4 py-3 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent" style={{ borderWidth: '0.5px' }} placeholder="https://..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3} className="w-full px-4 py-3 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" style={{ borderWidth: '0.5px' }} placeholder="Description du livre..." />
                </div>
              </div>
              {saveError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3" style={{ borderWidth: '0.5px' }}>
                  {saveError}
                </p>
              )}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  {saving ? 'Enregistrement...' : modal === 'add' ? 'Ajouter' : 'Enregistrer'}
                </button>
                <button type="button" onClick={closeModal} className="px-6 py-3 border text-sm tracking-widest uppercase hover:bg-muted transition-colors" style={{ borderWidth: '0.5px' }}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Supprimer */}
      {modal === 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white w-full max-w-md p-6">
            <h2 className="text-xl mb-3" style={{ fontFamily: 'var(--font-serif)' }}>Supprimer ce livre ?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Vous êtes sur le point de supprimer <strong>« {selected?.title} »</strong>. Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-600 text-white text-sm tracking-widest uppercase hover:bg-red-700 transition-colors">
                Supprimer
              </button>
              <button onClick={closeModal} className="flex-1 py-3 border text-sm tracking-widest uppercase hover:bg-muted transition-colors" style={{ borderWidth: '0.5px' }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
