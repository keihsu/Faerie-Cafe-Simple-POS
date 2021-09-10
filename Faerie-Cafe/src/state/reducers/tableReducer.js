const tableReducer = (state = [], action) => {
  switch (action.type) {
    case 'updateTables':
      return action.payload;
    default:
      return state;
  }
}

export default tableReducer;