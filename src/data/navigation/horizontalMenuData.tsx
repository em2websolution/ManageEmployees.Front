// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'Home',
    href: '/home',
    icon: 'bx-home'
  },
  {
    label: 'Tasks',
    href: '/tasks',
    icon: 'bx-task'
  }
]

export default horizontalMenuData
