import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeFromCart, clearCart, placeOrder } from '../../store/slices/memberSpaceSlice';
import { ShoppingCart, Trash2, X, CheckCircle, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MemberCart() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const books = useAppSelector((s) => s.books.books);
  const { cart } = useAppSelector((s) => s.memberSpace);
  const [note, setNote] = useState('');
  const [ordered, setOrdered] = useState(false);

  const cartBooks = cart.map((c) => ({ ...c, book: books.find((b) => b.id === c.bookId) })).filter((c) => c.book);

  const handleOrder = () => {
    if (cartBooks.length === 0) return;
    dispatch(placeOrder({
      bookIds: cartBooks.map((c) => c.bookId),
      userId: user?.id,
      note,
    }));
    setNote('');
    setOrdered(true);
  };

  if (ordered) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl mb-3" style={{ fontFamily: 'var(--font-serif)' }}>Commande envoyée !</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          Votre demande a été transmise à l'équipe BiblioTech . Vous serez notifié dès qu'elle sera traitée.
        </p>
        <div className="flex gap-3">
          <Link to="/espace-membre/commandes" className="px-6 py-3 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors">
            Voir mes commandes
          </Link>
          <button onClick={() => setOrdered(false)} className="px-6 py-3 border text-sm tracking-widest uppercase hover:bg-muted transition-colors" style={{ borderWidth: '0.5px' }}>
            Continuer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-1" style={{ fontFamily: 'var(--font-serif)' }}>Mon panier</h1>
          <p className="text-sm text-muted-foreground">{cartBooks.length} livre{cartBooks.length > 1 ? 's' : ''}</p>
        </div>
        {cartBooks.length > 0 && (
          <button onClick={() => dispatch(clearCart())} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" /> Vider
          </button>
        )}
      </div>

      {cartBooks.length === 0 ? (
        <div className="bg-white border py-20 text-center" style={{ borderWidth: '0.5px' }}>
          <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>Votre panier est vide</p>
          <p className="text-sm text-muted-foreground mb-6">Ajoutez des livres depuis la collection ou vos favoris.</p>
          <Link to="/collection" className="px-6 py-3 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors">
            Explorer la collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des livres */}
          <div className="lg:col-span-2 space-y-3">
            {cartBooks.map(({ bookId, book }) => (
              <div key={bookId} className="bg-white border flex gap-4 p-4" style={{ borderWidth: '0.5px' }}>
                <div className="w-16 h-22 flex-shrink-0 overflow-hidden bg-muted">
                  <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{book.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{book.author} · {book.genre} · {book.year}</p>
                  <span className={`text-xs px-2 py-0.5 ${book.available ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {book.available ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>
                <button onClick={() => dispatch(removeFromCart(bookId))} className="p-1.5 h-fit hover:bg-muted transition-colors flex-shrink-0">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>

          {/* Récapitulatif & commande */}
          <div className="space-y-4">
            <div className="bg-white border p-5" style={{ borderWidth: '0.5px' }}>
              <h2 className="text-lg mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Récapitulatif</h2>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livres sélectionnés</span>
                  <span>{cartBooks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Disponibles</span>
                  <span className="text-green-600">{cartBooks.filter((c) => c.book.available).length}</span>
                </div>
                {cartBooks.some((c) => !c.book.available) && (
                  <div className="flex justify-between text-amber-600">
                    <span>Indisponibles</span>
                    <span>{cartBooks.filter((c) => !c.book.available).length}</span>
                  </div>
                )}
              </div>
              <div className="border-t pt-4" style={{ borderWidth: '0.5px' }}>
                <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">Note (optionnel)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Message pour la bibliothèque..."
                  className="w-full px-3 py-2 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  style={{ borderWidth: '0.5px' }}
                />
              </div>
              <button
                onClick={handleOrder}
                className="w-full mt-4 py-3 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Commander ({cartBooks.length})
              </button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Durée d'emprunt : 30 jours
              </p>
            </div>

            <div className="bg-accent/5 border border-accent/20 p-4 text-xs text-muted-foreground" style={{ borderWidth: '0.5px' }}>
              <BookOpen className="w-4 h-4 text-accent mb-2" />
              Votre commande sera examinée par notre équipe. Vous recevrez une confirmation sous 24h.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
