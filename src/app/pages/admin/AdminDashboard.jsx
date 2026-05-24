import { useAppSelector } from '../../store/hooks';
import { BookOpen, Users, BookMarked, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const books = useAppSelector((s) => s.books.books);
  const members = useAppSelector((s) => s.members.members);
  const loans = useAppSelector((s) => s.loans.loans);
  const orders = useAppSelector((s) => s.memberSpace.orders);

  const activeLoans = loans.filter((l) => l.status === 'active');
  const overdueLoans = activeLoans.filter((l) => new Date(l.dueDate) < new Date());
  const pendingOrders = orders.filter((o) => o.status === 'en_attente');
  const availableBooks = books.filter((b) => b.available);

  const stats = [
    { label: 'Livres au total', value: books.length, sub: `${availableBooks.length} disponibles`, icon: BookOpen, color: 'bg-blue-50 text-blue-600', link: '/admin/livres' },
    { label: 'Membres actifs', value: members.length, sub: 'inscrits', icon: Users, color: 'bg-green-50 text-green-600', link: '/admin/membres' },
    { label: 'Emprunts en cours', value: activeLoans.length, sub: `${overdueLoans.length} en retard`, icon: BookMarked, color: 'bg-amber-50 text-amber-600', link: '/admin/emprunts' },
    { label: 'Commandes en attente', value: pendingOrders.length, sub: 'à traiter', icon: TrendingUp, color: 'bg-purple-50 text-purple-600', link: '/admin/emprunts' },
  ];

  const recentLoans = [...loans].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl mb-1" style={{ fontFamily: 'var(--font-serif)' }}>Tableau de bord</h1>
        <p className="text-muted-foreground text-sm">Vue d'ensemble de la bibliothèque</p>
      </div>

      {/* Alertes */}
      {(overdueLoans.length > 0 || pendingOrders.length > 0) && (
        <div className="space-y-2">
          {overdueLoans.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span><strong>{overdueLoans.length}</strong> emprunt(s) en retard nécessitent votre attention.</span>
              <Link to="/admin/emprunts" className="ml-auto underline text-xs">Voir →</Link>
            </div>
          )}
          {pendingOrders.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 text-amber-700 text-sm">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span><strong>{pendingOrders.length}</strong> commande(s) de membres en attente d'approbation.</span>
              <Link to="/admin/emprunts" className="ml-auto underline text-xs">Traiter →</Link>
            </div>
          )}
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map(({ label, value, sub, icon: Icon, color, link }) => (
          <Link key={label} to={link} className="bg-white border p-6 hover:shadow-md transition-shadow group" style={{ borderWidth: '0.5px' }}>
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 ${color}`}><Icon className="w-5 h-5" /></div>
              <span className="text-3xl font-light" style={{ fontFamily: 'var(--font-serif)' }}>{value}</span>
            </div>
            <p className="text-sm font-medium group-hover:text-accent transition-colors">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
          </Link>
        ))}
      </div>

      {/* Grille inférieure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emprunts récents */}
        <div className="bg-white border" style={{ borderWidth: '0.5px' }}>
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderWidth: '0.5px' }}>
            <h2 className="text-lg" style={{ fontFamily: 'var(--font-serif)' }}>Emprunts récents</h2>
            <Link to="/admin/emprunts" className="text-xs text-accent hover:underline">Voir tout</Link>
          </div>
          <div className="divide-y" style={{ borderWidth: '0.5px' }}>
            {recentLoans.length === 0 ? (
              <p className="px-6 py-8 text-sm text-muted-foreground text-center">Aucun emprunt</p>
            ) : recentLoans.map((loan) => {
              const book = books.find((b) => b.id === loan.bookId);
              const member = members.find((m) => m.id === loan.memberId);
              const overdue = loan.status === 'active' && new Date(loan.dueDate) < new Date();
              return (
                <div key={loan.id} className="flex items-center gap-4 px-6 py-3">
                  <div className="w-8 h-8 flex-shrink-0 overflow-hidden bg-muted">
                    {book?.coverImage && <img src={book.coverImage} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{book?.title || '—'}</p>
                    <p className="text-xs text-muted-foreground">{member?.name || '—'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 ${
                    loan.status === 'returned' ? 'bg-green-100 text-green-700'
                    : overdue ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-700'
                  }`}>
                    {loan.status === 'returned' ? 'Rendu' : overdue ? 'En retard' : 'En cours'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Répartition des genres */}
        <div className="bg-white border" style={{ borderWidth: '0.5px' }}>
          <div className="px-6 py-4 border-b" style={{ borderWidth: '0.5px' }}>
            <h2 className="text-lg" style={{ fontFamily: 'var(--font-serif)' }}>Collection par genre</h2>
          </div>
          <div className="px-6 py-4 space-y-3">
            {Object.entries(
              books.reduce((acc, b) => { acc[b.genre] = (acc[b.genre] || 0) + 1; return acc; }, {})
            ).sort((a, b) => b[1] - a[1]).map(([genre, count]) => (
              <div key={genre}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{genre}</span>
                  <span className="text-muted-foreground">{count} livre{count > 1 ? 's' : ''}</span>
                </div>
                <div className="h-1.5 bg-muted overflow-hidden">
                  <div className="h-full bg-accent transition-all" style={{ width: `${(count / books.length) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Commandes en attente */}
      {pendingOrders.length > 0 && (
        <div className="bg-white border" style={{ borderWidth: '0.5px' }}>
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderWidth: '0.5px' }}>
            <h2 className="text-lg" style={{ fontFamily: 'var(--font-serif)' }}>Commandes en attente</h2>
            <Link to="/admin/emprunts" className="text-xs text-accent hover:underline">Gérer →</Link>
          </div>
          <div className="divide-y">
            {pendingOrders.slice(0, 4).map((order) => {
              const book = books.find((b) => b.id === order.bookId);
              return (
                <div key={order.id} className="flex items-center gap-4 px-6 py-3">
                  <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{book?.title || '—'}</p>
                    <p className="text-xs text-muted-foreground">Demandé le {order.date}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700">En attente</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
