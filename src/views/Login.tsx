'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'

// Type Imports

import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Util Imports

// Styled Component Imports
import AuthIllustrationWrapper from './AuthIllustrationWrapper'
import { useAuth } from '@/hooks/useAuth'

interface FormData {
  userName: string
  password: string
}

const LoginV1 = () => {
  const auth = useAuth()

  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isUserInValid, setisUserInValid] = useState(false)
  const [isPasswordInValid, setisPasswordInValid] = useState(false)

  const [signInData, setSignInData] = useState<FormData>({
    userName: 'admin@company.com',
    password: 'Admin123!',
  })

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (signInData.userName && signInData.password) {
      setisUserInValid(false)
      setisPasswordInValid(false)
      await auth.login(signInData)
    }
    else {
      setisUserInValid(true)
      setisPasswordInValid(true)
    }

  }

  return (
    <div className='flex w-full h-full justify-center items-center' >
      <AuthIllustrationWrapper>
        <Card className='flex flex-col sm:is-[450px]'>
          <CardContent className='sm:!p-12'>
            <Link href='/' className='flex justify-center mbe-6'>
              <Logo />
            </Link>
            <div className='flex flex-col gap-1 mbe-6'>
              <Typography variant='h5' className='mb-1' >{`Welcome to ${themeConfig.templateName}! 👋🏻`}</Typography>
              <Typography>Please enter your username and password to access the system</Typography>
            </div>
            <form noValidate autoComplete='off' onSubmit={handleSignIn} className='flex flex-col gap-6'>
              <CustomTextField
                autoFocus
                fullWidth
                label='User'
                placeholder='Enter your user name'
                error={!signInData.userName && isUserInValid}
                value={signInData.userName}
                onChange={event =>
                  setSignInData({ ...signInData, userName: event.target.value })
                }
              />
              {!signInData.userName && isUserInValid && (
                <Typography variant='caption' color='error'>Please, enter your user name</Typography>
              )}
              <CustomTextField
                fullWidth
                label='Password'
                placeholder='············'
                id='outlined-adornment-password'
                type={isPasswordShown ? 'text' : 'password'}
                value={signInData.password}
                error={!signInData.password && isPasswordInValid}
                onChange={event =>
                  setSignInData({ ...signInData, password: event.target.value })
                }
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                          <i className={isPasswordShown ? 'bx-hide' : 'bx-show'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
              {!signInData.password && isPasswordInValid && (
                <Typography variant='caption' color='error'>Please, enter your password</Typography>
              )}
              <Button fullWidth variant='contained' type='submit'>
                Login
              </Button>
              <div className='mb-4 flex justify-center items-center flex-wrap'>
                <Typography variant='body1'>
                  System version: {process.env.NEXT_PUBLIC_VERSAO}
                </Typography>
              </div>
            </form>
          </CardContent>
        </Card>
      </AuthIllustrationWrapper>
    </div>
  )
}

export default LoginV1
