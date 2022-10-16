/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IMenuState {
  itemActive: string;
  isOpen: boolean;
}

const initialState: IMenuState = {
  itemActive: '-Domains-0',
  isOpen: false,
};

const slice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setItemActive: (state, action: PayloadAction<IMenuState>): void => {
      state.itemActive = action.payload.itemActive;
    },
    setIsOpen: (state, action: PayloadAction<IMenuState>): void => {
      state.isOpen = action.payload.isOpen;
    },
    clearDataMenu: (state): void => {
      state.isOpen = false;
      state.itemActive = '-Domains-0';
    },
  },
});

export const { setItemActive, setIsOpen, clearDataMenu } = slice.actions;

export default slice.reducer;
