import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addMember, updateMember, deleteMember } from '../../store/slices/membersSlice';
import { Plus, Pencil, Trash2, X, Search, User, Mail, Calendar, Award } from 'lucide-react';

const EMPTY = { name: '', email: '', membershipType: 'Standard' };

export default function AdminMembers() {
  const dispatch = useAppDispatch();
  const members = useAppSelector((s) => s.members.members);
  const loans = useAppSelector((s) => s.loans.loans);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('tous');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const filtered = members.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'tous' || m.membershipType === filterType;
    return matchSearch && matchType;
  });

  const openAdd = () => { setForm(EMPTY); setModal('add'); };
  const openEdit = (m) => { setSelected(m); setForm({ name: m.name, email: m.email, membershipType: m.membershipType }); setModal('edit'); };
  const openDelete = (m) => { setSelected(m); setModal('delete'); };
  const closeModal = () => { setModal(null); setSelected(null); setForm(EMPTY); };

  const handleSave = (e) => {
    e.preventDefault();
    if (modal === 'add') dispatch(addMember(form));
    else dispatch(updateMember({ ...form, id: selected.id }));
    closeModal();
  };

  const getMemberLoans = (id) => loans.filter((l) => l.memberId === id);
  const typeColor = { Standard: 'bg-blue-100 text-blue-700', Premium: 'bg-purple-100 text-purple-700', Scholar: 'bg-amber-100 text-amber-700' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-1" style={{ fontFamily: 'var(--font-serif)' }}>Gestion des membres</h1>
          <p className="text-sm text-muted-foreground">{members.length} membres inscrits</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Rechercher par nom ou email..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border text-sm focus:outline-none focus:ring-2 focus:ring-accent" style={{ borderWidth: '0.5px' }} />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2.5 bg-white border text-sm focus:outline-none" style={{ borderWidth: '0.5px' }}>
          <option value="tous">Tous les types</option>
          <option value="Standard">Standard</option>
          <option value="Premium">Premium</option>
          <option value="Scholar">Scholar</option>
        </select>
      </div>

      {/* Grille de cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((member) => {
          const memberLoans = getMemberLoans(member.id);
          const activeCount = memberLoans.filter((l) => l.status === 'active').length;
          return (
            <div key={member.id} className="bg-white border hover:shadow-md transition-shadow" style={{ borderWidth: '0.5px' }}>
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{member.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(member)} className="p-1.5 hover:bg-muted transition-colors"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    <button onClick={() => openDelete(member)} className="p-1.5 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs pt-3 border-t" style={{ borderWidth: '0.5px' }}>
                  <span className={`px-2 py-1 ${typeColor[member.membershipType] || 'bg-muted'}`}>
                    {member.membershipType}
                  </span>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{member.joinDate}</span>
                    <span className="flex items-center gap-1"><Award className="w-3 h-3" />{activeCount} actif{activeCount > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && <p className="text-center py-12 text-muted-foreground text-sm">Aucun membre trouvé.</p>}

      {/* Modal Ajouter / Modifier */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderWidth: '0.5px' }}>
              <h2 className="text-xl" style={{ fontFamily: 'var(--font-serif)' }}>
                {modal === 'add' ? 'Ajouter un membre' : 'Modifier le membre'}
              </h2>
              <button onClick={closeModal}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">Nom complet *</label>
                <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent" style={{ borderWidth: '0.5px' }} placeholder="Prénom Nom" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">Adresse e-mail *</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent" style={{ borderWidth: '0.5px' }} placeholder="email@exemple.com" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">Type d'adhésion</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Standard', 'Premium', 'Scholar'].map((type) => (
                    <label key={type} className={`border p-3 cursor-pointer text-center text-sm transition-all ${form.membershipType === type ? 'border-accent bg-accent/5' : 'hover:border-muted-foreground'}`} style={{ borderWidth: '0.5px' }}>
                      <input type="radio" name="type" value={type} checked={form.membershipType === type} onChange={(e) => setForm({ ...form, membershipType: e.target.value })} className="sr-only" />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors">
                  {modal === 'add' ? 'Ajouter' : 'Enregistrer'}
                </button>
                <button type="button" onClick={closeModal} className="px-6 py-3 border text-sm tracking-widest uppercase hover:bg-muted transition-colors" style={{ borderWidth: '0.5px' }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Supprimer */}
      {modal === 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white w-full max-w-md p-6">
            <h2 className="text-xl mb-3" style={{ fontFamily: 'var(--font-serif)' }}>Supprimer ce membre ?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Vous êtes sur le point de supprimer <strong>{selected?.name}</strong>. Ses emprunts resteront dans l'historique.
            </p>
            <div className="flex gap-3">
              <button onClick={() => { dispatch(deleteMember(selected.id)); closeModal(); }} className="flex-1 py-3 bg-red-600 text-white text-sm tracking-widest uppercase hover:bg-red-700 transition-colors">Supprimer</button>
              <button onClick={closeModal} className="flex-1 py-3 border text-sm tracking-widest uppercase hover:bg-muted transition-colors" style={{ borderWidth: '0.5px' }}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
