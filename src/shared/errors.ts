/**
 * Error handling utilities
 */

/**
 * Standard error types in the application
 */
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
}

/**
 * Standardized application error
 */
export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: unknown;
}

/**
 * Creates a standardized error object
 */
export function createError(type: ErrorType, message: string, originalError?: unknown): AppError {
  return {
    type,
    message,
    originalError,
  };
}

/**
 * Handles API request errors and returns a standardized error object
 */
export function handleApiError(error: unknown, context: string): AppError {
  console.error(`Error in ${context}:`, error);

  // Check if it's a network error
  if (error instanceof Error && 'message' in error) {
    if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
      return createError(
        ErrorType.NETWORK_ERROR,
        'Не удалось подключиться к серверу. Проверьте подключение к интернету.',
        error
      );
    }
  }

  // Handle axios error
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { status: number; data: unknown } };

    if (axiosError.response) {
      const status = axiosError.response.status;

      if (status === 400) {
        return createError(ErrorType.VALIDATION_ERROR, 'Неверные данные запроса', error);
      }

      if (status === 401 || status === 403) {
        return createError(
          ErrorType.API_ERROR,
          'Ошибка авторизации. Пожалуйста, войдите снова.',
          error
        );
      }

      if (status === 404) {
        return createError(ErrorType.API_ERROR, 'Запрашиваемый ресурс не найден', error);
      }

      if (status >= 500) {
        return createError(ErrorType.API_ERROR, 'Ошибка сервера. Попробуйте позже.', error);
      }
    }
  }

  // Default error
  return createError(ErrorType.UNEXPECTED_ERROR, 'Произошла неожиданная ошибка', error);
}

/**
 * Helper for handling thunk rejections
 */
export function handleThunkError(
  error: unknown,
  context: string,
  thunkAPI: { rejectWithValue: (value: AppError) => unknown }
) {
  const appError = handleApiError(error, context);
  return thunkAPI.rejectWithValue(appError);
}
