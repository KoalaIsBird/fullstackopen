export const changeFilter = (filter) => {
  return {
    type: 'CHANGE_FILTER',
    payload: { filter },
  }
}


const filterReducer = (state = '', action) => {
  switch (action.type) {
    case 'CHANGE_FILTER':
      return action.payload.filter
    default:
      return state
  }
}

export default filterReducer
