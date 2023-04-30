import { Router } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { refreshAccessToken } from 'redux/reducers/authSlice'

const Redirect = (props) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (props.jid) {
      async function fetchData() {
        const res = await dispatch(refreshAccessToken())
        if (res) {
          window.opener.postMessage(res, '*')
        }
      }

      fetchData()
    }
    if (props.errorMessage) {
      window.opener.postMessage(
        { errorMessage: decodeURIComponent(props.errorMessage) },
        '*'
      )
    }
    if (props.successMessage) {
      window.opener.postMessage(
        { successMessage: decodeURIComponent(props.successMessage) },
        '*'
      )
    }
  }, [dispatch, props])

  return <a className="not-found-title-text">Redirecting ...</a>
}

export default Redirect

export const getServerSideProps = async (context) => {
  const cookieValue = context.req.headers.cookie
    ?.split('; ')
    .find((row) => row.startsWith('jid='))

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

  if (cookieValue) {
    const jid = cookieValue.split('=')[1]
    return {
      props: {
        jid,
      },
    }
  }
  return { props: { errorMessage, successMessage } }
}
