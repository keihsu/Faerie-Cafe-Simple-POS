import React, { useState, useEffect, useContext } from 'react';
import { InputGroup, Button, FormControl } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../state/index';
import API_URL from '../config/config';
import {SocketContext} from '../context/socket';
import axios from 'axios';

const MenuView = () => {
  const socket = useContext(SocketContext);
  // const [menu, setMenu] = useState([]);
  const [menuItemName, setMenuItemName] = useState('');
  const [menuItemPrice, setMenuItemPrice] = useState('');
  const menu = useSelector((state) => state.menu);

  const dispatch = useDispatch();
  const { updateMenu } = bindActionCreators(actionCreators, dispatch);

  useEffect(() => {
    // retrieveMenu();
    // socket.on('MENU_UPDATE', () => {
    //   retrieveMenu();
    // })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addNewMenuItem = () => {
    let price = parseInt(menuItemPrice);
    if (!menuItemName || !(price && price > 0)) {
      alert('Please enter an item name and a sales price greater than 0.');
    } else {
      axios.post(API_URL + '/menu', {
        itemName: menuItemName,
        price: price
      })
      .then((response) => {
        setMenuItemName('');
        setMenuItemPrice('');
        socket.emit('MENU_UPDATE', {message: 'Menu item successfully added.'});
        retrieveMenu();
      })
      .catch((err) => {
        alert('Menu item already exists.');
      })
    }
  }

  const updateMenuItem = (itemName, price) => {
    axios.patch(API_URL + '/menu', {
      itemName: itemName,
      price: price
    })
    .then((response) => {
      socket.emit('MENU_UPDATE', {message: 'Menu item successfully updated.'});
      retrieveMenu()
    })
    .catch((err) => {
      // alert(err);
      console.log(err);
    })
  }

  const removeMenuItem = (itemName) => {
    axios.delete(API_URL + '/menu', {
      data: {
        itemName: itemName
      }
    })
    .then((response) => {
      socket.emit('MENU_UPDATE', {message: 'Menu item successfully removed.'});
      retrieveMenu();
    })
    .catch((err) => {
      // alert(err);
      console.log(err);
    })
  }

  const retrieveMenu = () => {
    axios.get(API_URL + '/menu')
    .then((response) => {
      updateMenu(response.data);
    })
    .catch((err) => {
      // alert(err);
      console.log(err);
    });
  }

  const menuList = menu.map((menuItem) =>
    <tr key={menuItem.itemName}>
      <td>
        <i className="fas fa-times text-danger"
          onClick={() => {
            let response = window.confirm(`Remove ${menuItem.itemName} from the menu?`);
            if (response) {
              removeMenuItem(menuItem.itemName);
            }
          }}
        ></i>
      </td>
      <td>{menuItem.itemName}</td>
      <td>
        <span className="mr-2">{menuItem.price.toLocaleString('en-US')}</span>
      </td>
      <td>
        <i className="fas fa-edit text-secondary"
            onClick={() => {
              let response = window.prompt(`Enter a new price for ${menuItem.itemName}:`);
              if (response != null) {
                if (parseInt(response) !== NaN && parseInt(response) >= 0) {
                  updateMenuItem(menuItem.itemName, response);
                } else {
                  alert('Please enter a numeric value greater than or equal to 0.')
                }
              }
            }}
          ></i>
        </td>
    </tr>
  );

  return (
    <div>
      <div className="mt-3">
        <InputGroup className="mb-3">
          {/*<InputGroup.Text>Item Name</InputGroup.Text>*/}
          <FormControl
            aria-label="Item Name"
            placeholder = 'Item Name'
            value={menuItemName}
            onChange={(e) => setMenuItemName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addNewMenuItem();
              }
            }}
          />
          {/*<InputGroup.Text>Sales Price</InputGroup.Text>*/}
          <FormControl
            aria-label="Sales Price"
            placeholder = 'Sales Price'
            value={menuItemPrice}
            onChange={(e) => setMenuItemPrice(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addNewMenuItem();
              }
            }}
          />
          <Button
            variant="outline-secondary"
            id="button-addon2"
            onClick={() => addNewMenuItem()}
          >
            Add Menu Item
          </Button>
        </InputGroup>
      </div>
      <div>
        <div className="mt-5">
          {menu.length === 0 &&
            <h3 className="text-secondary">Start a shift to begin taking orders</h3>
          }
        </div>
        {menu.length > 0 &&
          <table className="table">
            <thead>
              <tr>
                <th>Remove</th>
                <th>Item Name</th>
                <th>Sales Price</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {menuList}
            </tbody>
          </table>
        }
      </div>
    </div>
  )
}

export default MenuView;