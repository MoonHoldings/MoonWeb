import { useEffect } from 'react'
import { useRouter } from 'next/router'

const NotFoundPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/')
  }, [router])

  return (
    <div>
      <h1>404 - Page Not Found</h1>
    </div>
  )
}

export default NotFoundPage
