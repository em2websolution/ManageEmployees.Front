// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
  {
    label: 'Home',
    href: '/home',
    icon: 'bx-home'
  },
  {
    label: 'Cadastro',
    href: '/about',
    icon: 'bx-info-circle'
  }
]

export default verticalMenuData
