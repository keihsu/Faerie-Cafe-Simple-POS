const menuReducer = (state = [], action) => {
  switch (action.type) {
    case 'updateMenu':
      return action.payload;
    default:
      return state;
  }
}

export default menuReducer;