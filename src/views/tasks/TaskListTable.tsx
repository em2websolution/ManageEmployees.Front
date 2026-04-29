'use client'

import { useState, useMemo } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

import classnames from 'classnames'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

import type { TaskType } from '@/types/apps/taskTypes'
import { statusColorMap } from '@/types/apps/taskTypes'

import TaskDrawer from './TaskDrawer'
import ConfirmationModal from '@/components/confirmationModal'
import DebouncedInput from '@/components/DebouncedInput'
import { useTasks } from '@/hooks/useTasks'

import tableStyles from '@core/styles/table.module.css'

type TaskTypeWithAction = TaskType & {
  action?: string
}

const columnHelper = createColumnHelper<TaskTypeWithAction>()

const TaskListTable = ({ tableData }: { tableData?: TaskType[] }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState('')

  const { deleteTask, page, pageSize, totalCount, fetchTasks, setPage, setPageSize, loading } = useTasks()

  const getFilterParams = (overrides?: { search?: string; status?: string; start?: string; end?: string }) => {
    const search = overrides?.search ?? globalFilter
    const status = overrides?.status ?? statusFilter
    const start = overrides?.start ?? startDate
    const end = overrides?.end ?? endDate

    return {
      search: search.length >= 3 ? search : undefined,
      status: status && status !== 'All' ? status : undefined,
      startDate: start || undefined,
      endDate: end || undefined
    }
  }

  const handleSearch = (value: string | number) => {
    const search = String(value)

    setGlobalFilter(search)

    if (search.length >= 3 || search.length === 0) {
      const params = getFilterParams({ search })

      setPage(1)
      fetchTasks(1, pageSize, search.length >= 3 ? search : undefined, params.status, params.startDate, params.endDate)
    }
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setPage(1)

    const params = getFilterParams({ status: value })

    fetchTasks(1, pageSize, params.search, value && value !== 'All' ? value : undefined, params.startDate, params.endDate)
  }

  const handleStartDateChange = (value: string) => {
    setStartDate(value)
    setPage(1)

    const params = getFilterParams({ start: value })

    fetchTasks(1, pageSize, params.search, params.status, value || undefined, params.endDate)
  }

  const handleEndDateChange = (value: string) => {
    setEndDate(value)
    setPage(1)

    const params = getFilterParams({ end: value })

    fetchTasks(1, pageSize, params.search, params.status, params.startDate, value || undefined)
  }

  const columns = useMemo<ColumnDef<TaskTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor('title', {
        header: 'Title',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography variant='h6'>{row.original.title}</Typography>
            <Typography variant='body2' color='text.secondary'>
              {row.original.description}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            label={row.original.status}
            color={statusColorMap[row.original.status] || 'default'}
            size='small'
            variant='tonal'
          />
        )
      }),
      columnHelper.accessor('dueDate', {
        header: 'Due Date',
        cell: ({ row }) => (
          <Typography>
            {new Date(row.original.dueDate).toLocaleDateString()}
          </Typography>
        )
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created At',
        cell: ({ row }) => (
          <Typography>
            {new Date(row.original.createdAt).toLocaleDateString()}
          </Typography>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton
              onClick={() => {
                setIsConfirmationModalOpen(true)
                setSelectedTaskId(row.original.id)
              }}
            >
              <i className='bx-trash text-textSecondary text-[22px]' />
            </IconButton>
            <IconButton
              onClick={() => {
                setSelectedTaskId(row.original.id)
                setDrawerOpen(true)
              }}
            >
              <i className='bx-edit text-textSecondary text-[22px]' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tableData]
  )

  const table = useReactTable({
    data: tableData ?? [],
    columns,
    state: {
      rowSelection
    },
    initialState: {
      pagination: {
        pageSize: pageSize
      }
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <>
      <ConfirmationModal
        open={isConfirmationModalOpen}
        onCancel={() => setIsConfirmationModalOpen(false)}
        onConfirm={() => {
          deleteTask(selectedTaskId)
          setIsConfirmationModalOpen(false)
        }}
      />
      <Card>
        <CardHeader title='Manage Tasks' className='pbe-4' />
        {loading && <LinearProgress />}
        <div className='flex flex-col gap-4 p-6 border-bs'>
          <div className='flex justify-between flex-col items-start md:flex-row md:items-center gap-4'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={handleSearch}
              placeholder='Search Task (min 3 chars)'
              className='is-full md:is-auto'
            />
            <Button
              variant='contained'
              startIcon={<i className='bx-plus' />}
              onClick={() => {
                setSelectedTaskId('')
                setDrawerOpen(true)
              }}
              className='is-full md:is-auto'
            >
              Add New Task
            </Button>
          </div>
          <div className='flex flex-col items-start md:flex-row md:items-center gap-4'>
            <FormControl size='small' className='is-full md:min-is-[160px] md:is-auto'>
              <InputLabel>Status</InputLabel>
              <Select
                label='Status'
                value={statusFilter}
                onChange={e => handleStatusChange(e.target.value)}
              >
                <MenuItem value='All'>All</MenuItem>
                <MenuItem value='Pending'>Pending</MenuItem>
                <MenuItem value='InProgress'>In Progress</MenuItem>
                <MenuItem value='Completed'>Completed</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label='Start Date'
              type='date'
              size='small'
              value={startDate}
              onChange={e => handleStartDateChange(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              className='is-full md:is-auto'
            />
            <TextField
              label='End Date'
              type='date'
              size='small'
              value={endDate}
              onChange={e => handleEndDateChange(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              className='is-full md:is-auto'
            />
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='bx-chevron-up text-xl' />,
                            desc: <i className='bx-chevron-down text-xl' />
                          }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getRowModel().rows?.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    {loading ? 'Loading...' : 'No data available'}
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => (
                    <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          component='div'
          count={totalCount}
          page={page - 1}
          onPageChange={(_, newPage) => {
            const nextPage = newPage + 1
            const params = getFilterParams()

            setPage(nextPage)
            fetchTasks(nextPage, pageSize, params.search, params.status, params.startDate, params.endDate)
          }}
          rowsPerPage={pageSize}
          onRowsPerPageChange={e => {
            const newPageSize = parseInt(e.target.value, 10)
            const params = getFilterParams()

            setPageSize(newPageSize)
            setPage(1)
            fetchTasks(1, newPageSize, params.search, params.status, params.startDate, params.endDate)
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Card>

      <TaskDrawer
        open={drawerOpen}
        task={tableData?.find(t => t.id === selectedTaskId)}
        handleClose={() => {
          setDrawerOpen(false)
          setSelectedTaskId('')
        }}
      />
    </>
  )
}

export default TaskListTable
