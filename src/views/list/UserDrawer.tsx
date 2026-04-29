import { useState, useEffect } from 'react'

import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'

import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'

import { Checkbox } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'

import { userGateway } from '@/core/infra/gateways/user.gateway.impl.singleton'
import { useUsers } from '@/hooks/useUsers'
import { getApiErrorMessage } from '@/utils/getApiErrorMessage'
import type { UsersType, UserFormValues } from '@/types/apps/userTypes'


type Props = {
  user?: UsersType
  open: boolean
  handleClose: () => void
}

const roles = ['Administrator', 'Employee']

const UserDrawer = (props: Props) => {
  const { fetchUsers } = useUsers()

  const [submitting, setSubmitting] = useState(false)

  const [isPasswordShown, setIsPasswordShown] = useState({
    password: false,
    passwordConfirmation: false
  })

  const handleClickShowPassword = (field: 'password' | 'passwordConfirmation') => {
    setIsPasswordShown((prev) => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const { open, handleClose } = props

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<UserFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      document: '',
      phoneNumber: '',
      email: '',
      role: '',
      password: '',
      passwordConfirmation: '',
      isAdult: false
    }
  })

  useEffect(() => {
    if (props.user) {
      resetForm({
        firstName: props.user.firstName || '',
        lastName: props.user.lastName || '',
        document: props.user.document || '',
        phoneNumber: props.user.phoneNumber || '',
        email: props.user.email || '',
        role: props.user.role || '',
        password: '',
        passwordConfirmation: ''
      })
    } else {
      resetForm({
        firstName: '',
        lastName: '',
        document: '',
        phoneNumber: '',
        email: '',
        role: '',
        password: '',
        passwordConfirmation: '',
        isAdult: false
      })
    }
  }, [props.user, resetForm])

  function reset() {
    resetForm({
      firstName: '',
      lastName: '',
      document: '',
      phoneNumber: '',
      email: '',
      role: '',
      password: '',
      passwordConfirmation: '',
      isAdult: false
    })
  }

  const onSubmit = async (data: UserFormValues) => {
    setSubmitting(true)

    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        phoneNumber: data.phoneNumber,
        docNumber: data.document,
        password: data.password,
        confirmPassword: data.passwordConfirmation
      }

      if (props.user) {
        await userGateway.updateUser(props.user.id, payload)
        toast.success('User updated successfully')
      } else {
        await userGateway.createUser(payload)
        toast.success('User created successfully')
      }

      await fetchUsers()

      reset()
      handleClose()
    } catch (e) {
      console.error(e)
      toast.error(getApiErrorMessage(e, 'Error saving user'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    reset()
    handleClose()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between p-6'>
        <Typography variant='h5'>{
          props?.user ? 'Update user' : 'Add New User'
        }</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='bx-x text-textPrimary text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-6'>
        <form onSubmit={handleSubmit(data => onSubmit(data))} className='flex flex-col gap-6'>
          <Controller
            name='firstName'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='First Name'
                placeholder='John Doe'
                {...(errors.firstName && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='lastName'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Last Name'
                placeholder='johndoe'
                {...(errors.lastName && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='email'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                type='email'
                label='Email'
                placeholder='johndoe@gmail.com'
                {...(errors.email && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='phoneNumber'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Phone Number'
                placeholder='202 555 0111'
              />
            )}
          />
          <Controller
            name='document'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Document Number'
                placeholder='999.999.999-99'
                {...(errors.firstName && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='role'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                select
                fullWidth
                id='select-role'
                label='Select Role'
                {...field}
                error={Boolean(errors.role)}
              >
                {
                  roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))
                }
              </CustomTextField>
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required.",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long."
              },
              maxLength: {
                value: 64,
                message: "Password cannot exceed 64 characters."
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/,
                message:
                  "Password must have at least one uppercase letter, one lowercase letter, one number, and one special character."
              }
            }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label="Password"
                type={isPasswordShown.password ? "text" : "password"}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => handleClickShowPassword("password")}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <i className={isPasswordShown.password ? "bx-hide" : "bx-show"} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
              />
            )}
          />
          <Controller
            name="passwordConfirmation"
            control={control}
            rules={{
              required: "Password confirmation is required.",
              validate: (value) =>
                value === control._getWatch("password") || "Passwords do not match."
            }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label="Password Confirmation"
                type={isPasswordShown.passwordConfirmation ? "text" : "password"}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => handleClickShowPassword("passwordConfirmation")}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <i className={isPasswordShown.passwordConfirmation ? "bx-hide" : "bx-show"} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
                error={Boolean(errors.passwordConfirmation)}
                helperText={errors.passwordConfirmation?.message}
              />
            )}
          />
          <Controller
            name="isAdult"
            control={control}
            rules={{
              required: "You must confirm that you are over 18 years old."
            }}
            render={({ field }) => (
              <div className="flex items-center">
                <Checkbox
                  checked={!!field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
                <Typography variant="body2" color={errors.isAdult ? "error" : "textPrimary"}>
                  I confirm that I am over 18 years old.
                </Typography>
              </div>
            )}
          />
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit' disabled={submitting}>
              {submitting ? <CircularProgress size={24} color='inherit' /> : 'Submit'}
            </Button>
            <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default UserDrawer
