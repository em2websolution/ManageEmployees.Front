import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

import type { HttpClient, HttpRequest, RequestConfig } from '@/core/domain/services/http'

const BASE_URLS = {
  API: process.env.NEXT_PUBLIC_BASE_URL,
}

export class AxiosHttpClient implements HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URLS.API,
    })

    this.client.interceptors.request.use(this.addAuthToken)
  }

  setAuthorizationHeader(token: string): void {
    this.client.defaults.headers.Authorization = token
  }

  private addAuthToken(config: InternalAxiosRequestConfig) {
    const token = localStorage.getItem('accessToken')

    if (token) {
      config.headers.set('Authorization', token)
    }

    return config
  }

  async request<TResponse = any, TData = any>(options: HttpRequest<TData>): Promise<TResponse> {
    const { url, method, data, config } = options
    const axiosConfig = this.convertToAxiosConfig(config)

    const response = await this.client.request<TResponse>({
      url,
      method,
      data,
      ...axiosConfig
    })

    return response.data
  }

  async get<TResponse = any>(url: string, config?: RequestConfig): Promise<TResponse> {
    return this.request({ url, method: 'GET', config })
  }

  async post<TResponse = any, TData = any>(url: string, data?: TData, config?: RequestConfig): Promise<TResponse> {
    return this.request({ url, method: 'POST', data, config })
  }

  async put<TResponse = any, TData = any>(url: string, data?: TData, config?: RequestConfig): Promise<TResponse> {
    return this.request({ url, method: 'PUT', data, config })
  }

  async patch<TResponse = any, TData = any>(url: string, data?: TData, config?: RequestConfig): Promise<TResponse> {
    return this.request({ url, method: 'PATCH', data, config })
  }

  async delete<TResponse = any>(url: string, config?: RequestConfig): Promise<TResponse> {
    return this.request({ url, method: 'DELETE', config })
  }

  private convertToAxiosConfig(config?: RequestConfig) {
    if (!config) return undefined

    const axiosConfig: any = {}

    if (config.headers) {
      axiosConfig.headers = config.headers
    }

    if (config.params) {
      axiosConfig.params = config.params
    }

    return axiosConfig
  }
}
