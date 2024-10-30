import axios, { CreateAxiosDefaults } from "axios";
import { getCookie, deleteCookie } from "cookies-next";

declare module 'axios' {
  export interface AxiosRequestConfig {
    authorization?: boolean;
  }
}

type SetupAxiosClientParams = {
  options: CreateAxiosDefaults;
};

export const setupAxiosClient = (input: SetupAxiosClientParams) => {
  const client = axios.create(input.options);
  client.interceptors.request.use(
    (config) => {
      if (config.authorization !== false || config.authorization) {
        const token = getCookie("session");
        if (token) {
          config.headers.Authorization = "Bearer " + token;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response.status === 401) {
        deleteCookie("session");
      }

      return Promise.reject(error);
    }
  );

  return client;
};

export const api = setupAxiosClient({
  options: {
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 600 * 1000,
  }
});