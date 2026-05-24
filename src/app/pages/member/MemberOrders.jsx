import { useAppSelector } from '../../store/hooks';
import { Clock, CheckCircle2, XCircle, BookOpen, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const statusConfig = {
  en_attente: { label: 'En attente', icon: Clock, color: 'bg-amber-100 text-amber-700', desc: 'Votre demande est en cours d\'examen.' },
  approuvé: { label: 'Approuvé', icon: CheckCircle2, color: 'bg-green-100 text-green-700', desc: 'Venez récupérer votre livre à la bibliothèque.' },
  refusé: { label: 'Refusé', icon: XCircle, color: 'bg-red-100 text-red-700', desc: 'Votre demande n\'a pas pu être acceptée.' },
  rendu: { label: 'Rendu', icon: BookOpen, color: 'bg-muted text-muted-foreground', desc: 'Livre retourné à la bibliothèque.' },
};

export default function MemberOrders() {
  const user = useAppSelector((s) => s.auth.user);
  const books = useAppSelector((s) => s.books.books);
  const { orders } = useAppSelector((s) => s.memberSpace);
  const [filter, setFilter] = useState('tous');

  const myOrders = orders.filter((o) => o.userId === user?.id);
  const filtered = filter === 'tous' ? myOrders : myOrders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-1" style={{ fontFamily: 'var(--font-serif)' }}>Mes commandes</h1>
        <p className="text-sm text-muted-foreground">{myOrders.length} commande{myOrders.length > 1 ? 's' : ''} au total</p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {['tous', 'en_attente', 'approuvé', 'refusé', 'rendu'].map((s) => {
          const count = s === 'tous' ? myOrders.length : myOrders.filter((o) => o.status === s).length;
          return (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 text-xs tracking-widest uppercase border transition-colors ${filter === s ? 'bg-foreground text-background border-foreground' : 'border-muted-foreground/30 hover:border-foreground'}`}
              style={{ borderWidth: '0.5px' }}>
              {s === 'tous' ? 'Toutes' : statusConfig[s]?.label} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border py-20 text-center" style={{ borderWidth: '0.5px' }}>
          <ClipboardList className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            {myOrders.length === 0 ? 'Aucune commande' : 'Aucune commande dans cette catégorie'}
          </p>
          {myOrders.length === 0 && (
            <>
              <p className="text-sm text-muted-foreground mb-6">Ajoutez des livres à votre panier et passez commande.</p>
              <Link to="/collection" className="px-6 py-3 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors">
                Explorer la collection
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {[...filtered].reverse().map((order) => {
            const book = books.find((b) => b.id === order.bookId);
            const cfg = statusConfig[order.status] || statusConfig.en_attente;
            const Icon = cfg.icon;
            return (
              <div key={order.id} className="bg-white border" style={{ borderWidth: '0.5px' }}>
                <div className="flex gap-4 p-5">
                  <div className="w-16 h-22 flex-shrink-0 overflow-hidden bg-muted">
                    {book?.coverImage && <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-medium" style={{ fontFamily: 'var(--font-serif)' }}>{book?.title || 'Livre inconnu'}</h3>
                      <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 flex-shrink-0 ${cfg.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{book?.author} · {book?.genre}</p>
                    <p className="text-xs text-muted-foreground mb-2">Commandé le {order.date}</p>
                    <p className="text-xs text-muted-foreground italic">{cfg.desc}</p>
                    {order.note && (
                      <p className="text-xs text-muted-foreground mt-2 px-3 py-2 bg-muted/40 border-l-2 border-accent">
                        Note : « {order.note} »
                      </p>
                    )}
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
