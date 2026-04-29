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

export type UserFormValues = {
  firstName: string
  lastName: string
  email: string
  role: string
  document: string
  phoneNumber: string
  password: string
  passwordConfirmation: string
  isAdult: boolean
}

export type UserRoleType = {
  [key: string]: { icon: string; color: string }
}

export const userRoleObj: UserRoleType = {
  director: { icon: 'bx-crown', color: 'error' },
  leader: { icon: 'bx-pie-chart-alt', color: 'success' },
  employee: { icon: 'bx-user', color: 'primary' }
}
