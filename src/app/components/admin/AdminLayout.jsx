import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import {
  LayoutDashboard, BookOpen, Users, BookMarked,
  LogOut, ChevronRight, Shield, Menu, X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/admin/livres', label: 'Livres', icon: BookOpen },
  { to: '/admin/membres', label: 'Membres', icon: Users },
  { to: '/admin/emprunts', label: 'Emprunts', icon: BookMarked },
];

export default function AdminLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-foreground text-background w-64 flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-background/10">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-accent" />
          <span className="text-lg" style={{ fontFamily: 'var(--font-serif)' }}>Admin</span>
        </div>
        <p className="text-xs opacity-50 tracking-widest uppercase">BiblioTech </p>
      </div>

      {/* Profil */}
      <div className="px-6 py-4 border-b border-background/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent text-accent-foreground flex items-center justify-center text-sm font-medium flex-shrink-0">
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.prenom} {user?.nom}</p>
            <p className="text-xs opacity-50 truncate">{user?.email}</p>
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
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'opacity-70 hover:opacity-100 hover:bg-background/10'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
            <ChevronRight className="w-3 h-3 ml-auto opacity-40" />
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-background/10 space-y-1">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 text-sm opacity-70 hover:opacity-100 hover:bg-background/10 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Voir le site
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar desktop */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="flex-shrink-0"><Sidebar /></div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar mobile */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b bg-background" style={{ borderWidth: '0.5px' }}>
          <button onClick={() => setSidebarOpen(true)} className="p-1">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent" />
            <span className="text-sm" style={{ fontFamily: 'var(--font-serif)' }}>Admin</span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
