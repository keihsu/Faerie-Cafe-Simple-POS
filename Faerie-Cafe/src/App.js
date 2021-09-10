import React, { useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from './state/index';
import Menubar from './components/Menubar';
import HomeView from './components/HomeView';
import SalesView from './components/SalesView';
import MenuView from './components/MenuView';
import HistoryView from './components/HistoryView';
import ShiftView from './components/ShiftView';
import axios from 'axios';
import API_URL from './config/config';

import {SocketContext, socket} from './context/socket';

const App = () => {
  const dispatch = useDispatch();
  const view = useSelector((state) => state.view);
  const shift = useSelector((state) => state.shift);
  const username = useSelector((state) => state.username);
  // const menu = useSelector((state) => state.menu);
  // const tables = useSelector((state) => state.tables);
  const { updateShift, updateTables, updateMenu, updateUsername } = bindActionCreators(actionCreators, dispatch);

  const getTables = () => {
    axios.get(API_URL + '/tables', {
      params: {
        order: 'desc',
        select: '_id',
        distinct: true,
      }
    })
    .then((response) => {
      updateTables(response.data);
    })
    .catch((err) => {
      // alert(err);
      console.log(err);
    });
  }

  const getMenu = () => {
    axios.get(API_URL + '/menu')
    .then((response) => {
      updateMenu(response.data);
    })
    .catch((err) => {
      console.log(err)
    });
  }

  const getShift = () => {
    axios.get(API_URL + '/shift', {
      startTime: 'desc',
    })
    .then((response) => {
      if (response.data[0] && !response.data[0].endTime) {
        updateShift(response.data[0]);
      } else {
        updateShift(null);
      }
    })
  }

  const promptUsername = () => {
    while(!window.localStorage.getItem('username')){
      let username;
      do {
        username = window.prompt('Please enter a username:');
      } while (!username);
      window.localStorage.setItem('username', username);
    }
    const username = window.localStorage.getItem('username');
    updateUsername(username);
  }


  useEffect(() => {
    promptUsername();
    getTables();
    getMenu();
    getShift();
    socket.on('TABLE_LIST_UPDATE', () => {
      getTables();
    });
    socket.on('MENU_UPDATE', () => {
      getMenu();
    })
    socket.on('SHIFT_UPDATE', () => {
      getShift();
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <SocketContext.Provider value={socket}>
      <div className="App">
        <Menubar/>
        {view === 'home' && <HomeView/>}
        {view === 'menu' && <MenuView/>}
        {view === 'sales' && <SalesView/>}
        {view === 'shift' && <ShiftView/>}
        {view === 'history' && <HistoryView/>}
      </div>
    </SocketContext.Provider>
  );
}

export default App;
