import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { Heart, ShoppingCart, ClipboardList, User, LogOut, BookOpen, ChevronRight, Menu } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/espace-membre', label: 'Mon espace', icon: User, end: true },
  { to: '/espace-membre/favoris', label: 'Mes favoris', icon: Heart },
  { to: '/espace-membre/panier', label: 'Mon panier', icon: ShoppingCart },
  { to: '/espace-membre/commandes', label: 'Mes commandes', icon: ClipboardList },
];

export default function MemberLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const cart = useAppSelector((s) => s.memberSpace.cart);
  const favorites = useAppSelector((s) => s.memberSpace.favorites);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-white border-r w-64 flex-shrink-0" style={{ borderWidth: '0.5px' }}>
      <div className="px-6 py-6 border-b" style={{ borderWidth: '0.5px' }}>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-accent" />
          <span className="text-lg" style={{ fontFamily: 'var(--font-serif)' }}>Espace Membre</span>
        </div>
        <p className="text-xs text-muted-foreground tracking-widest uppercase">BiblioTech </p>
      </div>

      {/* Profil */}
      <div className="px-6 py-4 border-b" style={{ borderWidth: '0.5px' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent text-accent-foreground flex items-center justify-center text-sm font-medium flex-shrink-0">
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.prenom} {user?.nom}</p>
            <span className="text-xs px-2 py-0.5 bg-accent/10 tracking-wider uppercase">{user?.membership || 'Standard'}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                isActive ? 'bg-accent/10 text-foreground border-l-2 border-accent' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{label}</span>
            {label === 'Mon panier' && cart.length > 0 && (
              <span className="w-5 h-5 bg-accent text-accent-foreground text-xs flex items-center justify-center rounded-full">{cart.length}</span>
            )}
            {label === 'Mes favoris' && favorites.length > 0 && (
              <span className="w-5 h-5 bg-red-100 text-red-600 text-xs flex items-center justify-center rounded-full">{favorites.length}</span>
            )}
            <ChevronRight className="w-3 h-3 opacity-30" />
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t space-y-1" style={{ borderWidth: '0.5px' }}>
        <NavLink to="/collection" className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
          <BookOpen className="w-4 h-4" />
          Parcourir la collection
        </NavLink>
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="hidden lg:flex"><Sidebar /></div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="flex-shrink-0"><Sidebar /></div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b bg-white" style={{ borderWidth: '0.5px' }}>
          <button onClick={() => setSidebarOpen(true)} className="p-1"><Menu className="w-5 h-5" /></button>
          <span className="text-sm" style={{ fontFamily: 'var(--font-serif)' }}>Espace Membre</span>
        </div>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
