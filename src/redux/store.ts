import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import socketReducer from './slices/socketSlice';
import menuReducer from './slices/menuSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    socket: socketReducer,
    menu: menuReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
