import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleFavorite, addToCart } from '../store/slices/memberSpaceSlice';
import {
  ArrowLeft, Heart, ShoppingCart, Check, BookOpen,
  Calendar, Tag, User, CheckCircle, XCircle, Pencil,
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const book = useAppSelector((s) => s.books.books.find((b) => b.id === id));
  const user = useAppSelector((s) => s.auth.user);
  const loans = useAppSelector((s) => s.loans.loans);
  const books = useAppSelector((s) => s.books.books);
  const { favorites, cart } = useAppSelector((s) => s.memberSpace);

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-8">
        <BookOpen className="w-16 h-16 text-muted-foreground mb-6" />
        <h1 className="text-4xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Livre introuvable</h1>
        <p className="text-muted-foreground mb-8">Ce livre n'existe pas ou a été supprimé.</p>
        <Link to="/collection" className="px-8 py-3 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors">
          Retour à la collection
        </Link>
      </div>
    );
  }

  const isFavorite = favorites.includes(book.id);
  const inCart = cart.some((c) => c.bookId === book.id);
  const isAdmin = user?.role === 'admin';

  // Emprunt actif pour ce livre
  const activeLoan = loans.find((l) => l.bookId === book.id && l.status === 'active');
  const loanHistory = loans.filter((l) => l.bookId === book.id);

  // Livres similaires (même genre, différent)
  const similar = books.filter((b) => b.genre === book.genre && b.id !== book.id).slice(0, 4);

  const daysLeft = activeLoan
    ? Math.ceil((new Date(activeLoan.dueDate) - new Date()) / 86400000)
    : null;

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-8 pt-8 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Retour à la collection
        </button>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Colonne gauche — couverture */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                {/* Badge disponibilité */}
                <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 text-xs tracking-widest uppercase ${book.available ? 'bg-white text-foreground' : 'bg-foreground text-background'}`}>
                  {book.available
                    ? <><CheckCircle className="w-3.5 h-3.5 text-green-600" /> Disponible</>
                    : <><XCircle className="w-3.5 h-3.5 text-red-400" /> Emprunté</>
                  }
                </div>
              </div>

              {/* Actions */}
              {user && (
                <div className="space-y-3">
                  {/* Ajouter au panier */}
                  <button
                    onClick={() => { if (!inCart && book.available) dispatch(addToCart(book.id)); }}
                    disabled={!book.available}
                    className={`w-full flex items-center justify-center gap-2 py-4 text-sm tracking-widest uppercase transition-colors duration-300 ${
                      inCart
                        ? 'bg-green-600 text-white cursor-default'
                        : !book.available
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {inCart
                      ? <><Check className="w-4 h-4" /> Dans le panier</>
                      : <><ShoppingCart className="w-4 h-4" /> {book.available ? 'Ajouter au panier' : 'Indisponible'}</>
                    }
                  </button>

                  {/* Favoris */}
                  <button
                    onClick={() => dispatch(toggleFavorite(book.id))}
                    className={`w-full flex items-center justify-center gap-2 py-3 text-sm tracking-widest uppercase border transition-colors duration-300 ${
                      isFavorite
                        ? 'border-red-300 bg-red-50 text-red-600'
                        : 'border-foreground/20 hover:border-red-300 hover:text-red-500'
                    }`}
                    style={{ borderWidth: '0.5px' }}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  </button>

                  {/* Lien panier si ajouté */}
                  {inCart && (
                    <Link
                      to="/espace-membre/panier"
                      className="block text-center text-xs text-accent hover:underline"
                    >
                      Voir mon panier →
                    </Link>
                  )}

                  {/* Bouton admin */}
                  {isAdmin && (
                    <Link
                      to="/admin/livres"
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm tracking-widest uppercase border border-accent/40 text-accent hover:bg-accent/10 transition-colors"
                      style={{ borderWidth: '0.5px' }}
                    >
                      <Pencil className="w-4 h-4" />
                      Modifier ce livre
                    </Link>
                  )}
                </div>
              )}

              {/* Infos emprunt en cours */}
              {activeLoan && (
                <div className={`p-4 border text-sm space-y-1 ${daysLeft < 0 ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`} style={{ borderWidth: '0.5px' }}>
                  <p className="font-medium text-xs tracking-widest uppercase text-muted-foreground mb-2">Emprunt en cours</p>
                  <p>Retour prévu : <strong>{activeLoan.dueDate}</strong></p>
                  {daysLeft !== null && (
                    <p className={daysLeft < 0 ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                      {daysLeft < 0 ? `En retard de ${Math.abs(daysLeft)} jour(s)` : `${daysLeft} jour(s) restant(s)`}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Colonne droite — détails */}
          <div className="lg:col-span-2 space-y-10">
            {/* En-tête */}
            <div>
              <p className="text-sm tracking-[0.3em] uppercase text-accent mb-3">{book.genre}</p>
              <h1 className="text-5xl lg:text-6xl leading-tight mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
                {book.title}
              </h1>
              <p className="text-2xl text-muted-foreground mb-6">{book.author}</p>

              {/* Métadonnées */}
              <div className="flex flex-wrap gap-6 pb-8 border-b" style={{ borderWidth: '0.5px' }}>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>Publié en <strong className="text-foreground">{book.year}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag className="w-4 h-4 text-accent" />
                  <span>Genre : <strong className="text-foreground">{book.genre}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4 text-accent" />
                  <span>Auteur : <strong className="text-foreground">{book.author}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="w-4 h-4 text-accent" />
                  <span>
                    Statut :{' '}
                    <strong className={book.available ? 'text-green-600' : 'text-amber-600'}>
                      {book.available ? 'Disponible' : 'Emprunté'}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl mb-5" style={{ fontFamily: 'var(--font-serif)' }}>À propos de ce livre</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {book.description || 'Aucune description disponible pour cet ouvrage.'}
              </p>
            </div>

            {/* Historique des emprunts (admin seulement) */}
            {isAdmin && loanHistory.length > 0 && (
              <div>
                <h2 className="text-2xl mb-5" style={{ fontFamily: 'var(--font-serif)' }}>
                  Historique des emprunts
                  <span className="text-base text-muted-foreground ml-3 font-normal">({loanHistory.length})</span>
                </h2>
                <div className="border overflow-hidden" style={{ borderWidth: '0.5px' }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/30 border-b" style={{ borderWidth: '0.5px' }}>
                        <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-muted-foreground font-normal">Membre</th>
                        <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-muted-foreground font-normal">Emprunté</th>
                        <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-muted-foreground font-normal">Retour</th>
                        <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-muted-foreground font-normal">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {loanHistory.map((loan) => (
                        <tr key={loan.id} className="hover:bg-muted/10">
                          <td className="px-4 py-3 text-muted-foreground">{loan.memberId}</td>
                          <td className="px-4 py-3">{loan.borrowDate}</td>
                          <td className="px-4 py-3">{loan.dueDate}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 ${loan.status === 'returned' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {loan.status === 'returned' ? 'Rendu' : 'En cours'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Appel à l'action si non connecté */}
            {!user && (
              <div className="flex items-center gap-6 p-6 bg-accent/5 border border-accent/20" style={{ borderWidth: '0.5px' }}>
                <BookOpen className="w-10 h-10 text-accent flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium mb-1">Connectez-vous pour emprunter ce livre</p>
                  <p className="text-sm text-muted-foreground">Créez un compte ou connectez-vous pour accéder à la collection complète.</p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <Link to="/connexion" state={{ from: `/collection/${book.id}` }}
                    className="px-5 py-2.5 bg-primary text-primary-foreground text-xs tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors">
                    Connexion
                  </Link>
                  <Link to="/inscription"
                    className="px-5 py-2.5 border text-xs tracking-widest uppercase hover:bg-foreground hover:text-background transition-colors"
                    style={{ borderWidth: '0.5px' }}>
                    S'inscrire
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Livres similaires */}
        {similar.length > 0 && (
          <div className="mt-24 pt-16 border-t" style={{ borderWidth: '0.5px' }}>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-sm tracking-[0.3em] uppercase text-accent mb-2">Du même genre</p>
                <h2 className="text-4xl" style={{ fontFamily: 'var(--font-serif)' }}>Vous aimerez aussi</h2>
              </div>
              <Link to="/collection" className="text-sm tracking-widest uppercase text-muted-foreground hover:text-accent transition-colors">
                Voir tout →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {similar.map((b) => (
                <Link key={b.id} to={`/collection/${b.id}`} className="group block">
                  <div className="aspect-[3/4] overflow-hidden mb-3 bg-muted">
                    <ImageWithFallback
                      src={b.coverImage}
                      alt={b.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-sm font-medium line-clamp-2 group-hover:text-accent transition-colors" style={{ fontFamily: 'var(--font-serif)' }}>
                    {b.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{b.author}</p>
                  <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 ${b.available ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                    {b.available ? 'Disponible' : 'Emprunté'}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
