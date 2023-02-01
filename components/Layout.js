import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
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
    <>
      {innerWidth < 600 &&
      (router.pathname === '/login' || router.pathname === '/signup') ? (
        ''
      ) : (
        <Navbar />
      )}
      <div>{children}</div>
    </>
  )
}

export default Layout
