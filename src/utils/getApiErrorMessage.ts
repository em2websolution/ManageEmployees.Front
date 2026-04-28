import type { AxiosError } from 'axios'

export const getApiErrorMessage = (error: unknown, fallback = 'An unexpected error occurred.'): string => {
  const axiosError = error as AxiosError<any>
  const data = axiosError?.response?.data

  if (!data) return fallback

  if (typeof data === 'string') return data

  if (data.Details) return data.Details

  if (data.Error) return data.Error

  if (data.title) return data.title

  return fallback
}
