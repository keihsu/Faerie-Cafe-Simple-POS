import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import API_URL from '../config/config';
import {SocketContext} from '../context/socket';

// Props: tableId, tableOrders
const TableOrders = (props) => {
  const socket = useContext(SocketContext);
  const menu = useSelector((state) => state.menu);
  const [orderId, setOrderId] = useState('');
  const [orders, setOrders] = useState([]);
  const [show, setShow] = useState(false);
  const [itemName, setItemName] = useState('');
  const [qty, setQty] = useState('');
  const [notes, setNotes] = useState('');
  const [complete, setComplete] = useState(false);

  const handleClose = () => {
    setShow(false);
    setOrderId('');
    setItemName('');
    setQty('');
    setNotes('');
    setComplete(false);
  }

  const handleShow = (order) => {
    setOrderId(order._id);
    setItemName(order.itemName);
    setQty(order.qty);
    setNotes(order.notes);
    setComplete(order.complete);
    setShow(true);
  }

  useEffect(() => {
    getOrders();
    socket.on('ORDER_UPDATE', (data) => {
      if (data.tableId === props.tableId) {
        getOrders();
      }
    })
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getOrders = () => {
    axios.get(`${API_URL}/table/${props.tableId}/orders/`)
    .then((response) => {
      setOrders(response.data);
    })
    .catch((err) => {
      // alert(err);
      console.log(err);
    });
  }

  const updateOrder = () => {
    axios.patch(`${API_URL}/table/${props.tableId}/orders/${orderId}`, {
      itemName: itemName,
      qty: qty,
      notes: notes,
    })
    .then((response) => {
      socket.emit('ORDER_UPDATE', {
        tableId: props.tableId,
        message: 'Order successfully updated.'
      });
      // getOrders();
    })
    .catch((err) => {
      // alert(err);
      console.log(err);
    });
  }

  const removeOrder = () => {
    axios.delete(`${API_URL}/table/${props.tableId}/orders/${orderId}`)
    .then((response) => {
      socket.emit('ORDER_UPDATE', {
        tableId: props.tableId,
        message: 'Order successfully removed.'
      });
      // getOrders();
    })
    .catch((err) => {
      // alert(err);
      console.log(err);
    });
  }

  const completeOrder = (id) => {
    let resolveId;
    if(id !== undefined) {
      resolveId = id;
    } else {
      resolveId = orderId;
    }
    axios.patch(`${API_URL}/table/${props.tableId}/orders/${resolveId}`, {
      complete: true
    })
    .then((response) => {
      socket.emit('ORDER_UPDATE', {
        tableId: props.tableId,
        message: 'Order complete.'
      });
      // getOrders();
    })
    .catch((err) => {
      // alert(err);
      console.log(err);
    });
  }
  const uncompleteOrder = (id) => {
    let resolveId;
    if(id !== undefined) {
      resolveId = id;
    } else {
      resolveId = orderId;
    }
    axios.patch(`${API_URL}/table/${props.tableId}/orders/${resolveId}`, {
      complete: false
    })
    .then((response) => {
      socket.emit('ORDER_UPDATE', {
        tableId: props.tableId,
        message: 'Order reverted to active.'
      });
      // getOrders();
    })
    .catch((err) => {
      // alert(err);
      console.log(err);
    });
  }

  const calculateOrderTotal = () => {
    var total = 0;
    
    if (orders) {
      for (var i = 0; i < orders.length; i++) {
        total += menuPrice[orders[i].itemName] * orders[i].qty;
      }
    }
    return total;
  }

  const menuPrice = {};
    menu.forEach((item) => {
    menuPrice[item.itemName] = item.price;
  })

  const orderList = orders.map((order) => 
    <tr key={order._id}>
      <td>{order.itemName}</td>
      <td>{order.qty}</td>
      <td>{order.notes}</td>
      {order.complete &&
        <td>
          <i className="fas fa-check text-success"
            onClick={() => {
              uncompleteOrder(order._id);
            }}
          ></i>
        </td>
      }
      {!order.complete &&
        <td>
          <i className="fas fa-concierge-bell text-secondary"
            onClick={() => {
              completeOrder(order._id);
            }}
          ></i>
        </td>
      }
      <td>
        <i className="fas fa-edit text-secondary"
          onClick={() => handleShow(order)}
        ></i>
      </td>
    </tr>
  )

  const menuList = menu.map((item) => 
    <option key={item._id} value={item.itemName}>{item.itemName}</option>
  )

  var numArr = [];
  for (var i = 1; i <= 99; i++) {
    numArr.push(i);
  }
  const qtyList = numArr.map((num) =>
    <option key={num} value={num}>{num}</option>
  )
  
  return (
    <div>
      {orders.length > 0 &&
        <table className="table table-borderless">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Notes</th>
              <th>Status</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {orderList}
          </tbody>
        </table>
      }
      <div className="mb-3">
        <b>Order Total: </b>{calculateOrderTotal().toLocaleString('en-US')}
      </div>

      <Modal show={show} onHide={handleClose} animation={false} centered>
        <Modal.Header>
          <Modal.Title>Edit Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group">
            <select className="form-select"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}>
              {menuList}
            </select>
            <div className='col-sm-4'>
              <input className="form-control"
                placeholder='Notes'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    updateOrder();
                    handleClose();
                  }
                }}
                autoFocus
              />
            </div>
            <div className='col-sm-2'>
              <select className="form-select"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              >
                {qtyList}
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary"
            onClick={handleClose}
          >
            Close
          </Button>
          { complete &&
            <Button variant="secondary"
            onClick={() => {
              setComplete(false);
              uncompleteOrder();
              handleClose();
            }}
            >
              Set Active
            </Button>
          }
          { !complete &&
            <Button variant="success"
            onClick={() => {
              setComplete(true);
              completeOrder();
              handleClose();
            }}
            >
              Complete
            </Button>
          }
          <Button variant="danger"
            onClick={() => {
              removeOrder();
              handleClose();
            }}
          >
            Remove
          </Button>
          <Button variant="primary" onClick={() => {
            updateOrder();
            handleClose();
            // refreshTable();
            
          }}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TableOrders;