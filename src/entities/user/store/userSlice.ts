import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../../types/dbTypes';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null as User | null,
    isLoading: false,
    error: null as string | null,
  },
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setUserExp(state, action: PayloadAction<number>) {
      state.user!.exp = action.payload;
    },
  },
});

export const { setUser, setUserExp } = userSlice.actions;
export default userSlice.reducer;
