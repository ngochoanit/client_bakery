/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUserInfo } from 'src/@types/entities/User';
import { getUserInfo as gUI } from 'src/apis/auth';

export interface AuthState {
  user: TUserInfo | null;
  accessToken: string | null;
  userId: number | null;
  have404: boolean;
  isLogin: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  userId: null,
  have404: false,
  isLogin: false,
};

export const getUserInfo = createAsyncThunk(
  'auth/getUserInfo',
  async (userId: number) => {
    const result = await gUI({ userId });
    return result?.data;
  },
);

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveUserInfo: (state, action: PayloadAction<TUserInfo>): void => {
      state.user = action.payload;
    },
    saveAccessToken: (state, action: PayloadAction<string>): void => {
      state.accessToken = action.payload;
    },
    // saveUrl: (state, action: PayloadAction<string>): void => {
    //   state.url = action.payload;
    // },
    saveUserId: (state, action: PayloadAction<number>): void => {
      state.userId = action.payload;
    },
    clearData: (state): void => {
      state.user = null;
      state.accessToken = null;
      state.userId = null;
    },
    set404: (state): void => {
      state.have404 = true;
    },
    setLogin: (state): void => {
      state.isLogin = true;
    },
    updateProfile: (
      state,
      action: PayloadAction<{
        firstName: string;
        lastName: string;
        phone: string;
      }>,
    ): void => {
      if (state.user) {
        state.user.firstName = action.payload.firstName;
        state.user.lastName = action.payload.lastName;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      if (action.payload) {
        state.user = action.payload;
        state.have404 = true;
      }
    });
  },
});

export const {
  saveUserInfo,
  saveUserId,
  saveAccessToken,
  clearData,
  set404,
  setLogin,
  updateProfile,
} = slice.actions;

export default slice.reducer;
