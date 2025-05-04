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
  async authUserByChatId(chat_id: number): Promise<void> {
    try {
      const response = await api.get<AuthResponse>(`${url}/webapp-login/${chat_id}`);
      store.dispatch(setAuthToken(response.data.accessToken));
    } catch (error) {
      const appError = handleApiError(error, 'authService.authUserByChatId');
      console.error(appError.message);
      throw appError;
    }
  },
};
