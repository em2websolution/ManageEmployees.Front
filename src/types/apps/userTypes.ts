// Type Imports
import type { ThemeColor } from '@core/types'

export type UsersType = {
  id: string
  role: string
  email: string
  firstName: string
  lastName: string
  avatar: string
  phoneNumber: string
  avatarColor?: ThemeColor
  document: string
  password?: string
}
