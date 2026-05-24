import { useAppSelector } from '../../store/hooks';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, ClipboardList, BookOpen, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function MemberDashboard() {
  const user = useAppSelector((s) => s.auth.user);
  const books = useAppSelector((s) => s.books.books);
  const { favorites, cart, orders } = useAppSelector((s) => s.memberSpace);

  const myOrders = orders.filter((o) => o.userId === user?.id);
  const pendingOrders = myOrders.filter((o) => o.status === 'en_attente');
  const approvedOrders = myOrders.filter((o) => o.status === 'approuvé');

  const statusIcon = { en_attente: Clock, approuvé: CheckCircle2, refusé: XCircle, rendu: BookOpen };
  const statusColor = { en_attente: 'text-amber-500', approuvé: 'text-green-500', refusé: 'text-red-500', rendu: 'text-muted-foreground' };
  const statusLabel = { en_attente: 'En attente', approuvé: 'Approuvé', refusé: 'Refusé', rendu: 'Rendu' };

  const cards = [
    { label: 'Favoris', value: favorites.length, icon: Heart, color: 'bg-red-50 text-red-500', to: '/espace-membre/favoris' },
    { label: 'Panier', value: cart.length, icon: ShoppingCart, color: 'bg-blue-50 text-blue-500', to: '/espace-membre/panier' },
    { label: 'Commandes', value: myOrders.length, icon: ClipboardList, color: 'bg-purple-50 text-purple-500', to: '/espace-membre/commandes' },
    { label: 'En attente', value: pendingOrders.length, icon: Clock, color: 'bg-amber-50 text-amber-500', to: '/espace-membre/commandes' },
  ];

  return (
    <div className="space-y-8">
      {/* Bienvenue */}
      <div className="bg-white border p-6" style={{ borderWidth: '0.5px' }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-accent text-accent-foreground flex items-center justify-center text-xl flex-shrink-0" style={{ fontFamily: 'var(--font-serif)' }}>
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </div>
          <div>
            <h1 className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>Bonjour, {user?.prenom} !</h1>
            <p className="text-sm text-muted-foreground">Adhésion <span className="text-accent font-medium">{user?.membership || 'Standard'}</span> · {user?.email}</p>
          </div>
        </div>
        {approvedOrders.length > 0 && (
          <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span><strong>{approvedOrders.length}</strong> commande(s) approuvée(s) — vous pouvez venir récupérer vos livres !</span>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color, to }) => (
          <Link key={label} to={to} className="bg-white border p-5 hover:shadow-md transition-shadow group" style={{ borderWidth: '0.5px' }}>
            <div className={`p-2.5 w-fit ${color} mb-3`}><Icon className="w-5 h-5" /></div>
            <p className="text-2xl font-light mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{value}</p>
            <p className="text-xs text-muted-foreground tracking-widest uppercase group-hover:text-accent transition-colors">{label}</p>
          </Link>
        ))}
      </div>

      {/* Dernières commandes */}
      <div className="bg-white border" style={{ borderWidth: '0.5px' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderWidth: '0.5px' }}>
          <h2 className="text-lg" style={{ fontFamily: 'var(--font-serif)' }}>Mes dernières commandes</h2>
          <Link to="/espace-membre/commandes" className="text-xs text-accent hover:underline">Voir tout</Link>
        </div>
        {myOrders.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-3">Vous n'avez pas encore passé de commande.</p>
            <Link to="/collection" className="text-sm text-accent hover:underline">Parcourir la collection →</Link>
          </div>
        ) : (
          <div className="divide-y">
            {[...myOrders].reverse().slice(0, 5).map((order) => {
              const book = books.find((b) => b.id === order.bookId);
              const Icon = statusIcon[order.status] || Clock;
              return (
                <div key={order.id} className="flex items-center gap-4 px-6 py-3">
                  <div className="w-8 h-11 flex-shrink-0 overflow-hidden bg-muted">
                    {book?.coverImage && <img src={book.coverImage} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{book?.title || '—'}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs ${statusColor[order.status]}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {statusLabel[order.status]}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Favoris récents */}
      {favorites.length > 0 && (
        <div className="bg-white border" style={{ borderWidth: '0.5px' }}>
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderWidth: '0.5px' }}>
            <h2 className="text-lg" style={{ fontFamily: 'var(--font-serif)' }}>Mes favoris récents</h2>
            <Link to="/espace-membre/favoris" className="text-xs text-accent hover:underline">Voir tout</Link>
          </div>
          <div className="flex gap-4 px-6 py-4 overflow-x-auto">
            {favorites.slice(0, 6).map((bookId) => {
              const book = books.find((b) => b.id === bookId);
              if (!book) return null;
              return (
                <div key={bookId} className="flex-shrink-0 w-24">
                  <div className="w-24 h-32 overflow-hidden bg-muted mb-2">
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs font-medium line-clamp-2">{book.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
