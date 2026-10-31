import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './itemsSlice';
import categoriesReducer from './categoriesSlice';
import recentCodesReducer from './recentCodesSlice';

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    categories: categoriesReducer,
    recentCodes: recentCodesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
