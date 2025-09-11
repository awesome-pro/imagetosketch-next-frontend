import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";

const baseURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api` || 'http://localhost:8080/api'

interface APIError {
  detail: string | Array<{
    type: string;
    loc: (string | number)[];
    msg: string;
    input?: any;
    ctx?: Record<string, any>;
  }>;
}

export class APIErrorHandler extends Error {
  public status: number;
  public detail: APIError['detail'];
  public headers?: Record<string, string>;

  constructor(status: number, detail: APIError['detail'], headers?: Record<string, string>) {
    const message = typeof detail === 'string' 
      ? detail 
      : detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ');
    
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.detail = detail;
    this.headers = headers;
  }
}


export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true,
  timeout: 60000,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: AxiosRequestConfig;
}> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach(request => {
    if (error) {
      request.reject(error);
    } else {
      api(request.config).then(request.resolve).catch(request.reject);
    }
  });
  
  failedQueue = [];
};

const refreshAuthToken = async () => {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok || response.status !== 200) {
      throw new Error('Failed to refresh token');
    }
    
    const data = await response.json();
    return data.isSignedIn;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    if (!error.response) {
      toast.error('Network error - please check your connection');
      return Promise.reject(new Error('Network error - please check your connection'));
    }
    
    const { status, data, headers } = error.response;
    
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const refreshed = await refreshAuthToken();
        
        if (refreshed) {
          processQueue(null);
          setTimeout(() => {
            return api(originalRequest);
          }, 500);
        } else {
          processQueue(error);
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/sign-in';
          }
          return Promise.reject(new APIErrorHandler(401, 'Authentication failed'));
        }
      } catch (refreshError) {
        processQueue(error);
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/sign-in';
        }
        return Promise.reject(new APIErrorHandler(401, 'Token refresh failed'));
      } finally {
        isRefreshing = false;
      }
    }
    
    if (status === 403) {
      const errorDetail = (data as APIError)?.detail || 'Access forbidden';
      return Promise.reject(new APIErrorHandler(403, errorDetail, headers as Record<string, string>));
    }
    
    if (status === 422) {
      const errorDetail = (data as APIError)?.detail || 'Validation error';
      return Promise.reject(new APIErrorHandler(422, errorDetail, headers as Record<string, string>));
    }
    
    if (status === 429) {
      const retryAfter = headers?.['retry-after'];
      const errorDetail = (data as APIError)?.detail || 'Too many requests';
      
      console.warn(`Rate limited. Retry after: ${retryAfter} seconds`);
      
      return Promise.reject(new APIErrorHandler(429, errorDetail, headers as Record<string, string>));
    }
    
    if (status >= 400 && status < 500) {
      const errorDetail = (data as APIError)?.detail || `Client error: ${status}`;
      return Promise.reject(new APIErrorHandler(status, errorDetail, headers as Record<string, string>));
    }
    
    if (status >= 500) {
      const errorDetail = (data as APIError)?.detail || 'Internal server error';
      
      console.error(`Server error ${status}:`, errorDetail);
      
      return Promise.reject(new APIErrorHandler(status, errorDetail, headers as Record<string, string>));
    }
    
    return Promise.reject(error);
  }
);

export default api;