import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import booksReducer from './slices/booksSlice';
import membersReducer from './slices/membersSlice';
import loansReducer from './slices/loansSlice';
import memberSpaceReducer from './slices/memberSpaceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    members: membersReducer,
    loans: loansReducer,
    memberSpace: memberSpaceReducer,
  },
});
