// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
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

export default horizontalMenuData
