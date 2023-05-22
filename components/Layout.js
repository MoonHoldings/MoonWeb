import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ContextProvider } from '../contexts/ContextProvider'
import Navbar from './Navbar'

const Layout = ({ children }) => {
  const router = useRouter()
  const [innerWidth, setInnerWidth] = useState(0)

  useEffect(() => {
    setInnerWidth(window.innerWidth)
    window.addEventListener('resize', windowResize)
  }, [])

  const windowResize = () => {
    setInnerWidth(window.innerWidth)
  }

  return (
    <ContextProvider>
      {router.pathname === '/login' ||
      router.pathname === '/signup' ||
      router.pathname === '/' ? (
        ''
      ) : (
        <Navbar />
      )}
      <div>{children}</div>
    </ContextProvider>
  )
}

export default Layout
