import { User } from '../../types/dbTypes';
import api from '../../api/http/axios';
import { store } from '../../store';
import { setUser } from './store/userSlice';
import { handleApiError } from '../../shared/errors';

const url = '/users';

/**
 * Service for managing user data with database and store integration
 */
export const userService = {
  /**
   * Fetch current user from the server and update the store
   */
  async fetchAndStoreCurrentUser(): Promise<void> {
    try {
      const response = await api.get<User>(`${url}/me`);

      store.dispatch(setUser(response.data));
    } catch (error) {
      const appError = handleApiError(error, 'userService.fetchAndStoreCurrentUser');
      console.error(appError.message);
      throw appError;
    }
  },
};
