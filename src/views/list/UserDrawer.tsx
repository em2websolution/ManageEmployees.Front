import { useMemo, useState } from 'react'

// MUI Imports
import { useEffect } from 'react'

import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'

import { Checkbox } from '@mui/material'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Gateways Imports
import { userGateway } from '@/core/infra/gateways/user.gateway.impl.singleton'
import { useUsers } from '@/hooks/useUsers'
import type { UsersType } from '@/types/apps/userTypes'


type Props = {
  user?: UsersType
  open: boolean
  handleClose: () => void
}

type FormValidateType = {
  firstName: string
  lastName: string
  email: string
  role: string
  managerId: string
  managerName: string
  document: string
  contacts: string[]
  password: string
  passwordConfirmation: string
  isAdult: boolean
}

const UserDrawer = (props: Props) => {
  const { users, fetchUsers } = useUsers()

  const [isPasswordShown, setIsPasswordShown] = useState({
    password: false,
    passwordConfirmation: false
  })

  const [contacts, setContacts] = useState(props?.user?.contacts);

  const addContact = () => {
    setContacts([...contacts, ""]);
  };

  const removeContact = (index: number) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);

    setContacts(updatedContacts);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedContacts = [...contacts];

    updatedContacts[index] = e.target.value;
    setContacts(updatedContacts);
  };

  const handleClickShowPassword = (field: 'password' | 'passwordConfirmation') => {
    setIsPasswordShown((prev) => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  // Props
  const { open, handleClose } = props

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValidateType>({
    defaultValues: {
      firstName: props.user?.firstName || '',
      lastName: props.user?.lastName || '',
      contacts: props.user?.contacts || [],
      document: props.user?.document || '',
      email: props.user?.email || '',
      role: props.user?.role || '',
      managerId: props.user?.managerId || '',
      managerName: props.user?.managerName || '',
      password: '',
      passwordConfirmation: '',
      isAdult: false
    }
  })

  useEffect(() => {
    if (props.user) {

      setContacts([...props.user.contacts]);

      resetForm({
        firstName: props.user.firstName || '',
        lastName: props.user.lastName || '',
        contacts: props.user.contacts || [],
        document: props.user.document || '',
        email: props.user.email || '',
        role: props.user.role || '',
        managerId: props.user.managerId || '',
        managerName: props.user.managerName || '',
        password: '',
        passwordConfirmation: ''
      });
    }
  }, [props.user, resetForm]);

  function reset() {
    setContacts([]);

    resetForm({
      firstName: '',
      lastName: '',
      contacts: [],
      document: '',
      email: '',
      role: '',
      managerId: '',
      managerName: '',
      password: '',
      passwordConfirmation: '',
      isAdult: false
    })
  }

  const onSubmit = async (data: FormValidateType) => {
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        phoneNumber: contacts?.join(',') as string,
        docNumber: data.document,
        managerId: data.managerId,
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
      toast.error('Error creating user')
    }
  }

  const handleReset = () => {
    reset()
    handleClose()
  }

  const roles = useMemo(() => {
    const all = ['Director', 'Leader', 'Employee']

    const userFromStorage = JSON.parse(localStorage.getItem('userData')!)

    if (userFromStorage?.role === 'Director') return all
    if (userFromStorage?.role === 'Leader') return all.slice(1)

    return all.slice(2)
  }, [])

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
            name="contacts"
            control={control}
            render={({ field }) => (
              <>
                {contacts?.map((contact, index) => (
                  <CustomTextField
                    key={index}
                    {...field}
                    fullWidth
                    label={`Contact ${index + 1}`}
                    placeholder="202 555 0111"
                    value={contact}
                    onChange={(e: any) => handleContactChange(e, index)}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={addContact}>
                              <i className="bx-plus" />
                            </IconButton>
                            {index > 0 && (
                              <IconButton onClick={() => removeContact(index)}>
                                <i className="bx-trash" />
                              </IconButton>
                            )}
                          </InputAdornment>
                        ),
                      },
                    }}
                    error={Boolean(errors.contacts?.[index])}
                    helperText={errors.contacts?.[index]?.message || ""}
                  />
                ))}
              </>
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
            name='managerId'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                select
                fullWidth
                id='select-manager'
                label='Select Manager'
                {...field}
                error={Boolean(errors.managerId)}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </MenuItem>
                ))}
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
                <Checkbox {...field} />
                <Typography variant="body2" color={errors.isAdult ? "error" : "textPrimary"}>
                  I confirm that I am over 18 years old.
                </Typography>
              </div>
            )}
          />
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Submit
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
