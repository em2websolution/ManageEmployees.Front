// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'Employees',
    href: '/employees',
    icon: 'bx-group'
  },
  {
    label: 'Tasks',
    href: '/tasks',
    icon: 'bx-task'
  }
]

export default horizontalMenuData
