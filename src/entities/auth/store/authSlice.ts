import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../store';

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    clearAuthToken(state) {
      state.token = null;
    },
  },
});

export const { setAuthToken, clearAuthToken } = authSlice.actions;
export default authSlice.reducer;

// Селектор для получения токена
export const selectAuthToken = (state: RootState) => state.auth.token;
