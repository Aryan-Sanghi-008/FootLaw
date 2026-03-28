import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import authReducer from './slices/authSlice';
import squadReducer from './slices/squadSlice';
import clubReducer from './slices/clubSlice';
import marketReducer from './slices/marketSlice';
import matchReducer from './slices/matchSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    squad: squadReducer,
    club: clubReducer,
    market: marketReducer,
    match: matchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
