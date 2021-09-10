import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { changeView } from '../state/action-creators/index';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../state/index';
import axios from 'axios';
import API_URL from '../config/config';
import {SocketContext} from '../context/socket';

const Menubar = () => {
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const { updateTables, changeView, addTable, updateShift, updateUsername } = bindActionCreators(actionCreators, dispatch);
  const tables = useSelector((state) => state.tables);
  const shift = useSelector((state) => state.shift);
  const username = useSelector((state) => state.username);

  const clearAllSales = () => {
    let response = window.confirm('Warning: This will delete all shifts and sales history.\nThis action cannot be undone.\nAre you sure you want to proceed?');
    if (response) {
      axios.delete(API_URL + '/tables')
      .then((response) => {
        updateTables([]);
        return axios.delete(API_URL + '/shift');
      })
      .then((response) => {
        updateShift(null);
        socket.emit('TABLE_LIST_UPDATE', {
          message: 'Tables cleared..'
        });
        socket.emit('SHIFT_UPDATE', {
          message: 'Shifts cleared.'
        });
      })
      .catch((err) => {
        // alert(err);
        console.log(err);
      });
    }
  }
  
  const startShift = () => {
    if (shift === null) {
      axios.post(API_URL + '/shift')
      .then((response) => {
        updateShift(response.data);
        socket.emit('SHIFT_UPDATE', {
          message: 'Shift started.'
        })
      })
    } else {
      window.alert('There is already an active shift.\nEnd the current shift before starting a new one.');
    }
  }

  const endShift = () => {
    if (tables.length > 0) {
      window.alert('Please close out all tables before ending the shift.');
    } else if (shift === null) {
      window.alert('There is no active shift to end.');
    } else {
      axios.patch(`${API_URL}/shift/${shift._id}`, {
        end: true
      })
      .then((response) => {
        updateShift(null);
        socket.emit('SHIFT_UPDATE', {
          message: 'Shift ended.'
        })
      })
    }
  }


  const promptUsername = () => {

    let username = window.prompt('Please enter a new username:');
    if (username === null) {
      return;
    }
    if (username) {
      window.localStorage.setItem('username', username);
      updateUsername(username);
    } else {
      
    }
  }

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand role="button" onClick={() => changeView('home')}>
          <img
            alt=""
            src="/logo.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          Faerie Café</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => changeView('home')}>Home</Nav.Link>
            <Nav.Link onClick={() => changeView('sales')}>View Sales</Nav.Link>
            <NavDropdown title="Shift" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={() => {
                startShift();
              }}>Start Shift</NavDropdown.Item>
              <NavDropdown.Item onClick={() => {
                endShift();
              }}>End Shift</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Admin" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={() => {
                changeView('shift');
              }}>Shift History</NavDropdown.Item>
              <NavDropdown.Item onClick={() => {
                changeView('history');
              }}>Sales History</NavDropdown.Item>
              <NavDropdown.Item onClick={() => {
                if(!shift) {
                  changeView('menu');
                } else {
                  window.alert('You cannot edit the menu during a shift.\nPlease end the shift before attempting to make changes to the menu.');
                }
              }}
              disabled={shift !== null}
              >Edit Menu</NavDropdown.Item>
              <NavDropdown.Item onClick={() => {
                clearAllSales();
              }}>Reset All Sales</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a role="button" onClick={promptUsername}><u>{username}</u></a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Menubar;