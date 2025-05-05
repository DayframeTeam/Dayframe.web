import api from '../../api/http/axios';
import { store } from '../../store';
import { setAuthToken } from './store/authSlice';
import { handleApiError } from '../../shared/errors';

const url = '/auth';

type AuthResponse = {
  accessToken: string;
};

/**
 * Service for managing user data with database and store integration
 */
export const authService = {
  /**
   * Fetch current user from the server and update the store
   */
  async authUser(initData: string): Promise<void> {
    try {
      const response = await api.post<AuthResponse>(`${url}/login`, { initData });
      store.dispatch(setAuthToken(response.data.accessToken));
    } catch (error) {
      const appError = handleApiError(error, 'authService.authUser');
      console.error(appError.message);
      throw appError;
    }
  },
};
