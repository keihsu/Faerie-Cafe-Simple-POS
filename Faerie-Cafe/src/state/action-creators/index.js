export const changeView = (view) => {
  return (dispatch) => {
    dispatch({
      type: 'changeView',
      payload: view
    });
  }
}

export const updateTables = (tables) => {
  return (dispatch) => {
    dispatch({
      type: 'updateTables',
      payload: tables
    });
  }
}

export const updateMenu = (menu) => {
  return (dispatch) => {
    dispatch({
      type: 'updateMenu',
      payload: menu
    })
  }
}

export const updateShift = (shift) => {
  return (dispatch) => {
    dispatch({
      type: 'updateShift',
      payload: shift
    })
  }
}

export const updateUsername = (username) => {
  return (dispatch) => {
    dispatch({
      type: 'updateUsername',
      payload: username
    })
  }
}