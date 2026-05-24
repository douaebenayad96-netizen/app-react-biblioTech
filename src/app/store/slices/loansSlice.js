import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { libraryApi } from '../../services/libraryApi';

export const loadEmprunts = createAsyncThunk('loans/loadEmprunts', async () => {
  const res = await libraryApi.getEmprunts();
  console.log('API emprunts response:', res);
  return res?.emprunts ?? res;
});

export const createEmprunt = createAsyncThunk(
  'loans/createEmprunt',
  async ({ livreId, membreId }) => {
    const res = await libraryApi.createEmprunt({ livreId, membreId });
    return res?.emprunt ?? res;
  }
);

export const returnEmprunt = createAsyncThunk('loans/returnEmprunt', async (empruntId) => {
  const res = await libraryApi.returnEmprunt(empruntId);
  return res?.emprunt ?? { id: empruntId, returned: true };
});

export const deleteEmprunt = createAsyncThunk('loans/deleteEmprunt', async (empruntId) => {
  await libraryApi.deleteEmprunt(empruntId);
  return empruntId;
});

const initialState = {
  loans: [],
  loansLoading: false,
  loansError: null,
};

function mapEmpruntToLoan(e) {
  if (!e) return null;

  return {
    id: String(e.id ?? e._id ?? e.empruntId ?? e.emprunt ?? ''),
    bookId: String(e.livreId ?? e.bookId ?? e.book ?? e.livre ?? ''),
    memberId: String(e.membreId ?? e.memberId ?? e.member ?? e.membre ?? ''),
    borrowDate: e.borrowDate ?? e.dateEmprunt ?? e.empruntDate ?? e.date ?? e.createdAt ?? new Date().toISOString().split('T')[0],
    dueDate:
      e.dueDate ??
      e.dateRetourPrevue ??
      e.due ??
      e.dateFin ??
      new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    status: e.status ?? e.etat ?? (e.retour ? 'returned' : 'active'),
    returnDate: e.returnDate ?? e.dateRetour ?? (e.retour ? String(e.retour.date ?? e.retour) : undefined),
  };
}

const loansSlice = createSlice({
  name: 'loans',
  initialState,
  reducers: {
    // Legacy local actions (non utilisées après branchement API)
    borrowBook: (state, action) => {
      const borrowDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      state.loans.push({
        id: Date.now().toString(),
        bookId: action.payload.bookId,
        memberId: action.payload.memberId,
        borrowDate: borrowDate.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'active',
      });
    },
    returnBook: (state, action) => {
      const loan = state.loans.find((l) => l.id === action.payload);
      if (loan) {
        loan.status = 'returned';
        loan.returnDate = new Date().toISOString().split('T')[0];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadEmprunts.pending, (state) => {
        state.loansLoading = true;
        state.loansError = null;
      })
      .addCase(loadEmprunts.fulfilled, (state, action) => {
        state.loansLoading = false;
        const emprunts = action.payload || [];
        state.loans = Array.isArray(emprunts) ? emprunts.map(mapEmpruntToLoan).filter(Boolean) : [];
      })
      .addCase(loadEmprunts.rejected, (state, action) => {
        state.loansLoading = false;
        state.loansError = action.error?.message || 'Failed to load loans';
      });

    // Après create/return/delete : on ne modifie pas localement pour éviter des erreurs de mapping.
    // On laisse le chargement au prochain refresh/dispatch si tu le re-déclenches.
    builder
      .addCase(createEmprunt.fulfilled, () => {})
      .addCase(returnEmprunt.fulfilled, () => {})
      .addCase(deleteEmprunt.fulfilled, (state, action) => {
        state.loans = state.loans.filter((l) => l.id !== action.payload);
      });
  },
});

export const { borrowBook, returnBook } = loansSlice.actions;
// Thunks already exported via `export const ...` declarations above
export default loansSlice.reducer;

