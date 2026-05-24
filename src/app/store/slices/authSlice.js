import { createSlice } from '@reduxjs/toolkit';

// Comptes de démonstration pré-enregistrés
const demoUsers = [
  { id: '1', prenom: 'Admin', nom: 'BiblioTech', email: 'admin@bibliotech.com', password: 'admin123', role: 'admin' },
  { id: '2', prenom: 'Marie', nom: 'Dupont', email: 'marie@example.com', password: 'marie123', role: 'membre' },
];

// Charger la session depuis localStorage
const savedUser = (() => {
  try { return JSON.parse(localStorage.getItem('btc_user')) || null; }
  catch { return null; }
})();

const savedUsers = (() => {
  try { return JSON.parse(localStorage.getItem('btc_users')) || demoUsers; }
  catch { return demoUsers; }
})();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser,           // utilisateur connecté ou null
    users: savedUsers,         // liste de tous les comptes
    error: null,
  },
  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload;
      const found = state.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (found) {
        const { password: _, ...safeUser } = found;
        state.user = safeUser;
        state.error = null;
        localStorage.setItem('btc_user', JSON.stringify(safeUser));
      } else {
        state.error = 'Email ou mot de passe incorrect.';
      }
    },

    register: (state, action) => {
      const { prenom, nom, email, password, membership } = action.payload;
      const exists = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        state.error = 'Un compte avec cet email existe déjà.';
        return;
      }
      const newUser = {
        id: Date.now().toString(),
        prenom,
        nom,
        email,
        password,
        membership: membership || 'Standard',
        role: 'membre',
      };
      state.users.push(newUser);
      const { password: _, ...safeUser } = newUser;
      state.user = safeUser;
      state.error = null;
      localStorage.setItem('btc_user', JSON.stringify(safeUser));
      localStorage.setItem('btc_users', JSON.stringify(state.users));
    },

    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('btc_user');
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { login, register, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
