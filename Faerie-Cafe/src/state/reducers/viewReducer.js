const viewReducer = (state = 'home', action) => {
  switch (action.type) {
    case 'changeView':
      return action.payload;
    default:
      return state;
  }
}

export default viewReducer;