import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addMember } from '../store/slices/membersSlice';
import { Plus, X, User, Mail, Calendar, Award, Shield } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function Members() {
  const dispatch = useAppDispatch();
  const members = useAppSelector((state) => state.members.members);
  const loans = useAppSelector((state) => state.loans.loans);
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin';

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', membershipType: 'Standard' });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addMember(formData));
    setFormData({ name: '', email: '', membershipType: 'Standard' });
    setShowForm(false);
  };

  const getMemberStats = (memberId) => {
    const memberLoans = loans.filter(loan => loan.memberId === memberId);
    return {
      activeLoans: memberLoans.filter(loan => loan.status === 'active').length,
      totalLoans: memberLoans.length,
    };
  };

  const membershipBenefits = {
    Standard: ['Accès à la collection principale', 'Jusqu\'à 3 livres empruntés', 'Newsletter mensuelle'],
    Premium: ['Accès complet à la collection', 'Jusqu\'à 10 livres empruntés', 'Accès prioritaire', 'Sessions curateur trimestrielles'],
    Scholar: ['Emprunts illimités', 'Accès salle de recherche', 'Avant-premières éditions', 'Invitation au symposium annuel'],
  };

  return (
    <div className="min-h-screen">
      <section className="relative h-[40vh] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1772081014501-cf52c3e0bf76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2000"
            alt="Intérieur de bibliothèque"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/90 to-background/70" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-8 flex items-center">
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-accent mb-4">Communauté</p>
            <h1 className="text-7xl mb-6" style={{ fontFamily: 'var(--font-serif)' }}>Nos Membres</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              {members.length} lecteurs engagés dans la pratique de la lecture profonde
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 py-16">

        {/* Bannière rôle */}
        {isAdmin && (
          <div className="mb-8 flex items-center gap-3 px-5 py-3 bg-accent/10 border border-accent/30 text-sm" style={{ borderWidth: '0.5px' }}>
            <Shield className="w-4 h-4 text-accent" />
            <span>Mode administrateur — vous pouvez ajouter des membres.</span>
          </div>
        )}

        <div className="flex items-end justify-between mb-16 pb-8 border-b" style={{ borderWidth: '0.5px' }}>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {members.length} {members.length === 1 ? 'membre actif' : 'membres actifs'}
            </p>
            <div className="flex gap-8 mt-4">
              {['Standard', 'Premium', 'Scholar'].map((type) => (
                <div key={type}>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">{type}</p>
                  <p className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>
                    {members.filter(m => m.membershipType === type).length}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? 'Annuler' : 'Ajouter un membre'}
            </button>
          )}
        </div>

        {showForm && isAdmin && (
          <div className="mb-16 bg-white border p-10" style={{ borderWidth: '0.5px' }}>
            <h2 className="text-3xl mb-8" style={{ fontFamily: 'var(--font-serif)' }}>
              Nouvelle inscription
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm tracking-wider uppercase mb-3 text-muted-foreground">Nom complet *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-4 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    style={{ borderWidth: '0.5px' }}
                    placeholder="Prénom Nom"
                  />
                </div>
                <div>
                  <label className="block text-sm tracking-wider uppercase mb-3 text-muted-foreground">Adresse e-mail *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-5 py-4 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    style={{ borderWidth: '0.5px' }}
                    placeholder="email@exemple.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm tracking-wider uppercase mb-4 text-muted-foreground">Type d'adhésion *</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Standard', 'Premium', 'Scholar'].map((type) => (
                      <label
                        key={type}
                        className={`border p-6 cursor-pointer transition-all duration-300 ${formData.membershipType === type ? 'border-accent bg-accent/5' : 'hover:border-muted-foreground'}`}
                        style={{ borderWidth: '0.5px' }}
                      >
                        <input
                          type="radio"
                          name="membershipType"
                          value={type}
                          checked={formData.membershipType === type}
                          onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
                          className="sr-only"
                        />
                        <div className="text-lg mb-3" style={{ fontFamily: 'var(--font-serif)' }}>{type}</div>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                          {membershipBenefits[type].map((benefit, i) => (
                            <li key={i}>· {benefit}</li>
                          ))}
                        </ul>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="px-10 py-4 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
              >
                Inscrire le membre
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => {
            const stats = getMemberStats(member.id);
            return (
              <div key={member.id} className="group bg-white border overflow-hidden hover:shadow-lg transition-all duration-500" style={{ borderWidth: '0.5px' }}>
                <div className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-4 bg-muted group-hover:bg-accent/10 transition-colors">
                      <User className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>{member.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-6 border-t" style={{ borderWidth: '0.5px' }}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Award className="w-4 h-4" />
                        <span className="text-xs tracking-wider uppercase">Adhésion</span>
                      </div>
                      <span className="tracking-wider px-3 py-1 bg-accent/10 text-xs uppercase">{member.membershipType}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs tracking-wider uppercase">Inscrit le</span>
                      </div>
                      <span className="tracking-wider">{member.joinDate}</span>
                    </div>
                    <div className="pt-4 border-t" style={{ borderWidth: '0.5px' }}>
                      <p className="text-xs tracking-wider uppercase text-muted-foreground mb-1">Activité</p>
                      <p className="text-sm">
                        <span className="font-medium">{stats.activeLoans}</span> en cours · <span className="font-medium">{stats.totalLoans}</span> au total
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {members.length === 0 && (
          <div className="text-center py-32 bg-white border" style={{ borderWidth: '0.5px' }}>
            <User className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
            <p className="text-3xl text-muted-foreground italic mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              Aucun membre pour l'instant.
            </p>
            <p className="text-muted-foreground">Commencez à construire votre communauté de lecteurs.</p>
          </div>
        )}
      </div>

      <section className="max-w-7xl mx-auto px-8 py-32 border-t" style={{ borderWidth: '0.5px' }}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-5xl mb-6" style={{ fontFamily: 'var(--font-serif)' }}>Philosophie d'adhésion</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Nos niveaux d'adhésion reflètent différents degrés d'engagement dans la pratique de la lecture profonde et de la communauté intellectuelle.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {['Standard', 'Premium', 'Scholar'].map((type) => (
            <div key={type} className="bg-white border p-10" style={{ borderWidth: '0.5px' }}>
              <div className="text-4xl mb-6" style={{ fontFamily: 'var(--font-serif)' }}>{type}</div>
              <ul className="space-y-4 text-sm text-muted-foreground">
                {membershipBenefits[type].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-accent mt-1">·</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
