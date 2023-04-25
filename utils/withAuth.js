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

  if (cookieValue) {
    const aid = cookieValue.split('=')[1]
    if (publicUrls.includes(context.resolvedUrl) && aid)
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    else {
      return { props: { isLoggedIn: true } }
    }
  } else {
    if (publicUrls.includes(context.resolvedUrl) || context.resolvedUrl == '/')
      return { props: {} }
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
