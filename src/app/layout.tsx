// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

import { Toaster } from 'sonner'

// Type Imports
import type { ChildrenType } from '@core/types'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'


import { AuthProvider } from '@/contexts/AuthContext'
import { UsersProvider } from '@/contexts/UsersContext'

export const metadata = {
  title: 'Manage Employeers',
  description:
    'Manage Employeers'
}

const RootLayout = async (props: ChildrenType) => {
  const { children } = props

  // Vars

  const systemMode = await getSystemMode()
  const direction = 'ltr'

  return (
    <html id='__next' lang='en' dir={direction} suppressHydrationWarning>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
        <Toaster richColors />
        <AuthProvider>
          <UsersProvider>
            {children}
          </UsersProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

export default RootLayout
