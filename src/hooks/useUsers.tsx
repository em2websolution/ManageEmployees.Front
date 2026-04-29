import { useContext } from 'react'

import { UsersContext } from '@/contexts/UsersContext'

export const useUsers = () => {
  const context = useContext(UsersContext)

  if (!context) {
    throw new Error('UsersContext must be used within a UsersProvider')
  }

  return context
}
