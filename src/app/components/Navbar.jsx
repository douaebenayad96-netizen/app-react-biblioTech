import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, X, LogIn, UserPlus, LogOut, User, ChevronDown, Lock, Shield, LayoutDashboard, ShoppingCart, Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [menuOpen, setMenuOpen] = useState(false);
  const cart = useAppSelector((state) => state.memberSpace.cart);
  const favorites = useAppSelector((state) => state.memberSpace.favorites);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fermer le dropdown si clic extérieur
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  const isAdmin = user?.role === 'admin';

  const publicLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'À propos', path: '/a-propos' },
    { name: 'Contact', path: '/contact' },
  ];

  // Collection visible pour tous les connectés, Membres/Emprunts admin seulement
  const memberLinks = [
    { name: 'Collection', path: '/collection' },
  ];

  const adminLinks = [
    { name: 'Membres', path: '/membres' },
    { name: 'Emprunts', path: '/emprunts' },
  ];

  const visibleProtectedLinks = isAdmin
    ? [...memberLinks, ...adminLinks]
    : memberLinks;

  const allLinks = [...publicLinks, ...visibleProtectedLinks];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-sm bg-background/90 border-b" style={{ borderWidth: '0.5px' }}>
      <div className="max-w-7xl mx-auto px-8 py-5">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 tracking-wide" style={{ fontFamily: 'var(--font-serif)' }}>
            <BookOpen className="w-5 h-5 text-accent" />
            <span className="text-xl">BiblioTech </span>
          </Link>

          {/* Liens desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm tracking-widest uppercase transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-foreground border-b border-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                style={{ paddingBottom: '2px' }}
              >
                {link.name}
              </Link>
            ))}

            {/* Liens protégés */}
            {visibleProtectedLinks.map((link) => (
              user ? (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm tracking-widest uppercase transition-colors duration-300 ${
                    location.pathname === link.path
                      ? 'text-foreground border-b border-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  style={{ paddingBottom: '2px' }}
                >
                  {link.name}
                </Link>
              ) : (
                <Link
                  key={link.path}
                  to="/connexion"
                  state={{ from: link.path }}
                  className="flex items-center gap-1 text-sm tracking-widest uppercase text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-300"
                  style={{ paddingBottom: '2px' }}
                  title="Connexion requise"
                >
                  <Lock className="w-3 h-3" />
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* Zone auth desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              /* Menu utilisateur connecté */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 border text-sm hover:bg-muted transition-colors"
                  style={{ borderWidth: '0.5px' }}
                >
                  <div className="w-7 h-7 bg-accent text-accent-foreground flex items-center justify-center text-xs font-medium">
                    {user.prenom?.[0]}{user.nom?.[0]}
                  </div>
                  <span className="max-w-[120px] truncate">{user.prenom} {user.nom}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border shadow-lg z-50" style={{ borderWidth: '0.5px' }}>
                    <div className="px-4 py-3 border-b" style={{ borderWidth: '0.5px' }}>
                      <p className="text-sm font-medium">{user.prenom} {user.nom}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      {user.membership && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-accent/10 text-xs tracking-wider uppercase">
                          {user.membership}
                        </span>
                      )}
                    </div>
                    <div className="py-1">
                      {user?.role === 'admin' && (
                        <Link to="/admin" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                          <Shield className="w-4 h-4 text-accent" />
                          Espace Admin
                        </Link>
                      )}
                      <Link to="/espace-membre" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                        Mon espace
                      </Link>
                      <Link to="/espace-membre/favoris" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                        <Heart className="w-4 h-4 text-muted-foreground" />
                        Mes favoris {favorites.length > 0 && <span className="ml-auto text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{favorites.length}</span>}
                      </Link>
                      <Link to="/espace-membre/panier" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                        <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                        Mon panier {cart.length > 0 && <span className="ml-auto text-xs bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">{cart.length}</span>}
                      </Link>
                    </div>
                    <div className="border-t py-1" style={{ borderWidth: '0.5px' }}>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Boutons connexion / inscription */
              <>
                <Link
                  to="/connexion"
                  className="flex items-center gap-2 px-5 py-2.5 border text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-colors duration-300"
                  style={{ borderWidth: '0.5px' }}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Burger mobile */}
          <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="lg:hidden pt-6 pb-4 border-t mt-5 space-y-1" style={{ borderWidth: '0.5px' }}>
            {allLinks.map((link) => {
              const isProtected = protectedLinks.some((l) => l.path === link.path);
              const isLocked = isProtected && !user;
              return (
                <Link
                  key={link.path}
                  to={isLocked ? '/connexion' : link.path}
                  state={isLocked ? { from: link.path } : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 text-sm tracking-widest uppercase py-2.5 transition-colors ${
                    location.pathname === link.path ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  } ${isLocked ? 'opacity-50' : ''}`}
                >
                  {isLocked && <Lock className="w-3 h-3" />}
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-4 border-t" style={{ borderWidth: '0.5px' }}>
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 bg-accent text-accent-foreground flex items-center justify-center text-xs">
                      {user.prenom?.[0]}{user.nom?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.prenom} {user.nom}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full py-3 text-sm text-red-600 tracking-widest uppercase"
                  >
                    <LogOut className="w-4 h-4" />
                    Se déconnecter
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link
                    to="/connexion"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center py-3 border text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-colors"
                    style={{ borderWidth: '0.5px' }}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/inscription"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center py-3 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
