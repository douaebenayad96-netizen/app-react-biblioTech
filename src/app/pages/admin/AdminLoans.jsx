import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { borrowBook, returnBook } from '../../store/slices/loansSlice';
import { updateBookAvailability } from '../../store/slices/booksSlice';
import { updateOrderStatus } from '../../store/slices/memberSpaceSlice';
import { Plus, X, BookOpen, AlertCircle, CheckCircle2, Clock, Check, XCircle } from 'lucide-react';

const TABS = ['emprunts', 'commandes'];

export default function AdminLoans() {
  const dispatch = useAppDispatch();
  const loans = useAppSelector((s) => s.loans.loans);
  const books = useAppSelector((s) => s.books.books);
  const members = useAppSelector((s) => s.members.members);
  const orders = useAppSelector((s) => s.memberSpace.orders);

  const [tab, setTab] = useState('emprunts');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ bookId: '', memberId: '' });
  const [filterStatus, setFilterStatus] = useState('tous');

  const availableBooks = books.filter((b) => b.available);
  const activeLoans = loans.filter((l) => l.status === 'active');
  const returnedLoans = loans.filter((l) => l.status === 'returned');

  const filteredLoans = filterStatus === 'tous' ? loans
    : filterStatus === 'active' ? activeLoans
    : returnedLoans;

  const filteredOrders = filterStatus === 'tous' ? orders
    : orders.filter((o) => o.status === filterStatus);

  const handleBorrow = (e) => {
    e.preventDefault();
    dispatch(borrowBook(form));
    dispatch(updateBookAvailability({ id: form.bookId, available: false }));
    setForm({ bookId: '', memberId: '' });
    setShowForm(false);
  };

  const handleReturn = (loanId, bookId) => {
    dispatch(returnBook(loanId));
    dispatch(updateBookAvailability({ id: bookId, available: true }));
  };

  const getBook = (id) => books.find((b) => b.id === id);
  const getMember = (id) => members.find((m) => m.id === id);
  const isOverdue = (d) => new Date(d) < new Date();
  const daysLeft = (d) => Math.ceil((new Date(d) - new Date()) / 86400000);

  const statusLabel = { en_attente: 'En attente', approuvé: 'Approuvé', refusé: 'Refusé', rendu: 'Rendu' };
  const statusColor = {
    en_attente: 'bg-amber-100 text-amber-700',
    approuvé: 'bg-green-100 text-green-700',
    refusé: 'bg-red-100 text-red-700',
    rendu: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-1" style={{ fontFamily: 'var(--font-serif)' }}>Emprunts & Commandes</h1>
          <p className="text-sm text-muted-foreground">{activeLoans.length} emprunt(s) actif(s) · {orders.filter(o => o.status === 'en_attente').length} commande(s) en attente</p>
        </div>
        {tab === 'emprunts' && (
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Annuler' : 'Nouvel emprunt'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ borderWidth: '0.5px' }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => { setTab(t); setFilterStatus('tous'); }}
            className={`px-6 py-3 text-sm tracking-widest uppercase transition-colors capitalize ${tab === t ? 'border-b-2 border-foreground text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            {t === 'emprunts' ? `Emprunts (${loans.length})` : `Commandes (${orders.length})`}
          </button>
        ))}
      </div>

      {/* Filtre statut */}
      <div className="flex gap-2 flex-wrap">
        {tab === 'emprunts'
          ? ['tous', 'active', 'returned'].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 text-xs tracking-widest uppercase border transition-colors ${filterStatus === s ? 'bg-foreground text-background border-foreground' : 'border-muted-foreground/30 hover:border-foreground'}`}
              style={{ borderWidth: '0.5px' }}>
              {s === 'tous' ? 'Tous' : s === 'active' ? 'En cours' : 'Rendus'}
            </button>
          ))
          : ['tous', 'en_attente', 'approuvé', 'refusé', 'rendu'].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 text-xs tracking-widest uppercase border transition-colors ${filterStatus === s ? 'bg-foreground text-background border-foreground' : 'border-muted-foreground/30 hover:border-foreground'}`}
              style={{ borderWidth: '0.5px' }}>
              {s === 'tous' ? 'Tous' : statusLabel[s]}
            </button>
          ))
        }
      </div>

      {/* Formulaire nouvel emprunt */}
      {showForm && tab === 'emprunts' && (
        <div className="bg-white border p-6" style={{ borderWidth: '0.5px' }}>
          <h2 className="text-xl mb-5" style={{ fontFamily: 'var(--font-serif)' }}>Créer un emprunt</h2>
          <form onSubmit={handleBorrow} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">Livre disponible *</label>
              <select required value={form.bookId} onChange={(e) => setForm({ ...form, bookId: e.target.value })}
                className="w-full px-4 py-3 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent" style={{ borderWidth: '0.5px' }}>
                <option value="">Choisir un livre</option>
                {availableBooks.map((b) => <option key={b.id} value={b.id}>{b.title} — {b.author}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2 text-muted-foreground">Membre *</label>
              <select required value={form.memberId} onChange={(e) => setForm({ ...form, memberId: e.target.value })}
                className="w-full px-4 py-3 bg-background border text-sm focus:outline-none focus:ring-2 focus:ring-accent" style={{ borderWidth: '0.5px' }}>
                <option value="">Choisir un membre</option>
                {members.map((m) => <option key={m.id} value={m.id}>{m.name} — {m.membershipType}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="px-8 py-3 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-accent hover:text-accent-foreground transition-colors">
                Valider l'emprunt
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste emprunts */}
      {tab === 'emprunts' && (
        <div className="space-y-3">
          {filteredLoans.length === 0 && <p className="text-center py-12 text-muted-foreground text-sm">Aucun emprunt.</p>}
          {filteredLoans.map((loan) => {
            const book = getBook(loan.bookId);
            const member = getMember(loan.memberId);
            const overdue = loan.status === 'active' && isOverdue(loan.dueDate);
            const days = daysLeft(loan.dueDate);
            if (!book || !member) return null;
            return (
              <div key={loan.id} className={`bg-white border p-5 flex gap-4 items-start ${overdue ? 'border-red-200' : ''}`} style={{ borderWidth: '0.5px' }}>
                <div className="w-12 h-16 flex-shrink-0 overflow-hidden bg-muted">
                  <img src={book.coverImage} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                </div>
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <p className="font-medium truncate">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                  </div>
                  <div>
                    <p className="text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.membershipType}</p>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Emprunté : {loan.borrowDate}</p>
                    <p>Retour : {loan.dueDate}</p>
                    {loan.status === 'active' && (
                      overdue
                        ? <span className="flex items-center gap-1 text-red-600"><AlertCircle className="w-3 h-3" /> En retard</span>
                        : <span className="text-green-600">{days}j restant{days > 1 ? 's' : ''}</span>
                    )}
                    {loan.status === 'returned' && <span className="flex items-center gap-1 text-muted-foreground"><CheckCircle2 className="w-3 h-3" /> Rendu le {loan.returnDate}</span>}
                  </div>
                </div>
                {loan.status === 'active' && (
                  <button onClick={() => handleReturn(loan.id, loan.bookId)}
                    className="flex-shrink-0 px-4 py-2 border text-xs tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-colors" style={{ borderWidth: '0.5px' }}>
                    Retour
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Liste commandes */}
      {tab === 'commandes' && (
        <div className="space-y-3">
          {filteredOrders.length === 0 && <p className="text-center py-12 text-muted-foreground text-sm">Aucune commande.</p>}
          {filteredOrders.map((order) => {
            const book = getBook(order.bookId);
            return (
              <div key={order.id} className="bg-white border p-5 flex gap-4 items-start" style={{ borderWidth: '0.5px' }}>
                <div className="w-12 h-16 flex-shrink-0 overflow-hidden bg-muted">
                  {book && <img src={book.coverImage} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{book?.title || 'Livre inconnu'}</p>
                  <p className="text-xs text-muted-foreground mb-1">{book?.author} · {book?.genre}</p>
                  <p className="text-xs text-muted-foreground">Demandé le {order.date}</p>
                  {order.note && <p className="text-xs text-muted-foreground mt-1 italic">« {order.note} »</p>}
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-1 ${statusColor[order.status]}`}>{statusLabel[order.status]}</span>
                  {order.status === 'en_attente' && (
                    <div className="flex gap-1">
                      <button onClick={() => dispatch(updateOrderStatus({ id: order.id, status: 'approuvé' }))}
                        className="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 transition-colors" title="Approuver">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => dispatch(updateOrderStatus({ id: order.id, status: 'refusé' }))}
                        className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 transition-colors" title="Refuser">
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  {order.status === 'approuvé' && (
                    <button onClick={() => dispatch(updateOrderStatus({ id: order.id, status: 'rendu' }))}
                      className="text-xs px-3 py-1 border hover:bg-muted transition-colors" style={{ borderWidth: '0.5px' }}>
                      Marquer rendu
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
