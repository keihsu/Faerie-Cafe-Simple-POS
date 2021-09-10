import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import API_URL from '../config/config';
import {SocketContext} from '../context/socket';
import moment from 'moment';


const ShiftView = () => {
  const socket = useContext(SocketContext);
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    getShifts();
    socket.on('SHIFT_UPDATE', () => {
      getShifts();
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getShifts = () => {
    axios.get(API_URL + '/shift/')
    .then((response) => {
        setShifts(response.data);
        // calculateOrderTotal();
    })
    .catch((err) => {
      // alert(err);
      console.log(err);
    })
  }

  const shiftList = shifts.map((shift) =>
    <tr key={shift._id}>
      <td>{moment(shift.startTime).format('LLL')}</td>
      <td>{moment(shift.endTime).format('LLL')}</td>
      <td>{shift.totalSales.toLocaleString('en-US')}</td>
      <td>{shift.totalTips.toLocaleString('en-US')}</td>
    </tr>
  )
  return(
    <div>
      <div className="mt-5">
        {shiftList.length === 0 &&
          <h3 className="text-secondary">No shift history</h3>
        }
      </div>
      {shifts.length > 0 &&
        <table className="table">
          <thead>
            <tr>
              <th>Shift Start</th>
              <th>Shift End</th>
              <th>Total Sales</th>
              <th>Total Tips</th>
            </tr>
          </thead>
          <tbody>
            {shiftList}
          </tbody>
        </table>
      }
    </div>
  );
}

export default ShiftView;