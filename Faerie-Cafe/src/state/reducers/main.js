import { combineReducers } from 'redux';
import viewReducer from './viewReducer';
import tableReducer from './tableReducer';
import menuReducer from './menuReducer.js';
import shiftReducer from './shiftReducer.js';
import usernameReducer from './usernameReducer.js';

const rootReducer = combineReducers({
  view: viewReducer,
  tables: tableReducer,
  menu: menuReducer,
  shift: shiftReducer,
  username: usernameReducer,
});

export default rootReducer;