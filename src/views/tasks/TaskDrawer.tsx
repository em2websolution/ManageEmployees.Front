'use client'

import { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'

import CustomTextField from '@core/components/mui/TextField'
import { useTasks } from '@/hooks/useTasks'
import { getApiErrorMessage } from '@/utils/getApiErrorMessage'
import type { TaskType, TaskFormValues } from '@/types/apps/taskTypes'
import { taskStatuses } from '@/types/apps/taskTypes'

type Props = {
  task?: TaskType
  open: boolean
  handleClose: () => void
}

const getToday = () => new Date().toISOString().split('T')[0]

const TaskDrawer = (props: Props) => {
  const { fetchTasks } = useTasks()
  const [submitting, setSubmitting] = useState(false)

  const { open, handleClose } = props

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<TaskFormValues>({
    defaultValues: {
      title: '',
      description: '',
      status: 'Pending',
      dueDate: getToday()
    }
  })

  useEffect(() => {
    if (props.task) {
      resetForm({
        title: props.task.title || '',
        description: props.task.description || '',
        status: props.task.status || 'Pending',
        dueDate: props.task.dueDate ? props.task.dueDate.split('T')[0] : ''
      })
    } else {
      resetForm({
        title: '',
        description: '',
        status: 'Pending',
        dueDate: getToday()
      })
    }
  }, [props.task, resetForm])

  const { createTask, updateTask } = useTasks()

  const onSubmit = async (data: TaskFormValues) => {
    setSubmitting(true)

    try {
      if (props.task) {
        await updateTask(props.task.id, {
          title: data.title,
          description: data.description,
          status: data.status,
          dueDate: data.dueDate
        })
      } else {
        await createTask({
          title: data.title,
          description: data.description,
          status: data.status,
          dueDate: data.dueDate
        })
      }

      await fetchTasks()
      handleReset()
    } catch (e) {
      console.error(e)
      toast.error(getApiErrorMessage(e, 'Error saving task'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    resetForm({
      title: '',
      description: '',
      status: 'Pending',
      dueDate: getToday()
    })

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
        <Typography variant='h5'>{props?.task ? 'Update Task' : 'Add New Task'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='bx-x text-textPrimary text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-6'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <Controller
            name='title'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Title'
                placeholder='Task title'
                {...(errors.title && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='description'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                multiline
                rows={3}
                label='Description'
                placeholder='Task description'
              />
            )}
          />
          <Controller
            name='status'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                select
                fullWidth
                label='Status'
                {...field}
                error={Boolean(errors.status)}
              >
                {taskStatuses.map(s => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />
          <Controller
            name='dueDate'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                type='date'
                label='Due Date'
                slotProps={{ inputLabel: { shrink: true } }}
                {...(errors.dueDate && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit' disabled={submitting}>
              {submitting ? <CircularProgress size={24} color='inherit' /> : 'Submit'}
            </Button>
            <Button variant='tonal' color='error' type='reset' onClick={handleReset}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default TaskDrawer
