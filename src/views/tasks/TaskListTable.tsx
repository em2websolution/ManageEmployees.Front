'use client'

import { useEffect, useState, useMemo } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'

import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

import type { TaskType } from '@/types/apps/taskTypes'
import type { ThemeColor } from '@core/types'

import TaskDrawer from './TaskDrawer'
import ConfirmationModal from '@/components/confirmationModal'
import { useTasks } from '@/hooks/useTasks'

import tableStyles from '@core/styles/table.module.css'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type TaskTypeWithAction = TaskType & {
  action?: string
}

const statusColorMap: Record<string, ThemeColor> = {
  Pending: 'warning',
  InProgress: 'info',
  Completed: 'success'
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

const columnHelper = createColumnHelper<TaskTypeWithAction>()

const TaskListTable = ({ tableData }: { tableData?: TaskType[] }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState('')

  const { deleteTask, page, pageSize, totalCount, fetchTasks, setPage, setPageSize } = useTasks()

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
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: pageSize
      }
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
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
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search Task'
            className='max-sm:is-full'
          />
          <Button
            variant='contained'
            startIcon={<i className='bx-plus' />}
            onClick={() => {
              setSelectedTaskId('')
              setDrawerOpen(true)
            }}
            className='max-sm:is-full'
          >
            Add New Task
          </Button>
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
            {table.getFilteredRowModel().rows?.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
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

            setPage(nextPage)
            fetchTasks(nextPage, pageSize)
          }}
          rowsPerPage={pageSize}
          onRowsPerPageChange={e => {
            const newPageSize = parseInt(e.target.value, 10)

            setPageSize(newPageSize)
            setPage(1)
            fetchTasks(1, newPageSize)
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
