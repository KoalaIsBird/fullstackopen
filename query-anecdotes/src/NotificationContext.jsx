import { createContext, useContext, useReducer } from 'react'

const notifReducer = (state, action) => {
  switch (action.type) {
    case 'NEW':
      return `new anecdote ${action.payload} was added`
    case 'VOTE':
      return `you voted for anecdote ${action.payload}`
    case 'ANY':
      return action.payload
    case 'REMOVE':
      return null
  }
}

export const NotificationContext = createContext()

const NotificationProvider = (props) => {
  const [message, dispatch] = useReducer(notifReducer, null)

  return (
    <NotificationContext.Provider value={[message, dispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  return context[0]
}

export const useNotificationDispatch = () => {
  const context = useContext(NotificationContext)
  return context[1]
}

export const notificate = (dispatch, text, type, duration = 5) => {
  dispatch({type: type, payload: text})
  setTimeout(() => dispatch({type: 'REMOVE'}), duration * 1000)
}

export default NotificationProvider
