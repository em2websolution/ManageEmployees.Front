// Type Imports
import type { ThemeColor } from '@core/types'

export type UsersType = {
  id: string
  role: string
  email: string
  firstName: string
  lastName: string
  managerId: string
  avatar: string
  contacts: string[]
  avatarColor?: ThemeColor
  document: string
  managerName: string
  password?: string
}
