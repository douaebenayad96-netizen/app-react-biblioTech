import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ nom: '', email: '', sujet: '', message: '' });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!formData.nom) e.nom = 'Champ requis';
    if (!formData.email) e.email = 'Champ requis';
    if (!formData.sujet) e.sujet = 'Champ requis';
    if (formData.message.length < 10) e.message = 'Message trop court';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setSent(true);
  };

  const infos = [
    { icon: Mail, label: 'E-mail', value: 'contact@bibliotech.com' },
    { icon: Phone, label: 'Téléphone', value: '+33 1 23 45 67 89' },
    { icon: MapPin, label: 'Adresse', value: '12 Rue des Lettres, 75006 Paris' },
    { icon: Clock, label: 'Horaires', value: 'Lun–Ven : 9h–18h' },
  ];

  const sujets = [
    'Renseignement général',
    'Adhésion & tarifs',
    'Problème technique',
    'Suggestion de livre',
    'Partenariat',
    'Autre',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[35vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=2000"
          alt="Contact"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/60" />
        <div className="relative h-full max-w-7xl mx-auto px-8 flex items-center">
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-accent mb-4">Nous écrire</p>
            <h1 className="text-6xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Contact</h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Une question, une suggestion ou une demande de partenariat ? Nous vous répondons sous 24h.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Informations */}
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Nos coordonnées</h2>
              <p className="text-muted-foreground leading-relaxed">
                L'équipe BiblioTech  est à votre disposition pour toute question relative à nos collections, adhésions ou services numériques.
              </p>
            </div>

            <div className="space-y-6">
              {infos.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 flex-shrink-0">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">{label}</p>
                    <p className="text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Carte stylisée */}
            <div className="border overflow-hidden" style={{ borderWidth: '0.5px' }}>
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
                alt="Localisation Paris"
                className="w-full h-40 object-cover"
              />
              <div className="p-4 bg-white">
                <p className="text-xs tracking-widest uppercase text-muted-foreground">Quartier Latin, Paris 6e</p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-24 text-center">
                <div className="w-20 h-20 bg-accent/10 flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-accent" />
                </div>
                <h2 className="text-3xl mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Message envoyé !</h2>
                <p className="text-muted-foreground max-w-md leading-relaxed">
                  Merci pour votre message. Notre équipe vous répondra dans les meilleurs délais, généralement sous 24 heures ouvrées.
                </p>
                <button
                  onClick={() => { setSent(false); setFormData({ nom: '', email: '', sujet: '', message: '' }); }}
                  className="mt-8 px-8 py-3 border text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-colors"
                  style={{ borderWidth: '0.5px' }}
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <div className="bg-white border p-10" style={{ borderWidth: '0.5px' }}>
                <h2 className="text-3xl mb-8" style={{ fontFamily: 'var(--font-serif)' }}>Envoyer un message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">Nom complet *</label>
                      <input
                        type="text"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        className="w-full px-5 py-4 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        style={{ borderWidth: '0.5px' }}
                        placeholder="Jean Dupont"
                      />
                      {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">Adresse e-mail *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-5 py-4 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        style={{ borderWidth: '0.5px' }}
                        placeholder="votre@email.com"
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">Sujet *</label>
                    <select
                      value={formData.sujet}
                      onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                      className="w-full px-5 py-4 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      style={{ borderWidth: '0.5px' }}
                    >
                      <option value="">Choisir un sujet</option>
                      {sujets.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.sujet && <p className="text-xs text-red-500 mt-1">{errors.sujet}</p>}
                  </div>

                  <div>
                    <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">Message *</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full px-5 py-4 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                      style={{ borderWidth: '0.5px' }}
                      placeholder="Décrivez votre demande en détail..."
                    />
                    <div className="flex justify-between mt-1">
                      {errors.message ? <p className="text-xs text-red-500">{errors.message}</p> : <span />}
                      <p className="text-xs text-muted-foreground">{formData.message.length} caractères</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
                  >
                    <Send className="w-4 h-4" />
                    Envoyer le message
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAQ rapide */}
      <section className="bg-white border-t py-20" style={{ borderWidth: '0.5px' }}>
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl mb-12 text-center" style={{ fontFamily: 'var(--font-serif)' }}>Questions fréquentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { q: 'Comment emprunter un livre ?', r: 'Créez un compte, choisissez votre adhésion et réservez directement depuis la page Collection.' },
              { q: 'Quelle est la durée d\'emprunt ?', r: 'La durée standard est de 30 jours, renouvelable une fois si le livre n\'est pas réservé.' },
              { q: 'Puis-je suggérer un livre ?', r: 'Oui ! Utilisez le formulaire ci-dessus avec le sujet "Suggestion de livre".' },
              { q: 'Comment annuler mon adhésion ?', r: 'Contactez-nous par e-mail ou via ce formulaire, nous traiterons votre demande sous 48h.' },
              { q: 'Y a-t-il des frais de retard ?', r: 'Aucun frais, mais les retards répétés peuvent suspendre temporairement votre accès.' },
              { q: 'Proposez-vous des livres numériques ?', r: 'Nous travaillons à l\'intégration d\'une bibliothèque numérique pour 2027.' },
            ].map(({ q, r }) => (
              <div key={q} className="border p-6" style={{ borderWidth: '0.5px' }}>
                <p className="text-sm font-medium mb-3" style={{ fontFamily: 'var(--font-serif)' }}>{q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
