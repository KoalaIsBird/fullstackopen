import { configureStore, createSlice } from '@reduxjs/toolkit'

const notifSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    updateNotification: (state, action) => {
      return action.payload
    }
  }
})

const notificate = (message, type, duration) => (dispatch, getState) => {
  dispatch(updateNotification({ message, type }))
  setTimeout(() => {
    dispatch(updateNotification(null))
  }, duration)
}

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs: (state, action) => {
      return action.payload
    },
    addBlog: (state, action) => {
      state.push(action.payload)
    },
    removeBlog: (state, action) => {
      return state.filter(blog => blog.id !== action.payload)
    },
    likeBlog: (state, action) => {
      state.forEach(blog => {
        if (blog.id === action.payload) {
          blog.likes += 1
        }
      })
    },
    sortBlogsByLikes: state => {
      state.sort((b1, b2) => b2.likes - b1.likes)
    }
  }
})

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser: (state, action) => {
      return action.payload
    }
  }
})

export const { updateNotification } = notifSlice.actions
export const { setBlogs, addBlog, removeBlog, sortBlogsByLikes, likeBlog } =
  blogSlice.actions
export const { setUser } = userSlice.actions

export { notificate }

const store = configureStore({
  reducer: {
    notification: notifSlice.reducer,
    blogs: blogSlice.reducer,
    user: userSlice.reducer
  }
})

export default store
