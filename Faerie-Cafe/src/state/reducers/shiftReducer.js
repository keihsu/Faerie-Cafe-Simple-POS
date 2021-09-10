const shiftReducer = (state = null, action) => {
  switch (action.type) {
    case 'updateShift':
      return action.payload;
    default:
      return state;
  }
}

export default shiftReducer;