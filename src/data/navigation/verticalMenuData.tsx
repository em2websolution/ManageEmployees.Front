// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
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

export default verticalMenuData
