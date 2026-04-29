'use client'

import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner'

import type { AuthValuesType, ErrCallbackType, LoginParams, UserDataType } from './types';
import type { SignIn } from '@/core/domain/gateways/user.gateway';

import authConfig from '@configs/auth';

import { userGateway } from '@/core/infra/gateways/user.gateway.impl.singleton';

import { httpInstance } from '@/core/infra/services/http/http-client.factory';import { getApiErrorMessage } from '@/utils/getApiErrorMessage'

const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      const userDataJson = window.localStorage.getItem('userData')
      let userData = null

      httpInstance.setAuthorizationHeader(storedToken)

      if (userDataJson) {
        userData = JSON.parse(userDataJson)
        setUser(userData)
      }

      setLoading(false)
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    setLoading(true)

    userGateway
      .signIn(params.userName, params.password)
      .then(async (response: SignIn) => {

        toast.success('Login successful!')

        window.localStorage.setItem(
          authConfig.storageTokenKeyName,
          'Bearer ' + response.accessToken
        )

        window.localStorage.setItem('userData', JSON.stringify({
          role: response.role,
          username: response.firstName,
          userId: response.userId,
        }))

        setUser({
          role: response.role,
          username: response.firstName,
          userId: response.userId,
        })

        httpInstance.setAuthorizationHeader('Bearer ' + response.accessToken)

        router.push('/employees')
        setLoading(false)
      })
      .catch((err: unknown) => {
        toast.error(getApiErrorMessage(err, 'Login failed!'))
        setLoading(false)
        if (err instanceof Error && 'code' in err && (err as { code: string }).code === 'ERR_NETWORK') return
        if (errorCallback) errorCallback(err as { [key: string]: string })
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    window.localStorage.removeItem('userData')
    httpInstance.setAuthorizationHeader('')
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
