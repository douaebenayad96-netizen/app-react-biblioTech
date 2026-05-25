import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadBooks } from '../store/slices/booksSlice';
import { loadEmprunts } from '../store/slices/loansSlice';
import BookCard from '../components/BookCard';
import { ArrowRight, BookOpen, Users, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function Home() {
  const dispatch = useAppDispatch();
  const books = useAppSelector((state) => state.books.books);
  const members = useAppSelector((state) => state.members.members);
  const loans = useAppSelector((state) => state.loans.loans);

  const featuredBooks = books.filter((book) => book.available).slice(0, 3);
  const activeLoans = loans.filter((loan) => loan.status === 'active');

  useEffect(() => {
    dispatch(loadBooks());
    dispatch(loadEmprunts());
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[calc(100svh-76px)] lg:min-h-[calc(100svh-92px)] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1760166699654-5d0e10f51994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2000"
            alt="Intérieur de bibliothèque moderne"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>

        <div className="relative min-h-[calc(100svh-76px)] lg:min-h-[calc(100svh-92px)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 flex items-center">
          <div className="max-w-3xl">
            <p className="text-sm tracking-[0.3em] uppercase text-accent mb-6">Fondée en 2026</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight lg:leading-[1.08] mb-6 sm:mb-8 lg:mb-10 max-w-4xl" style={{ fontFamily: 'var(--font-serif)' }}>
              Une archive moderne pour l'esprit contemporain
            </h1>
            <p className="text-base sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-8 sm:mb-10 lg:mb-12 max-w-2xl">
              Des collections soigneusement sélectionnées, alliant sagesse intemporelle et commodité numérique. Bienvenue chez BiblioTech .
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              <Link
                to="/collection"
                className="text-center px-4 sm:px-8 py-4 sm:py-3 bg-primary text-primary-foreground text-xs sm:text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-all duration-300"
              >
                Explorer la collection
              </Link>
              <Link
                to="/inscription"
                className="text-center px-4 sm:px-8 py-4 sm:py-3 border text-xs sm:text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-all duration-300"
                style={{ borderWidth: '0.5px' }}
              >
                Devenir membre
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 border mb-6" style={{ borderWidth: '0.5px' }}>
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="text-5xl mb-3" style={{ fontFamily: 'var(--font-serif)' }}>{books.length}</div>
            <p className="text-sm tracking-widest uppercase text-muted-foreground">Volumes</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 border mb-6" style={{ borderWidth: '0.5px' }}>
              <Users className="w-8 h-8" />
            </div>
            <div className="text-5xl mb-3" style={{ fontFamily: 'var(--font-serif)' }}>{members.length}</div>
            <p className="text-sm tracking-widest uppercase text-muted-foreground">Membres actifs</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 border mb-6" style={{ borderWidth: '0.5px' }}>
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="text-5xl mb-3" style={{ fontFamily: 'var(--font-serif)' }}>{activeLoans.length}</div>
            <p className="text-sm tracking-widest uppercase text-muted-foreground">Livres en circulation</p>
          </div>
        </div>
      </section>

      {/* Collection vedette */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 border-t" style={{ borderWidth: '0.5px' }}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-14 lg:mb-20">
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-accent mb-4">Sélection du moment</p>
            <h2 className="text-2xl sm:text-3xl lg:text-6xl" style={{ fontFamily: 'var(--font-serif)' }}>
              Collection vedette
            </h2>
          </div>
          <Link
            to="/collection"
            className="group flex items-center gap-3 text-sm tracking-widest uppercase hover:text-accent transition-colors"
          >
            Voir les {books.length} ouvrages
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Citation */}
      <section className="relative py-24 sm:py-32 lg:py-48 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1763811938053-2e88eba977a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2000"
            alt="Salle de lecture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/70" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-background">
          <p className="text-xl sm:text-2xl lg:text-3xl italic leading-relaxed mb-8" style={{ fontFamily: 'var(--font-serif)' }}>
            « À l'ère du défilement infini et de l'attention fragmentée, nous préservons le rituel de la lecture profonde. Chaque volume de notre collection a été choisi pour sa capacité à ralentir le temps, affûter la pensée et approfondir la compréhension. »
          </p>
          <p className="text-sm tracking-[0.3em] uppercase opacity-70">— Les Conservateurs</p>
        </div>
      </section>

      {/* Philosophie */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-accent mb-6">Notre philosophie</p>
            <h2 className="text-4xl sm:text-5xl mb-6 sm:mb-8" style={{ fontFamily: 'var(--font-serif)' }}>
              La lenteur comme vertu
            </h2>
            <div className="space-y-5 sm:space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
              <p>
                Nous croyons au pouvoir de l'attention soutenue. Dans un monde optimisé pour la distraction, notre bibliothèque est un sanctuaire pour ceux qui cherchent la profondeur plutôt que la largeur.
              </p>
              <p>
                Chaque livre de notre collection a été sélectionné non pas pour les algorithmes de tendance, mais pour sa valeur durable. Ce sont des œuvres qui récompensent la patience, la contemplation et les relectures.
              </p>
              <p>
                BiblioTech  est plus qu'une bibliothèque numérique — c'est une communauté de lecteurs engagés dans la cultivation lente et délibérée du savoir et de la sagesse.
              </p>
            </div>
            <Link
              to="/a-propos"
              className="inline-flex items-center gap-2 mt-8 text-sm tracking-widest uppercase hover:text-accent transition-colors group"
            >
              En savoir plus
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1577739807851-ba25bfa3f66d?w=600"
                alt="Moment de lecture"
                className="w-full aspect-[3/4] object-cover"
              />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1563723788263-e84ab16f92d5?w=600"
                alt="Lecture de magazine"
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="space-y-6 pt-12">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1618082835298-0f9db64b57f9?w=600"
                alt="Livre en main"
                className="w-full aspect-square object-cover"
              />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1629998867511-c0ae031398b3?w=600"
                alt="Lecture à la maison"
                className="w-full aspect-[3/4] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 border-t" style={{ borderWidth: '0.5px' }}>
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-3xl sm:text-4xl mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
            Notes sur la bibliothèque
          </h3>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 leading-relaxed">
            Réflexions occasionnelles sur les livres, les idées et l'art de l'attention soutenue. Rejoignez notre communauté de lecteurs attentifs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Votre adresse e-mail"
              className="flex-1 px-5 sm:px-6 py-4 sm:py-5 bg-white border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              style={{ borderWidth: '0.5px' }}
            />
            <button className="px-8 sm:px-10 py-4 sm:py-5 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors duration-300">
              S'abonner
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
