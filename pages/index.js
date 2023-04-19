import React from 'react'
import WelcomePage from 'components/home/WelcomePage'
import { signOut } from 'next-auth/react'

const index = () => {
  // signOut()
  return (
    <div className="z-90 relative">
      <WelcomePage />
    </div>
  )
}

export default index
