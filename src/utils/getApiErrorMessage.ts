import type { AxiosError } from 'axios'

export const getApiErrorMessage = (error: unknown, fallback = 'An unexpected error occurred.'): string => {
  const axiosError = error as AxiosError<any>
  const data = axiosError?.response?.data

  if (!data) return fallback

  // RFC 7807 (ApiErrorResponse)
  if (data.detail) return data.detail
  if (data.title) return data.title

  // Legacy formats
  if (data.Details) return data.Details
  if (data.Error) return data.Error

  if (typeof data === 'string') return data

  return fallback
}
