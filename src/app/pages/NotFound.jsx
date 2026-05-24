import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
      <BookOpen className="w-16 h-16 text-accent mb-8" />
      <p className="text-sm tracking-[0.3em] uppercase text-accent mb-4">Erreur 404</p>
      <h1 className="text-7xl mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
        Page introuvable
      </h1>
      <p className="text-xl text-muted-foreground max-w-md leading-relaxed mb-12">
        La page que vous cherchez semble avoir été rangée dans une section inconnue de notre bibliothèque.
      </p>
      <div className="flex gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>
        <Link
          to="/collection"
          className="px-8 py-4 border text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-colors duration-300"
          style={{ borderWidth: '0.5px' }}
        >
          Voir la collection
        </Link>
      </div>
    </div>
  );
}
