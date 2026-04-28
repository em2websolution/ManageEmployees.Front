// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
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

export default verticalMenuData
