/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TSocketMessage } from 'src/@types/entities/socket';

export interface ISocketState {
  message: TSocketMessage | undefined;
}

const initialState: ISocketState = {
  message: undefined,
};

const slice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    saveMessage: (state, action: PayloadAction<TSocketMessage>): void => {
      state.message = action.payload;
    },
  },
});

export const { saveMessage } = slice.actions;

export default slice.reducer;
