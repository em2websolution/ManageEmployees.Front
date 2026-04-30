import type { AxiosError } from 'axios'

interface ApiErrorResponse {
  detail?: string
  title?: string
  Details?: string
  Error?: string
}

export const getApiErrorMessage = (error: unknown, fallback = 'An unexpected error occurred.'): string => {
  const axiosError = error as AxiosError<ApiErrorResponse | string>
  const data = axiosError?.response?.data

  if (!data) return fallback

  if (typeof data === 'string') return data

  // ApiErrorResponse
  if (data.detail) return data.detail
  if (data.title) return data.title

  // Legacy formats
  if (data.Details) return data.Details
  if (data.Error) return data.Error

  return fallback
}
