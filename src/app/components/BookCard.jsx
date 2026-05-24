import { Trash2, Heart, ShoppingCart, Check } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Link } from 'react-router-dom';

export default function BookCard({
  book,
  onDelete,
  onFavorite,
  isFavorite = false,
  onCart,
  inCart = false,
  compact = false,
  showDescription = true,
}) {
  return (
    <div className="group relative bg-white border overflow-hidden transition-all duration-500 hover:shadow-lg" style={{ borderWidth: '0.5px' }}>

      {/* Zone image cliquable */}
      <Link to={`/collection/${book.id}`} className="block">
        <div className="aspect-[3/4] overflow-hidden relative">
          <ImageWithFallback
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badge disponibilité */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <span className={`inline-block px-3 py-1 text-xs tracking-widest uppercase backdrop-blur-sm ${book.available ? 'bg-white/90 text-foreground' : 'bg-muted/90 text-muted-foreground'}`}>
              {book.available ? 'Disponible' : 'Emprunté'}
            </span>
          </div>
        </div>
      </Link>

      {/* Boutons overlay (hors du Link pour éviter les conflits) */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        {onFavorite && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFavorite(); }}
            className={`p-2 backdrop-blur-sm transition-colors ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 hover:bg-white'}`}
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        )}
        {onCart && book.available && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!inCart) onCart(); }}
            className={`p-2 backdrop-blur-sm transition-colors ${inCart ? 'bg-green-500 text-white' : 'bg-white/90 hover:bg-white'}`}
            title={inCart ? 'Dans le panier' : 'Ajouter au panier'}
          >
            {inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(book.id); }}
            className="p-2 bg-white/90 backdrop-blur-sm hover:bg-red-50 transition-colors"
            aria-label="Supprimer"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        )}
      </div>

      {/* Infos texte */}
      <div className={compact ? 'p-4' : 'p-6'}>
        <Link to={`/collection/${book.id}`} className="block hover:text-accent transition-colors">
          <h3 className={`mb-1 ${compact ? 'text-base' : 'text-lg'}`} style={{ fontFamily: 'var(--font-serif)' }}>
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
        <div className="flex gap-3 text-xs tracking-wider">
          <span className="uppercase text-muted-foreground">{book.genre}</span>
          <span className="text-muted-foreground">·</span>
          <span className="uppercase text-muted-foreground">{book.year}</span>
        </div>
        {showDescription && book.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mt-3">
            {book.description}
          </p>
        )}

        {/* Barre d'actions bas de carte */}
        {(onCart || onFavorite) && (
          <div className="flex gap-2 mt-4 pt-3 border-t" style={{ borderWidth: '0.5px' }}>
            {onFavorite && (
              <button
                onClick={onFavorite}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border transition-colors ${isFavorite ? 'border-red-300 bg-red-50 text-red-600' : 'border-muted-foreground/30 hover:border-red-300 hover:text-red-500'}`}
                style={{ borderWidth: '0.5px' }}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500' : ''}`} />
                {isFavorite ? 'Favori' : 'Favoris'}
              </button>
            )}
            {onCart && (
              <button
                onClick={() => { if (!inCart && book.available) onCart(); }}
                disabled={!book.available}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs transition-colors ${
                  inCart
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : !book.available
                    ? 'bg-muted text-muted-foreground cursor-not-allowed border border-muted'
                    : 'bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
                style={{ borderWidth: '0.5px' }}
              >
                {inCart
                  ? <><Check className="w-3.5 h-3.5" /> Ajouté</>
                  : <><ShoppingCart className="w-3.5 h-3.5" /> {book.available ? 'Commander' : 'Indisponible'}</>
                }
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
