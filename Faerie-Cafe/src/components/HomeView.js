import React, { useState, useEffect, useContext } from 'react';
import { InputGroup, Button, FormControl } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../state/index';
import axios from 'axios';
import Table from './Table'
import API_URL from '../config/config';
import {SocketContext} from '../context/socket';

const HomeView = () => {
  const socket = useContext(SocketContext);
  const [tableName, setTableName] = useState('');
  const [sortOrder] = useState('desc');
  const tables = useSelector((state) => state.tables);
  const shift = useSelector((state) => state.shift);
  const username = useSelector((state) => state.username);
  const dispatch = useDispatch();
  const { updateTables } = bindActionCreators(actionCreators, dispatch);


  useEffect(() => {
    // socket.on('TABLE_LIST_UPDATE', () => {
    //   console.log('updating tables');
    //   updateTableList();
    // })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addNewTable = () => {
    if (!tableName) {
      alert('Please enter a table name.');
    } else if (!shift) {
      alert('Please start the shift before creating a table.')
    } else {
      setTableName('');
      axios.post(API_URL + '/table', {
        tableName: tableName,
        shiftId: shift._id,
        server: username
      })
      .then((response) => {
        socket.emit('TABLE_LIST_UPDATE', {message: 'Table successfully added.'});
        updateTableList();
      })
      .catch((err) => {
        // alert(err);
        console.log(err);
      });
    }
  }

  const updateTableList = () => {
    axios.get(API_URL + '/tables', {
      params: {
        select: '_id',
        distinct: true,
        shift: shift ? shift._id : ''
      },
      sort: {
        date: sortOrder
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

  const tableList = tables.map((table) => 
      <Table key={table} tableId={table}/>
  );

  return (
    <div className="container mt-3">
      <div className="container">
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Table Name"
            aria-label="Table Name"
            aria-describedby="basic-addon2"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addNewTable();
              }
            }}
            disabled={shift === null}
          />
          <Button
            variant="outline-secondary"
            id="button-addon2"
            onClick={() => addNewTable()}
            disabled={shift === null}
          >
            New Table
          </Button>
        </InputGroup>
        <div className="mt-5">
          {shift === null &&
            <h3 className="text-secondary">Start a shift to begin taking orders</h3>
          }
        </div>
      </div>
      <div className="container d-flex flex-row flex-wrap justify-content-around">
        {tableList}
      </div>
    </div>
  )
}

export default HomeView;