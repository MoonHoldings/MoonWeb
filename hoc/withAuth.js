import { useRouter } from 'next/router'
import React from 'react'
import { useSelector } from 'react-redux'

const publicUrls = ['/signup', '/login', '/']
const withAuth = (WrappedComponent) => {
  const WithAuth = (props) => {
    const { isLoggedIn } = useSelector((state) => state.auth)
    const router = useRouter()

    if (isLoggedIn) {
      if (publicUrls.includes(router.pathname)) {
        router.push('/dashboard')
      } else return <WrappedComponent {...props} />
    } else if (!isLoggedIn) {
      if (publicUrls.includes(router.pathname))
        return <WrappedComponent {...props} />
      else router.push('/login')
    }
  }

  return WithAuth
}

export default withAuth
