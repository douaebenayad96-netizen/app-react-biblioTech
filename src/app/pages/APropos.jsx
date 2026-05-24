import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Heart, Target, Lightbulb } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const equipe = [
  {
    nom: 'Isabelle Moreau',
    role: 'Directrice & Fondatrice',
    bio: 'Ancienne conservatrice à la BnF, Isabelle a fondé BiblioTech  avec la conviction que la lecture profonde est un acte de résistance culturelle.',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  },
  {
    nom: 'Thomas Lefèvre',
    role: 'Responsable des Collections',
    bio: 'Docteur en littérature comparée, Thomas sélectionne chaque ouvrage avec une exigence éditoriale rare, privilégiant la durabilité sur la tendance.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  },
  {
    nom: 'Camille Dubois',
    role: 'Responsable Numérique',
    bio: 'Ingénieure passionnée de design, Camille orchestre l\'expérience digitale pour que la technologie serve la lecture, jamais l\'inverse.',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
  },
  {
    nom: 'Raphaël Nguyen',
    role: 'Médiateur Culturel',
    bio: 'Organisateur d\'ateliers de lecture et de rencontres d\'auteurs, Raphaël tisse les liens entre les livres et la communauté.',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  },
];

const valeurs = [
  { icon: BookOpen, titre: 'La profondeur', texte: 'Nous croyons en la lecture lente, attentive, celle qui transforme durablement la pensée.' },
  { icon: Heart, titre: 'La passion', texte: 'Chaque livre de notre collection a été choisi avec amour par des lecteurs exigeants.' },
  { icon: Users, titre: 'La communauté', texte: 'Une bibliothèque n\'est rien sans ses lecteurs. Nous cultivons un espace de partage et d\'échange.' },
  { icon: Target, titre: 'L\'exigence', texte: 'Qualité plutôt que quantité. Nous préférons 500 ouvrages essentiels à 5 000 titres quelconques.' },
  { icon: Lightbulb, titre: 'L\'innovation', texte: 'Nous explorons comment le numérique peut enrichir l\'expérience de lecture sans la dénaturer.' },
  { icon: Award, titre: 'L\'accessibilité', texte: 'La culture doit être accessible à tous. Nos tarifs reflètent cet engagement.' },
];

const chiffres = [
  { valeur: '500+', label: 'Ouvrages sélectionnés' },
  { valeur: '1 200+', label: 'Membres actifs' },
  { valeur: '98%', label: 'Satisfaction membres' },
  { valeur: '2026', label: 'Année de fondation' },
];

export default function APropos() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1568667256549-094345857637?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2000"
          alt="À propos de BiblioTech Cloud"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/50" />
        <div className="relative h-full max-w-7xl mx-auto px-8 flex items-center">
          <div className="max-w-2xl">
            <p className="text-sm tracking-[0.3em] uppercase text-accent mb-4">Notre histoire</p>
            <h1 className="text-7xl mb-6" style={{ fontFamily: 'var(--font-serif)' }}>À propos</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              BiblioTech  est né d'une conviction simple : dans un monde saturé d'informations éphémères, la lecture profonde est plus précieuse que jamais.
            </p>
          </div>
        </div>
      </section>

      {/* Histoire */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-accent mb-4">Notre mission</p>
            <h2 className="text-5xl mb-8" style={{ fontFamily: 'var(--font-serif)' }}>
              Préserver l'art de lire
            </h2>
            <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
              <p>
                Fondée en 2026 au cœur du Quartier Latin, BiblioTech  est une bibliothèque hybride qui marie la rigueur éditoriale des grandes institutions culturelles avec la fluidité des outils numériques modernes.
              </p>
              <p>
                Notre collection de plus de 500 ouvrages a été constituée par une équipe de lecteurs passionnés, selon un principe simple : chaque livre doit mériter d'être relu. Pas de best-sellers éphémères, pas de titres choisis par algorithme.
              </p>
              <p>
                Nous croyons que la lenteur est une vertu. Que prendre le temps de lire un livre en entier, d'y revenir, d'en discuter, est un acte profondément humain que nous devons protéger.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-block mt-8 px-8 py-4 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
            >
              Nous contacter
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600"
              alt="Bibliothèque"
              className="w-full aspect-[3/4] object-cover"
            />
            <div className="space-y-4 pt-8">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600"
                alt="Lecture"
                className="w-full aspect-square object-cover"
              />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600"
                alt="Livres"
                className="w-full aspect-square object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="bg-foreground text-background py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {chiffres.map(({ valeur, label }) => (
              <div key={label}>
                <div className="text-5xl mb-3 text-accent" style={{ fontFamily: 'var(--font-serif)' }}>{valeur}</div>
                <p className="text-sm tracking-widest uppercase opacity-70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-accent mb-4">Ce qui nous guide</p>
          <h2 className="text-5xl" style={{ fontFamily: 'var(--font-serif)' }}>Nos valeurs</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {valeurs.map(({ icon: Icon, titre, texte }) => (
            <div key={titre} className="border p-8 hover:shadow-lg transition-shadow duration-500" style={{ borderWidth: '0.5px' }}>
              <div className="p-3 bg-accent/10 w-fit mb-5">
                <Icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-serif)' }}>{titre}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{texte}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Équipe */}
      <section className="bg-white border-t border-b py-24" style={{ borderWidth: '0.5px' }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] uppercase text-accent mb-4">Les visages derrière les livres</p>
            <h2 className="text-5xl" style={{ fontFamily: 'var(--font-serif)' }}>Notre équipe</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {equipe.map(({ nom, role, bio, img }) => (
              <div key={nom} className="group">
                <div className="aspect-[3/4] overflow-hidden mb-5">
                  <ImageWithFallback
                    src={img}
                    alt={nom}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg mb-1" style={{ fontFamily: 'var(--font-serif)' }}>{nom}</h3>
                <p className="text-xs tracking-widest uppercase text-accent mb-3">{role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Citation */}
      <section className="relative py-32 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2000"
          alt="Bibliothèque"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/75" />
        <div className="relative max-w-3xl mx-auto px-8 text-center text-background">
          <p className="text-4xl italic leading-relaxed mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
            « Une bibliothèque est un hôpital pour l'esprit. »
          </p>
          <p className="text-sm tracking-[0.3em] uppercase opacity-60">— Proverbe</p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-8 py-24 text-center">
        <h2 className="text-5xl mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
          Prêt à rejoindre l'aventure ?
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
          Devenez membre de BiblioTech  et accédez à une collection soigneusement sélectionnée pour les esprits curieux.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/inscription"
            className="px-10 py-4 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
          >
            Créer un compte
          </Link>
          <Link
            to="/contact"
            className="px-10 py-4 border text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-colors duration-300"
            style={{ borderWidth: '0.5px' }}
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </div>
  );
}
