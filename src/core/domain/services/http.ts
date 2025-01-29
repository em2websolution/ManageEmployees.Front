export interface RequestConfig {
  headers?: Record<string, string>
  params?: Record<string, string | number>
}

export interface HttpRequest<T = any> {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: T
  config?: RequestConfig
}

export interface HttpClient {
  setAuthorizationHeader(token: string): void
  request<TResponse = any, TData = any>(options: HttpRequest<TData>): Promise<TResponse>;
  get<TResponse = any>(url: string, config?: RequestConfig): Promise<TResponse>;
  post<TResponse = any, TData = any>(url: string, data?: TData, config?: RequestConfig): Promise<TResponse>;
  put<TResponse = any, TData = any>(url: string, data?: TData, config?: RequestConfig): Promise<TResponse>;
  patch<TResponse = any, TData = any>(url: string, data?: TData, config?: RequestConfig): Promise<TResponse>;
  delete<TResponse = any>(url: string, config?: RequestConfig): Promise<TResponse>;
}
