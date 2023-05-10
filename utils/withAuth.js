import React from 'react'

export function withAuthRedirect(Component) {
  return function WithAuthRedirect(props) {
    return <Component {...props} />
  }
}

const publicUrls = ['/signup', '/login']

export const getServerSidePropsWithAuth = async (context) => {
  const cookieValue = context.req.headers.cookie
    ?.split('; ')
    .find((row) => row.startsWith('aid='))

  //getting error Message
  const eMessage = context.req.headers.cookie
    ?.split('; ')
    .find((row) => row.startsWith('error='))
  const errorMessage = eMessage ? eMessage.split('=')[1] : null

  //getting success Messages
  const message = context.req.headers.cookie
    ?.split('; ')
    .find((row) => row.startsWith('message='))
  const successMessage = message ? message.split('=')[1] : null

  //getting success Messages
  const email = context.req.headers.cookie
    ?.split('; ')
    .find((row) => row.startsWith('email='))
  const userEmail = email ? email.split('=')[1] : null

  if (cookieValue) {
    const aid = cookieValue.split('=')[1]
    if (publicUrls.includes(context.resolvedUrl) && aid)
      return {
        redirect: {
          destination: '/nfts',
          permanent: false,
        },
      }
    else {
      return { props: { isLoggedIn: true } }
    }
  } else {
    if (publicUrls.includes(context.resolvedUrl) || context.resolvedUrl == '/')
      return { props: { errorMessage, successMessage, userEmail } }
    else {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      }
    }
  }
}
