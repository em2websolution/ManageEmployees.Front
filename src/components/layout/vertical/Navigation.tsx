'use client'

// React Imports
import { useEffect, useRef } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import { styled, useColorScheme, useTheme } from '@mui/material/styles'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import VerticalNav, { NavHeader, NavCollapseIcons } from '@menu/vertical-menu'
import VerticalMenu from './VerticalMenu'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

// Style Imports
import navigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'

type Props = {
  mode: Mode
}

const StyledBoxForShadow = styled('div')(({ theme }) => ({
  top: 72,
  zIndex: 2,
  opacity: 0,
  position: 'absolute',
  pointerEvents: 'none',
  width: '100%',
  height: theme.mixins.toolbar.minHeight,
  transition: 'opacity .15s ease-in-out',
  background: `linear-gradient(var(--mui-palette-background-paper) ${
    theme.direction === 'rtl' ? '95%' : '5%'
  }, rgb(var(--mui-palette-background-paperChannel) / 0.85) 30%, rgb(var(--mui-palette-background-paperChannel) / 0.5) 65%, rgb(var(--mui-palette-background-paperChannel) / 0.3) 75%, transparent)`,
  '&.scrolled': {
    opacity: 1
  }
}))

const MenuToggle = (
  <div className='icon-wrapper'>
    <i className='bx-bxs-chevron-left' />
  </div>
)

const Navigation = (props: Props) => {
  // Props
  const { mode } = props

  // Hooks
  const verticalNavOptions = useVerticalNav()
  const { updateSettings, settings } = useSettings()
  const { mode: muiMode, systemMode: muiSystemMode } = useColorScheme()
  const theme = useTheme()

  // Refs
  const shadowRef = useRef(null)

  // Vars
  const { isCollapsed, isHovered, collapseVerticalNav, isBreakpointReached } = verticalNavOptions
  const isSemiDark = settings.semiDark

  const currentMode = muiMode === 'system' ? muiSystemMode : muiMode || mode

  const isDark = currentMode === 'dark'

  const scrollMenu = (container: any, isPerfectScrollbar: boolean) => {
    container = isBreakpointReached || !isPerfectScrollbar ? container.target : container

    if (shadowRef && container.scrollTop > 0) {
      // @ts-ignore
      if (!shadowRef.current.classList.contains('scrolled')) {
        // @ts-ignore
        shadowRef.current.classList.add('scrolled')
      }
    } else {
      // @ts-ignore
      shadowRef.current.classList.remove('scrolled')
    }
  }

  useEffect(() => {
    if (settings.layout === 'collapsed') {
      collapseVerticalNav(true)
    } else {
      collapseVerticalNav(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.layout])

  return (
    // eslint-disable-next-line lines-around-comment
    // Sidebar Vertical Menu
    <VerticalNav
      customStyles={navigationCustomStyles(verticalNavOptions, theme, settings)}
      collapsedWidth={85}
      backgroundColor='var(--mui-palette-background-paper)'
      // eslint-disable-next-line lines-around-comment
      // The following condition adds the data-dark attribute to the VerticalNav component
      // when semiDark is enabled and the mode or systemMode is light
      {...(isSemiDark &&
        !isDark && {
          'data-dark': ''
        })}
    >
      {/* Nav Header including Logo & nav toggle icons  */}
      <NavHeader>
        <div className='flex items-center justify-start'>
          <Link href='/'>
            <Logo showText={false} size={50} />
          </Link>
        </div>
        {!(isCollapsed && !isHovered) && (
          <NavCollapseIcons
            lockedIcon={MenuToggle}
            unlockedIcon={MenuToggle}
            closeIcon={MenuToggle}
            onClick={() => updateSettings({ layout: !isCollapsed ? 'collapsed' : 'vertical' })}
          />
        )}
      </NavHeader>
      <StyledBoxForShadow ref={shadowRef} />
      <VerticalMenu scrollMenu={scrollMenu} />
    </VerticalNav>
  )
}

export default Navigation
