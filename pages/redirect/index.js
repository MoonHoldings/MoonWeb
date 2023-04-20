import { Router } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { refreshAccessToken } from 'redux/reducers/authSlice'

const Redirect = (props) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (props.cookieValue) {
      async function fetchData() {
        const res = await dispatch(refreshAccessToken())
        if (res) {
          window.close()
        }
      }

      fetchData()
    }
  }, [dispatch, props.cookieValue])

  return <a className="not-found-title-text">Redirecting ...</a>
}

export default Redirect

export const getServerSideProps = async (context) => {
  const cookieValue = context.req.headers.cookie
    ?.split('; ')
    .find((row) => row.startsWith('jid='))
    .split('=')[1]

  return {
    props: {
      cookieValue,
    },
  }
}
