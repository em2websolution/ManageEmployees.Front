'use client'


import { useState, useMemo } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

import TablePagination from '@mui/material/TablePagination'

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

import type { UsersType } from '@/types/apps/userTypes'
import { userRoleObj } from '@/types/apps/userTypes'

import UserDrawer from './UserDrawer'
import CustomAvatar from '@core/components/mui/Avatar'

import { getInitials } from '@/utils/getInitials'

import tableStyles from '@core/styles/table.module.css'
import { useUsers } from '@/hooks/useUsers'
import ConfirmationModal from '@/components/confirmationModal'
import DebouncedInput from '@/components/DebouncedInput'

type UsersTypeWithAction = UsersType & {
  action?: string
}

const Icon = styled('i')({})

// Column Definitions
const columnHelper = createColumnHelper<UsersTypeWithAction>()

const UserListTable = ({ tableData }: { tableData?: UsersType[] }) => {
  const [userOpen, setUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [userId, setUserId] = useState('')

  const { deleteUser, page, pageSize, totalCount, fetchUsers, setPage, setPageSize, loading } = useUsers()

  const getFilterParams = (overrides?: { search?: string; role?: string }) => {
    const search = overrides?.search ?? globalFilter
    const role = overrides?.role ?? roleFilter

    return {
      search: search.length >= 3 ? search : undefined,
      role: role && role !== 'All' ? role : undefined
    }
  }

  const handleSearch = (value: string | number) => {
    const search = String(value)

    setGlobalFilter(search)

    if (search.length >= 3 || search.length === 0) {
      const params = getFilterParams({ search })

      setPage(1)
      fetchUsers(1, pageSize, search.length >= 3 ? search : undefined, params.role)
    }
  }

  const handleRoleChange = (value: string) => {
    setRoleFilter(value)
    setPage(1)

    const params = getFilterParams({ role: value })

    fetchUsers(1, pageSize, params.search, value && value !== 'All' ? value : undefined)
  }

  const columns = useMemo<ColumnDef<UsersTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor('firstName', {
        header: 'User',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {getAvatar({ avatar: row.original.avatar, firstName: row.original.firstName })}
            <div className='flex flex-col'>
              <Typography variant='h6'>{row.original.firstName}</Typography>
              <Typography variant='body2'>{row.original.email}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Icon
              className={classnames('text-xl', userRoleObj[String(row.original.role).toLowerCase()]?.icon)}
              sx={{ color: `var(--mui-palette-${userRoleObj[String(row.original.role).toLocaleLowerCase()]?.color}-main)` }}
            />
            <Typography className='capitalize' color='text.primary'>
              {row.original.role}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('phoneNumber', {
        header: 'Phone',
        cell: ({ row }) => (
          <Typography color="text.primary">
            {row.original.phoneNumber}
          </Typography>
        )
      }),
      columnHelper.accessor('document', {
        header: 'Document',
        cell: ({ row }) => <Typography>{row.original.document}</Typography>
      }),


      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>

            <IconButton
              onClick={() => {
                setIsConfirmationModalOpen(true)
                setUserId(row.original.id)
              }}
            >
              <i className="bx-trash text-textSecondary text-[22px]" />
            </IconButton>
            <IconButton onClick={() => {
              setUserId(row.original.id)
              setUserOpen(true)
            }} >
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

  const getAvatar = (params: Pick<UsersType, 'avatar' | 'firstName'>) => {
    const { avatar, firstName } = params

    if (avatar) {
      return <CustomAvatar src={avatar} size={34} />
    } else {
      return <CustomAvatar size={34}>{getInitials(firstName as string)}</CustomAvatar>
    }
  }

  return (
    <>
      <ConfirmationModal
        open={isConfirmationModalOpen}
        onCancel={() => setIsConfirmationModalOpen(false)}
        onConfirm={() => {
          deleteUser(userId)
          setIsConfirmationModalOpen(false)
        }}
      />
      <Card>
        <CardHeader title='Manage employees' className='pbe-4' />
        {loading && <LinearProgress />}
        <div className='flex flex-col gap-4 p-6 border-bs'>
          <div className='flex justify-between flex-col items-start md:flex-row md:items-center gap-4'>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-4 is-full md:is-auto'>
              <DebouncedInput
                value={globalFilter ?? ''}
                onChange={handleSearch}
                placeholder='Search User (min 3 chars)'
                className='is-full md:is-auto'
              />
            <FormControl size='small' className='is-full md:min-is-[160px] md:is-auto'>
                <InputLabel>Role</InputLabel>
                <Select
                  label='Role'
                  value={roleFilter}
                  onChange={e => handleRoleChange(e.target.value)}
                >
                  <MenuItem value='All'>All</MenuItem>
                  <MenuItem value='Administrator'>Administrator</MenuItem>
                  <MenuItem value='Employee'>Employee</MenuItem>
                </Select>
              </FormControl>
            </div>
            <Button
              variant='contained'
              startIcon={<i className='bx-plus' />}
              onClick={() => {
                setUserId('')
                setUserOpen(true)
              }}
              className='is-full md:is-auto'
            >
              Add New User
            </Button>
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
                        <>
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
                        </>
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
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
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
            fetchUsers(nextPage, pageSize, params.search, params.role)
          }}
          rowsPerPage={pageSize}
          onRowsPerPageChange={e => {
            const newPageSize = parseInt(e.target.value, 10)
            const params = getFilterParams()

            setPageSize(newPageSize)
            setPage(1)
            fetchUsers(1, newPageSize, params.search, params.role)
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Card>

      <UserDrawer
        open={userOpen}
        user={tableData?.find(user => user.id === userId)}
        handleClose={() => {
          setUserOpen(false)
          setUserId('')
        }}
      />
    </>
  )
}

export default UserListTable
