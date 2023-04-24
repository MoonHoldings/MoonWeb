import React from 'react'

export function withAuthRedirect(Component) {
  return function WithAuthRedirect(props) {
    return <Component {...props} />
  }
}

// export const getServerSidePropsWithAuth = async (context) => {
// const session = await getSession(context)

// if (session) {
//   if (context.resolvedUrl == '/signup' || context.resolvedUrl == '/login')
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     }
//   else {
//     return { props: {} }
//   }
// } else {
//   if (context.resolvedUrl == '/signup' || context.resolvedUrl == '/login')
//     return { props: {} }
//   else {
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     }
//   }
// }
// }
