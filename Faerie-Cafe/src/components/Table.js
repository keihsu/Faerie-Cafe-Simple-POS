import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import API_URL from '../config/config';
import {SocketContext} from '../context/socket';
import TableOrders from './TableOrders';

const Table = (props) => {
  const socket = useContext(SocketContext);
  const [table, setTable] = useState({});
  const [show, setShow] = useState(false);
  const menu = useSelector((state) => state.menu);
  const [selectedItem, setSelectedItem] = useState( menu[0] && menu[0].itemName ? menu[0].itemName : '');
  const [selectedQty, setSelectedQty] = useState(1);
  const [notes, setNotes] = useState('');
  // const [orderTotal, setOrderTotal] = useState(0);
  const [orders, setOrders] = useState([]);

  const handleClose = () => {
      setShow(false);
      setSelectedItem(menu[0] && menu[0].itemName ? menu[0].itemName : '');
      setSelectedQty(1);
      setNotes('');
  }

  const handleShow = () => setShow(true);

  useEffect(() => {
    refreshTable();
    socket.on('TABLE_UPDATE', () => {
      refreshTable();
    })
    socket.on('ORDER_UPDATE', () => {
      axios.get(`${API_URL}/table/${props.tableId}/orders/`)
      .then((response) => {
        setOrders(response.data);
      })
      .catch((err) => {
        // alert(err);
        console.log(err);
      });
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])




  const calculateOrderTotal = () => {
    var total = 0;
    
    if (orders) {
      for (var i = 0; i < orders.length; i++) {
        total += menuPrice[orders[i].itemName] * orders[i].qty;
      }
    }
    //setOrderTotal(total);
    return total;
  }

  const refreshTable = () => {
    axios.get(API_URL + '/table/' + props.tableId)
        .then((response) => {
          setTable(response.data);
          setOrders(response.data.orders);
          // calculateOrderTotal();
      })
      .catch((err) => {
        // alert(err);
        console.log(err);
    })
  }

  const placeOrder = () => {
    axios.post(`${API_URL}/table/${props.tableId}/orders`,
      {
        itemName: selectedItem,
        notes: notes,
        qty: selectedQty,
      }
    )
    .then((response) => {
      socket.emit('ORDER_UPDATE', {
        tableId: props.tableId,
        message: 'Order successfully placed.'
      });
      refreshTable();
    });
  }

  const closeTable = (orderTotal, amountPaid) => {
    const tips = amountPaid - orderTotal;
    axios.patch(`${API_URL}/table/${props.tableId}`,
      {
          complete: true,
          server: table.server,
          orderTotal: orderTotal,
          tips: tips
      }
    )
    .then((response) => {
      return axios.patch(`${API_URL}/shift/${table.shiftId}`, {
        orderTotal: orderTotal,
        tips: tips
      });
    })
    .then((response) => {
      socket.emit('TABLE_LIST_UPDATE', {
        message: 'Table closed successfully'
      })
      refreshTable();
    })
    .catch((err) => {
      // alert(err);
      console.log(err);
    });
  }

  const menuList = menu.map((item) => 
    <option key={item._id} value={item.itemName}>{item.itemName}</option>
  )

  const menuPrice = {};
  menu.forEach((item) => {
    menuPrice[item.itemName] = item.price;
  })

  var numArr = [];
  for (var i = 1; i <= 99; i++) {
    numArr.push(i);
  }

  const qtyList = numArr.map((num) =>
    <option key={num} value={num}>{num}</option>
  )

  return (
    <div className="shadow p-3 my-2 mx-2 bg-body rounded container container">
      <div>
      <h3>{table.tableName}</h3>
      <p className="text-muted">Server: {table.server}</p>
      </div>
      <TableOrders key={props.tableId} tableId={props.tableId}/>
      
      <Button className="mx-1" variant="secondary" size="sm"
        onClick={() => {handleShow()}}>
        Add Order
      </Button>
      <Button className="mx-1" variant="primary" size="sm"
        onClick={() => {
          var orderTotal = calculateOrderTotal();
          var result = window.prompt(`Please enter the amount paid by the customer:\n\nOrder total: ${orderTotal.toLocaleString('en-US')} Gil`);
          if (result !== null) {
            const amountPaid = parseInt(result);
            if (amountPaid !== undefined && amountPaid >= orderTotal) {
              closeTable(orderTotal, amountPaid);
            } else {
              alert('Please enter a valid number greater than or equal to the order total.');
            }
          }
        }}>
        Checkout
      </Button>


      <Modal show={show} onHide={handleClose} animation={false} centered>
        <Modal.Header>
          <Modal.Title>Add Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group">
            <select className="form-select"
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}>
              {menuList}
            </select>
            <div className='col-sm-4'>
              <input className="form-control"
                placeholder='Notes'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    placeOrder();
                    handleClose();
                  }
                }}
                autoFocus
              />
            </div>
            <div className='col-sm-2'>
              <select className="form-select"
                onChange={(e) => setSelectedQty(e.target.value)}
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
          <Button variant="primary" onClick={() => {
            placeOrder();
            handleClose();
            // refreshTable();
            
          }}>
            Place Order
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Table;