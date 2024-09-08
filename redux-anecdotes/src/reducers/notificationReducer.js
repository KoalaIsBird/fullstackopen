import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    putNotification(state, action) {
      return action.payload
    },
    deleteNotification() {
      return ''
    }
  }
})

const {putNotification, deleteNotification} = notificationSlice.actions

export const setNotification = (text, duration) => {
  return async dispatch => {
    dispatch(putNotification(text))
    setTimeout(() => {
      dispatch(deleteNotification())
    }, duration * 1000)
  }
}

export default notificationSlice.reducer
