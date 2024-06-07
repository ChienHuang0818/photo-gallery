// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import photoReducer from './photoSlice';

const store = configureStore({
  reducer: {
    photos: photoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
