// Next Imports
import type { Metadata } from 'next'

// Component Imports
import LoginV1 from '@views/Login'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Acesse sua conta'
}

const LoginPage = () => {
  return <LoginV1 />
}

export default LoginPage
