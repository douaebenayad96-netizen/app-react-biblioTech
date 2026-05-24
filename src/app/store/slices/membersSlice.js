import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  members: [
    { id: '1', name: 'Sophia Chen', email: 'sophia.chen@example.com', joinDate: '2025-01-15', membershipType: 'Premium' },
    { id: '2', name: 'Marcus Wilhelm', email: 'marcus.w@example.com', joinDate: '2025-02-20', membershipType: 'Standard' },
    { id: '3', name: 'Elena Rossi', email: 'e.rossi@example.com', joinDate: '2025-03-10', membershipType: 'Scholar' },
  ],
};

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    addMember: (state, action) => {
      state.members.push({
        ...action.payload,
        id: Date.now().toString(),
        joinDate: new Date().toISOString().split('T')[0],
      });
    },
    updateMember: (state, action) => {
      const idx = state.members.findIndex((m) => m.id === action.payload.id);
      if (idx !== -1) state.members[idx] = { ...state.members[idx], ...action.payload };
    },
    deleteMember: (state, action) => {
      state.members = state.members.filter((m) => m.id !== action.payload);
    },
  },
});

export const { addMember, updateMember, deleteMember } = membersSlice.actions;
export default membersSlice.reducer;
