export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  userName: string
  password: string
  rememberMe?: boolean
}

interface UserFromApi {
  userName?: string
  roleName?: string
  phoneNumber?: string
}

export interface UserDataType extends UserFromApi {
  id?: number
  role?: string
  email?: string
  fullName?: string
  username?: string
  password?: string
  avatar?: string | null
  userId?: string
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}
