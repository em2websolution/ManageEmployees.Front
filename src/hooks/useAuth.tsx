import { useContext } from 'react'

import { AuthContext } from '@/contexts/AuthContext'

export const useAuth = () => {
  // Hooks
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider')
  }

  return context
}
