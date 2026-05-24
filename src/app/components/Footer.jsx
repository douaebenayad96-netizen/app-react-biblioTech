import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Marque */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-accent" />
              <span className="text-xl" style={{ fontFamily: 'var(--font-serif)' }}>BiblioTech </span>
            </div>
            <p className="text-sm opacity-60 leading-relaxed">
              Un sanctuaire pour la lecture profonde à l'ère numérique.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs tracking-widest uppercase opacity-50 mb-4">Navigation</p>
            <div className="space-y-2">
              <Link to="/" className="block text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all">Accueil</Link>
              <Link to="/collection" className="block text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all">Collection</Link>
              <Link to="/membres" className="block text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all">Membres</Link>
              <Link to="/emprunts" className="block text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all">Emprunts</Link>
            </div>
          </div>

          {/* Informations */}
          <div>
            <p className="text-xs tracking-widest uppercase opacity-50 mb-4">Informations</p>
            <div className="space-y-2">
              <Link to="/a-propos" className="block text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all">À propos</Link>
              <Link to="/contact" className="block text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all">Contact</Link>
              <Link to="/inscription" className="block text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all">Devenir membre</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs tracking-widest uppercase opacity-50 mb-4">Contact</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm opacity-70">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <span>contact@bibliotech.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-70">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <span>+212 6 23 45 67 89</span>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-70">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                <span>Tanger 6e, Maroc</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between text-xs opacity-50 pt-8 border-t border-background/10">
          <p>© 2026 BiblioTech . Tous droits réservés.</p>
          <p className="tracking-wider mt-2 md:mt-0">Conçu avec intention.</p>
        </div>
      </div>
    </footer>
  );
}
