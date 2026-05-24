import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createEmprunt, loadEmprunts, returnEmprunt } from '../store/slices/loansSlice';


import { updateBookAvailability } from '../store/slices/booksSlice';
import { Plus, X, BookOpen, Calendar, User, Clock, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function Loans() {
  const dispatch = useAppDispatch();
  const loans = useAppSelector((state) => state.loans.loans);
  const books = useAppSelector((state) => state.books.books);
  const members = useAppSelector((state) => state.members.members);
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin';

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ bookId: '', memberId: '' });

  const availableBooks = books.filter((book) => book.available);

  const handleBorrow = async (e) => {
    e.preventDefault();
    await dispatch(createEmprunt({ livreId: formData.bookId, membreId: formData.memberId }));
    // Recharger l'état après mutation
    dispatch(loadEmprunts());
    // Optionnel: mettre à jour localement la disponibilité
    dispatch(updateBookAvailability({ id: formData.bookId, available: false }));
    setFormData({ bookId: '', memberId: '' });
    setShowForm(false);
  };

  const handleReturn = async (loanId, bookId) => {
    await dispatch(returnEmprunt(loanId));
    dispatch(loadEmprunts());
    dispatch(updateBookAvailability({ id: bookId, available: true }));
  };

  const activeLoans = loans.filter((loan) => loan.status === 'active');
  const returnedLoans = loans.filter((loan) => loan.status === 'returned');

  useEffect(() => {
    dispatch(loadEmprunts());
  }, [dispatch]);


  const getBook = (bookId) => books.find((b) => b.id === bookId);
  const getMember = (memberId) => members.find((m) => m.id === memberId);
  const isOverdue = (dueDate) => new Date(dueDate) < new Date();
  const getDaysUntilDue = (dueDate) => Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen">
      <section className="relative h-[40vh] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1763811938053-2e88eba977a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2000"
            alt="Salle de lecture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/90 to-background/70" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-8 flex items-center">
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-accent mb-4">Circulation</p>
            <h1 className="text-7xl mb-6" style={{ fontFamily: 'var(--font-serif)' }}>Emprunts actifs</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              {activeLoans.length} {activeLoans.length === 1 ? 'livre actuellement en circulation' : 'livres actuellement en circulation'}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 py-16">

        {/* Bannière admin */}
        {isAdmin && (
          <div className="mb-8 flex items-center gap-3 px-5 py-3 bg-accent/10 border border-accent/30 text-sm" style={{ borderWidth: '0.5px' }}>
            <Shield className="w-4 h-4 text-accent" />
            <span>Mode administrateur — vous pouvez créer et gérer les emprunts.</span>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white border p-8" style={{ borderWidth: '0.5px' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-accent/10"><BookOpen className="w-6 h-6 text-accent" /></div>
              <div>
                <p className="text-xs tracking-widest uppercase text-muted-foreground">En cours</p>
                <p className="text-3xl" style={{ fontFamily: 'var(--font-serif)' }}>{activeLoans.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border p-8" style={{ borderWidth: '0.5px' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-muted"><CheckCircle2 className="w-6 h-6" /></div>
              <div>
                <p className="text-xs tracking-widest uppercase text-muted-foreground">Retournés</p>
                <p className="text-3xl" style={{ fontFamily: 'var(--font-serif)' }}>{returnedLoans.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border p-8" style={{ borderWidth: '0.5px' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-muted"><Clock className="w-6 h-6" /></div>
              <div>
                <p className="text-xs tracking-widest uppercase text-muted-foreground">Disponibles</p>
                <p className="text-3xl" style={{ fontFamily: 'var(--font-serif)' }}>{availableBooks.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between mb-12 pb-8 border-b" style={{ borderWidth: '0.5px' }}>
          <div>
            <h2 className="text-4xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>Gestion des emprunts</h2>
            <p className="text-sm text-muted-foreground">Suivez et gérez la circulation des livres</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? 'Annuler' : 'Nouvel emprunt'}
            </button>
          )}
        </div>

        {showForm && isAdmin && (
          <div className="mb-16 bg-white border p-10" style={{ borderWidth: '0.5px' }}>
            <h2 className="text-3xl mb-8" style={{ fontFamily: 'var(--font-serif)' }}>Créer un emprunt</h2>
            <form onSubmit={handleBorrow} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm tracking-wider uppercase mb-3 text-muted-foreground">Choisir un livre *</label>
                  <select
                    required
                    value={formData.bookId}
                    onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                    className="w-full px-5 py-4 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    style={{ borderWidth: '0.5px' }}
                  >
                    <option value="">Sélectionner un livre disponible</option>
                    {availableBooks.map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.title} — {book.author} ({book.genre})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-2">
                    {availableBooks.length} {availableBooks.length === 1 ? 'livre disponible' : 'livres disponibles'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm tracking-wider uppercase mb-3 text-muted-foreground">Choisir un membre *</label>
                  <select
                    required
                    value={formData.memberId}
                    onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                    className="w-full px-5 py-4 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    style={{ borderWidth: '0.5px' }}
                  >
                    <option value="">Sélectionner un membre</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} — {member.membershipType}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-2">Durée d'emprunt : 30 jours</p>
                </div>
              </div>
              <button
                type="submit"
                className="px-10 py-4 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
              >
                Valider l'emprunt
              </button>
            </form>
          </div>
        )}

        <div className="space-y-16">
          <div>
            <h2 className="text-4xl mb-10" style={{ fontFamily: 'var(--font-serif)' }}>Livres en circulation</h2>
            <div className="grid grid-cols-1 gap-6">
              {activeLoans.map((loan) => {
                const book = getBook(loan.bookId);
                const member = getMember(loan.memberId);
                const overdue = isOverdue(loan.dueDate);
                const daysLeft = getDaysUntilDue(loan.dueDate);
                if (!book || !member) return null;

                return (
                  <div key={loan.id} className="group bg-white border overflow-hidden hover:shadow-lg transition-all duration-500" style={{ borderWidth: '0.5px' }}>
                    <div className="flex gap-8 p-8">
                      <div className="w-32 h-44 flex-shrink-0 overflow-hidden">
                        <ImageWithFallback
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                            <p className="text-xs tracking-wider uppercase text-muted-foreground">Livre</p>
                          </div>
                          <h3 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>{book.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                          <p className="text-xs tracking-wider uppercase text-muted-foreground">{book.genre}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <p className="text-xs tracking-wider uppercase text-muted-foreground">Emprunteur</p>
                          </div>
                          <p className="text-lg mb-2" style={{ fontFamily: 'var(--font-serif)' }}>{member.name}</p>
                          <p className="text-sm text-muted-foreground mb-2">{member.email}</p>
                          <p className="text-xs tracking-wider uppercase text-muted-foreground">{member.membershipType}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <p className="text-xs tracking-wider uppercase text-muted-foreground">Dates</p>
                          </div>
                          <div className="space-y-2 text-sm mb-4">
                            <p><span className="text-muted-foreground">Emprunté le :</span> {loan.borrowDate}</p>
                            <p><span className="text-muted-foreground">À rendre le :</span> {loan.dueDate}</p>
                          </div>
                          {overdue ? (
                            <div className="flex items-center gap-2 text-destructive">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-xs tracking-wider uppercase">En retard</span>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground">
                              {daysLeft} {daysLeft === 1 ? 'jour restant' : 'jours restants'}
                            </div>
                          )}
                        </div>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleReturn(loan.id, loan.bookId)}
                          className="px-8 py-4 h-fit border border-primary text-sm tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                          style={{ borderWidth: '0.5px' }}
                        >
                          Retour
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {activeLoans.length === 0 && (
              <div className="text-center py-32 bg-white border" style={{ borderWidth: '0.5px' }}>
                <BookOpen className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
                <p className="text-3xl text-muted-foreground italic mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
                  Aucun emprunt en cours.
                </p>
                <p className="text-muted-foreground">Tous les livres sont actuellement disponibles dans la collection.</p>
              </div>
            )}
          </div>

          {returnedLoans.length > 0 && (
            <div className="pt-16 border-t" style={{ borderWidth: '0.5px' }}>
              <h2 className="text-4xl mb-10" style={{ fontFamily: 'var(--font-serif)' }}>Historique des emprunts</h2>
              <div className="space-y-4">
                {returnedLoans.map((loan) => {
                  const book = getBook(loan.bookId);
                  const member = getMember(loan.memberId);
                  if (!book || !member) return null;
                  return (
                    <div key={loan.id} className="bg-muted/20 border p-6 opacity-70 hover:opacity-100 transition-opacity" style={{ borderWidth: '0.5px' }}>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-sm">
                        <div>
                          <p className="text-xs tracking-wider uppercase text-muted-foreground mb-2">Livre</p>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-muted-foreground text-xs mt-1">{book.author}</p>
                        </div>
                        <div>
                          <p className="text-xs tracking-wider uppercase text-muted-foreground mb-2">Membre</p>
                          <p className="font-medium">{member.name}</p>
                        </div>
                        <div>
                          <p className="text-xs tracking-wider uppercase text-muted-foreground mb-2">Emprunté le</p>
                          <p>{loan.borrowDate}</p>
                        </div>
                        <div>
                          <p className="text-xs tracking-wider uppercase text-muted-foreground mb-2">Date limite</p>
                          <p>{loan.dueDate}</p>
                        </div>
                        <div>
                          <p className="text-xs tracking-wider uppercase text-muted-foreground mb-2">Retourné le</p>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-accent" />
                            <p>{loan.returnDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
