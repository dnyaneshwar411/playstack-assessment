export type APIInterfaceType = {
  get: (endpoint: string, options?: HTTPRequestOptionsType) => Promise<any>;
  post: (endpoint: string, options?: HTTPRequestOptionsType) => Promise<any>;
  put: (endpoint: string, options?: HTTPRequestOptionsType) => Promise<any>;
  patch: (endpoint: string, options?: HTTPRequestOptionsType) => Promise<any>;
  delete: (endpoint: string, options?: HTTPRequestOptionsType) => Promise<any>;
};

type BodyKey =
  | string
  | number
  | boolean
  | BodyKey[]
  | { [key: string]: BodyKey };

export type HTTPRequestOptionsType = {
  headers?: Record<string, string>;
  method?: string;
  query?: Record<string, string>;
  body?: BodyKey | Blob | FormData | URLSearchParams | ReadableStream;
  early?: boolean
};

export type APIInterfaceRequest = Exclude<HTTPRequestOptionsType, "method">;
