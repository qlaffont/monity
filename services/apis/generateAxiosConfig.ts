/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

export enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export const generateAxiosConfig = (url: string, method: HTTPMethod, data: any = undefined): AxiosRequestConfig => {
  const config: AxiosRequestConfig = {
    baseURL: 'http://localhost:5000',
    url,
    method,
  };

  const token = Cookies.get('monityToken');

  if (token) {
    config.headers = {
      Authorization: token,
    };
  }

  if (data !== undefined) {
    config.data = data;
  }

  return config;
};

export default generateAxiosConfig;
