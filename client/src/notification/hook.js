import {useContext} from 'react'
import {NotificationContext} from './provider'

function useNotification() {
    const {error, addError, removeError} = useContext(NotificationContext)
    return {error, addError, removeError}
}

export default useNotification