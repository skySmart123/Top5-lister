import React, {useState, useCallback, createContext} from 'react'

const NotificationContext = createContext()

// export const NotificationContext = createContext({
// // const NotificationContext = createContext({
//     // error: null,
//     // addError: () => {
//     // },
//     // removeError: () => {
//     // },
// })

function NotificationProvider({children}) {
    // const [error, setError] = useState(null)
    const [error, setError] = useState({
        message: '',
        status: 'error',
    })

    // const removeError = () => setError(null)
    const removeError = () => setError({
        message: '',
        status: 'error',
    })

    const addError = ({message, status}) => {
        status = status ? status : 'error'

        setError({message, status})
    }

    const contextValue = {
        error,
        addError: useCallback(({message, status}) => {
            addError({message, status})

            // console.log('useCallback, addError: ', {message, status})
        }, []),
        removeError: useCallback(() => removeError(), []),
    }

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
        </NotificationContext.Provider>
    )
}

export {
    NotificationContext,
    NotificationProvider
}