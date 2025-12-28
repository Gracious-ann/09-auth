import axios, { AxiosError } from 'axios';

export const api = axios.create({
  baseURL: 'https://notehub-api.goit.study',
  withCredentials: true,
});

export type ApiErrorResponse = {
  message?: string;
  error?: string;
  validation?: {
    body?: {
      message?: string;
    };
  };
};

export type ApiError = AxiosError<ApiErrorResponse>;
