import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, BookOpen } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, clearError } from '../store/slices/authSlice';

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, error } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', remember: false });

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user) {
      const destination = location.state?.from || '/';
      navigate(destination, { replace: true });
    }
  }, [user, navigate, location.state]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email: formData.email, password: formData.password }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Panneau gauche — image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200"
          alt="Bibliothèque"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="absolute inset-0 flex flex-col justify-end p-16 text-background">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-8 h-8 text-accent" />
            <span className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>BiblioTech </span>
          </div>
          <p className="text-4xl leading-tight mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            « La lecture est à l'esprit ce que l'exercice est au corps. »
          </p>
          <p className="text-sm tracking-widest uppercase opacity-60">— Joseph Addison</p>

          {/* Comptes de démo */}
          <div className="mt-10 p-5 bg-background/10 backdrop-blur-sm border border-background/20">
            <p className="text-xs tracking-widest uppercase opacity-70 mb-3">Comptes de démonstration</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between opacity-80">
                <span>admin@bibliotech.com</span>
                <span className="opacity-60">admin123</span>
              </div>
              <div className="flex justify-between opacity-80">
                <span>marie@example.com</span>
                <span className="opacity-60">marie123</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panneau droit — formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16 bg-background">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-12 lg:hidden">
            <BookOpen className="w-6 h-6 text-accent" />
            <span className="text-xl" style={{ fontFamily: 'var(--font-serif)' }}>BiblioTech </span>
          </div>

          {location.state?.from && (
            <div className="mb-6 px-5 py-4 bg-accent/10 border border-accent/30 text-sm text-foreground">
              🔒 Connectez-vous pour accéder à cette page.
            </div>
          )}

          <p className="text-sm tracking-[0.3em] uppercase text-accent mb-3">Bienvenue</p>
          <h1 className="text-4xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>Connexion</h1>
          <p className="text-muted-foreground mb-10">
            Pas encore membre ?{' '}
            <Link to="/inscription" className="text-accent hover:underline">Créer un compte</Link>
          </p>

          {error && (
            <div className="mb-6 px-5 py-4 bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">
                Adresse e-mail
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-4 bg-white border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                style={{ borderWidth: '0.5px' }}
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs tracking-widest uppercase text-muted-foreground">
                  Mot de passe
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-5 py-4 bg-white border text-sm focus:outline-none focus:ring-2 focus:ring-accent pr-12"
                  style={{ borderWidth: '0.5px' }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                checked={formData.remember}
                onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                className="w-4 h-4 accent-accent"
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground">
                Se souvenir de moi
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
            >
              Se connecter
            </button>
          </form>

          <div className="mt-8 p-4 bg-muted/40 border text-xs text-muted-foreground lg:hidden" style={{ borderWidth: '0.5px' }}>
            <p className="font-medium mb-2">Comptes de démo :</p>
            <p>admin@bibliotech.com / admin123</p>
            <p>marie@example.com / marie123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
