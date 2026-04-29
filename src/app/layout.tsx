import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

import 'react-perfect-scrollbar/dist/css/styles.css'

import { Toaster } from 'sonner'

import type { ChildrenType } from '@core/types'

import { getSystemMode } from '@core/utils/serverHelpers'

import '@/app/globals.css'

import '@assets/iconify-icons/generated-icons.css'


import { AuthProvider } from '@/contexts/AuthContext'
import { UsersProvider } from '@/contexts/UsersContext'
import { TasksProvider } from '@/contexts/TasksContext'
import RouteLoading from '@/components/RouteLoading'

export const metadata = {
  title: 'Manage Employeers',
  description:
    'Manage Employeers'
}

const RootLayout = async (props: ChildrenType) => {
  const { children } = props

  const systemMode = await getSystemMode()
  const direction = 'ltr'

  return (
    <html id='__next' lang='en' dir={direction} suppressHydrationWarning>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
        <Toaster richColors />
        <AuthProvider>
          <UsersProvider>
            <TasksProvider>
              <RouteLoading />
              {children}
            </TasksProvider>
          </UsersProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

export default RootLayout
