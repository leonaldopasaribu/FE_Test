import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api';
import type { SignInRequest, SignInResponse } from '../api/auth/types';

export const useSignIn = () => {
  return useMutation<SignInResponse, Error, SignInRequest>({
    mutationFn: (credentials: SignInRequest) => authApi.signin(credentials),
    onSuccess: (data) => {
      // Store auth token
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
    },
  });
};

export const useSignOut = () => {
  return () => {
    authApi.signout();
  };
};
