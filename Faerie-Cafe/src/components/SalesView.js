import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import API_URL from '../config/config';
import {SocketContext} from '../context/socket';
import moment from 'moment';

const SalesView = () => {
  const socket = useContext(SocketContext);
  const [tables, updateTables] = useState([]);
  const [sortOrder] = useState('desc');
  const curShift = useSelector((state) => state.shift);
  const [shift, setShift] = useState({});

  useEffect(() => {
    refreshTables();
    getShift();
    socket.on('TABLE_LIST_UPDATE', () => {
      refreshTables();
      getShift();
    });
    socket.on('SHIFT_UPDATE', () => {
      updateTables([]);
      getShift();
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshTables = () => {
    axios.get(API_URL + '/tables', {
      params: {
        viewAll: true,
        order: sortOrder,
        shiftId: curShift ? curShift._id : 'nonexistent'
      },
    })
    .then((response) => {
      updateTables(response.data);
    })
    .catch((err) => {
      // alert(err);
      console.log(err);
    });
  }

  const getShift = () => {
    if (curShift) {
      axios.get(`${API_URL}/shift/${curShift._id}`)
      .then((response) => {
        setShift(response.data);
      })
      .catch((err) => {
        // alert(err);
        console.log(err);
      });
    }
  }
  
  const tableList = tables.map((table) => 
    <tr key={table._id}>
      <td>{moment(table.date).format('LLL')}</td>
      <td>{table.tableName}</td>
      <td>{table.server}</td>
      {table.orderTotal !== undefined &&
        <td>{table.orderTotal.toLocaleString('en-US')}</td>
      }
      {table.orderTotal === undefined &&
        <td>0</td>
      }
      {table.tips !== undefined &&
        <td>{table.tips.toLocaleString('en-US')}</td>
      }
      {table.tips === undefined &&
        <td>0</td>
      }
      {table.complete &&
        <td>
          <i className="fas fa-check text-success"></i>
        </td>
      }
      {!table.complete &&
        <td>
          <i className="fas fa-concierge-bell text-secondary"></i>
        </td>
      }
    </tr>
  )

  return (
    <div>
      <div className="mt-3">
        <div><b>Total Sales: </b>{shift.totalSales || 0} Gil</div>
        <div><b>Total Tips: </b>{shift.totalTips || 0} Gil</div>
      </div>
      <div className="mt-5">
        {tables.length === 0 &&
            <h3 className="text-secondary">No completed orders</h3>
        }
      </div>
      {tables.length > 0 &&
        <table className="table">
          <thead>
            <tr>
              <th>Sales Date</th>
              <th>Table Name</th>
              <th>Server</th>
              <th>Sale Total</th>
              <th>Tips</th>
              <th>Order Status</th>
            </tr>
          </thead>
          <tbody>
            {tableList}
          </tbody>
        </table>
      }
    </div>
  )
}

export default SalesView;