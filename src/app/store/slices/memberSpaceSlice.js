import { createSlice } from '@reduxjs/toolkit';

const load = (key) => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } };
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

const memberSpaceSlice = createSlice({
  name: 'memberSpace',
  initialState: {
    favorites: load('btc_favorites'),   // [bookId, ...]
    cart: load('btc_cart'),             // [{ bookId, addedAt }, ...]
    orders: load('btc_orders'),         // [{ id, bookId, userId, status, date, note }, ...]
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const bookId = action.payload;
      const idx = state.favorites.indexOf(bookId);
      if (idx === -1) state.favorites.push(bookId);
      else state.favorites.splice(idx, 1);
      save('btc_favorites', state.favorites);
    },
    addToCart: (state, action) => {
      const bookId = action.payload;
      if (!state.cart.find((c) => c.bookId === bookId)) {
        state.cart.push({ bookId, addedAt: new Date().toISOString() });
        save('btc_cart', state.cart);
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((c) => c.bookId !== action.payload);
      save('btc_cart', state.cart);
    },
    clearCart: (state) => {
      state.cart = [];
      save('btc_cart', []);
    },
    placeOrder: (state, action) => {
      // action.payload = { bookIds, userId, note }
      const { bookIds, userId, note } = action.payload;
      bookIds.forEach((bookId) => {
        state.orders.push({
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          bookId,
          userId,
          note: note || '',
          status: 'en_attente',   // en_attente | approuvé | refusé | rendu
          date: new Date().toISOString().split('T')[0],
        });
      });
      // Vider le panier après commande
      state.cart = state.cart.filter((c) => !bookIds.includes(c.bookId));
      save('btc_cart', state.cart);
      save('btc_orders', state.orders);
    },
    updateOrderStatus: (state, action) => {
      // action.payload = { id, status }
      const order = state.orders.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
        save('btc_orders', state.orders);
      }
    },
    clearMemberData: (state) => {
      state.favorites = [];
      state.cart = [];
      state.orders = [];
      localStorage.removeItem('btc_favorites');
      localStorage.removeItem('btc_cart');
      localStorage.removeItem('btc_orders');
    },
  },
});

export const {
  toggleFavorite, addToCart, removeFromCart, clearCart,
  placeOrder, updateOrderStatus, clearMemberData,
} = memberSpaceSlice.actions;
export default memberSpaceSlice.reducer;
