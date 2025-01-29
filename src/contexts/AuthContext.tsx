'use client'

import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner'

import CryptoJS from 'crypto-js';

import type { AuthValuesType, ErrCallbackType, LoginParams, UserDataType } from './types';

import authConfig from '@configs/auth';

import { userGateway } from '@/core/infra/gateways/user.gateway.impl.singleton';
import { httpInstance } from '@/core/infra/services/http/http-client.factory';

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
  // States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // Hooks
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
  }, [user?.username])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    setLoading(true)

    function encrypt(data: string) {
      const key = CryptoJS.enc.Utf8.parse(process.env.NEXT_PUBLIC_SECRET_ENCRYPT_KEY!)
      const iv = CryptoJS.lib.WordArray.random(16);

      const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      const encryptedData =
        iv.toString(CryptoJS.enc.Hex) + ':' +
        encrypted.ciphertext.toString(CryptoJS.enc.Base64);

      return encryptedData;
    }

    userGateway
      .signIn(params.userName, encrypt(params.password))
      .then(async (response: any) => {

        toast.success('Login realizado com sucesso!')

        window.localStorage.setItem(
          authConfig.storageTokenKeyName,
          'Bearer ' + response.accessToken
        )

        window.localStorage.setItem('userData', JSON.stringify({
          role: response.role,
          username: response.firstName,
        }))

        httpInstance.setAuthorizationHeader('Bearer ' + response.accessToken)

        router.push('/home')
        setLoading(false)
      })
      .catch((err: any) => {
        toast.error('Erro ao realizar login!')
        setLoading(false)
        if (err.code === 'ERR_NETWORK') return
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.clear();
    sessionStorage.clear();
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
