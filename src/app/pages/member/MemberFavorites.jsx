import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleFavorite, addToCart } from '../../store/slices/memberSpaceSlice';
import { Heart, ShoppingCart, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MemberFavorites() {
  const dispatch = useAppDispatch();
  const books = useAppSelector((s) => s.books.books);
  const { favorites, cart } = useAppSelector((s) => s.memberSpace);

  const favoriteBooks = books.filter((b) => favorites.includes(b.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-1" style={{ fontFamily: 'var(--font-serif)' }}>Mes favoris</h1>
        <p className="text-sm text-muted-foreground">{favoriteBooks.length} livre{favoriteBooks.length > 1 ? 's' : ''} sauvegardé{favoriteBooks.length > 1 ? 's' : ''}</p>
      </div>

      {favoriteBooks.length === 0 ? (
        <div className="bg-white border py-20 text-center" style={{ borderWidth: '0.5px' }}>
          <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>Aucun favori pour l'instant</p>
          <p className="text-sm text-muted-foreground mb-6">Parcourez la collection et ajoutez des livres à vos favoris.</p>
          <Link to="/collection" className="px-6 py-3 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors">
            Explorer la collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {favoriteBooks.map((book) => {
            const inCart = cart.some((c) => c.bookId === book.id);
            return (
              <div key={book.id} className="bg-white border group hover:shadow-md transition-shadow" style={{ borderWidth: '0.5px' }}>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.style.display = 'none'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button
                    onClick={() => dispatch(toggleFavorite(book.id))}
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white transition-colors"
                    title="Retirer des favoris"
                  >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </button>
                  <span className={`absolute bottom-3 left-3 text-xs px-2 py-1 ${book.available ? 'bg-white/90 text-foreground' : 'bg-black/60 text-white'}`}>
                    {book.available ? 'Disponible' : 'Emprunté'}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1 line-clamp-2" style={{ fontFamily: 'var(--font-serif)' }}>{book.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{book.author} · {book.year}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => dispatch(addToCart(book.id))}
                      disabled={inCart || !book.available}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs tracking-widest uppercase transition-colors ${
                        inCart ? 'bg-green-100 text-green-700 cursor-default'
                        : !book.available ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      {inCart ? 'Dans le panier' : !book.available ? 'Indisponible' : 'Ajouter'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
