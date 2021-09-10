const usernameReducer = (state = '', action) => {
  switch (action.type) {
    case 'updateUsername':
      return action.payload;
    default:
      return state;
  }
}

export default usernameReducer;