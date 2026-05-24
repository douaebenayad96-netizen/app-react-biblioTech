import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, BookOpen, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { register, clearError } from '../store/slices/authSlice';

export default function Signup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, error } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    confirm: '',
    membership: 'Standard',
    cgu: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const validate = () => {
    const e = {};
    if (!formData.prenom) e.prenom = 'Champ requis';
    if (!formData.nom) e.nom = 'Champ requis';
    if (!formData.email) e.email = 'Champ requis';
    if (formData.password.length < 8) e.password = 'Minimum 8 caractères';
    if (formData.password !== formData.confirm) e.confirm = 'Les mots de passe ne correspondent pas';
    if (!formData.cgu) e.cgu = 'Vous devez accepter les CGU';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    dispatch(register({
      prenom: formData.prenom,
      nom: formData.nom,
      email: formData.email,
      password: formData.password,
      membership: formData.membership,
    }));
  };

  const memberships = [
    { type: 'Standard', desc: 'Jusqu\'à 3 livres empruntés simultanément' },
    { type: 'Premium', desc: 'Jusqu\'à 10 livres + accès prioritaire' },
    { type: 'Érudit', desc: 'Emprunts illimités + salle de recherche' },
  ];

  const strength = formData.password.length === 0 ? 0
    : formData.password.length < 6 ? 1
    : formData.password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Faible', 'Moyen', 'Fort'];
  const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-green-500'];

  return (
    <div className="min-h-screen flex">
      {/* Panneau gauche */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200"
          alt="Bibliothèque"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/65" />
        <div className="absolute inset-0 flex flex-col justify-end p-16 text-background">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-8 h-8 text-accent" />
            <span className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>BiblioTech </span>
          </div>
          <h2 className="text-4xl mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
            Rejoignez notre communauté de lecteurs
          </h2>
          <div className="space-y-3">
            {['Accès à plus de 500 ouvrages soigneusement sélectionnés', 'Gestion simplifiée de vos emprunts', 'Recommandations personnalisées'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-foreground" />
                </div>
                <p className="text-sm opacity-90">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panneau droit */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-background overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <BookOpen className="w-6 h-6 text-accent" />
            <span className="text-xl" style={{ fontFamily: 'var(--font-serif)' }}>BiblioTech </span>
          </div>

          <p className="text-sm tracking-[0.3em] uppercase text-accent mb-3">Nouveau membre</p>
          <h1 className="text-4xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>Créer un compte</h1>
          <p className="text-muted-foreground mb-8">
            Déjà membre ?{' '}
            <Link to="/connexion" className="text-accent hover:underline">Se connecter</Link>
          </p>

          {error && (
            <div className="mb-6 px-5 py-4 bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nom / Prénom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">Prénom</label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  className="w-full px-4 py-3 bg-white border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  style={{ borderWidth: '0.5px' }}
                  placeholder="Jean"
                />
                {errors.prenom && <p className="text-xs text-red-500 mt-1">{errors.prenom}</p>}
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">Nom</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-4 py-3 bg-white border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  style={{ borderWidth: '0.5px' }}
                  placeholder="Dupont"
                />
                {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">Adresse e-mail</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-3 bg-white border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                style={{ borderWidth: '0.5px' }}
                placeholder="votre@email.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-5 py-3 bg-white border text-sm focus:outline-none focus:ring-2 focus:ring-accent pr-12"
                  style={{ borderWidth: '0.5px' }}
                  placeholder="Minimum 8 caractères"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`h-1 flex-1 ${i <= strength ? strengthColor[strength] : 'bg-muted'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{strengthLabel[strength]}</span>
                </div>
              )}
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirmation */}
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">Confirmer le mot de passe</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={formData.confirm}
                  onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
                  className="w-full px-5 py-3 bg-white border text-sm focus:outline-none focus:ring-2 focus:ring-accent pr-12"
                  style={{ borderWidth: '0.5px' }}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
            </div>

            {/* Type d'adhésion */}
            <div>
              <label className="block text-xs tracking-widest uppercase mb-3 text-muted-foreground">Type d'adhésion</label>
              <div className="grid grid-cols-3 gap-2">
                {memberships.map(({ type, desc }) => (
                  <label
                    key={type}
                    className={`border p-3 cursor-pointer transition-all text-center ${formData.membership === type ? 'border-accent bg-accent/5' : 'hover:border-muted-foreground'}`}
                    style={{ borderWidth: '0.5px' }}
                  >
                    <input
                      type="radio"
                      name="membership"
                      value={type}
                      checked={formData.membership === type}
                      onChange={(e) => setFormData({ ...formData, membership: e.target.value })}
                      className="sr-only"
                    />
                    <p className="text-sm mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{type}</p>
                    <p className="text-xs text-muted-foreground leading-tight">{desc}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* CGU */}
            <div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="cgu"
                  checked={formData.cgu}
                  onChange={(e) => setFormData({ ...formData, cgu: e.target.checked })}
                  className="w-4 h-4 mt-0.5 accent-accent"
                />
                <label htmlFor="cgu" className="text-sm text-muted-foreground">
                  J'accepte les{' '}
                  <Link to="/a-propos" className="text-accent hover:underline">conditions d'utilisation</Link>{' '}
                  et la politique de confidentialité
                </label>
              </div>
              {errors.cgu && <p className="text-xs text-red-500 mt-1">{errors.cgu}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
            >
              Créer mon compte
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
