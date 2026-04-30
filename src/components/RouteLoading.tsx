'use client'

import { useEffect, useRef, useState } from 'react'

import { usePathname } from 'next/navigation'

import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'

import { useAuth } from '@/hooks/useAuth'

const RouteLoading = () => {
  const pathname = usePathname()
  const auth = useAuth()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const prevPathname = useRef(pathname)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      setLoading(true)
      prevPathname.current = pathname

      const timer = setTimeout(() => setLoading(false), 500)

      return () => clearTimeout(timer)
    }
  }, [pathname])

  if (!mounted || (!loading && !auth.loading)) return null

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}>
      <LinearProgress />
    </Box>
  )
}

export default RouteLoading
