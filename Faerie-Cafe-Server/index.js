require('dotenv').config();
const express = require('express');
const Database = require('./database/database');
var cors = require('cors');
var router = require('./routes.js');

const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
  }
});
//const io = new Server(server);

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

app.options('/', cors());
app.options('/table', cors());


// app.listen(3000, () => {
//   console.log('server started');
// });

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('TABLE_LIST_UPDATE', (data) => {
    // socket.broadcast.emit('TABLE_LIST_UPDATE', data);
    io.emit('TABLE_LIST_UPDATE', data);
  })
  socket.on('MENU_UPDATE', (data) => {
    // socket.broadcast.emit('MENU_UPDATE', data);
    io.emit('MENU_UPDATE', data);
  })
  socket.on('ORDER_UPDATE', (data) => {
    // socket.broadcast.emit('ORDER_UPDATE', data);
    io.emit('ORDER_UPDATE', data);
  })
  socket.on('SHIFT_UPDATE', (data) => {
    io.emit('SHIFT_UPDATE', (data));
  })
});



server.listen(process.env.SERVER_PORT, () => {
  console.log(`listening on *:${process.env.SERVER_PORT}`);
  Database.then(() => console.log('Connected to MongoDB.')).catch((err) =>
    console.log(err),
  );
});