import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useModalTimeout = ({ modalStatus, setModalState, timeout }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (modalStatus) {
      setTimeout(() => {
        dispatch(setModalState(false))
      }, timeout)
    }
  }, [modalStatus, dispatch, setModalState, timeout])

  return null
}

export default useModalTimeout
