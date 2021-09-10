const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
})

const OrderItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  qty: { type: Number, default: 1, min: [1, "Order quantity must be greater than 1"] },
  notes: { type: String, default: '' },
  complete: { type: Boolean, default: false}
});

const TableSchema = new mongoose.Schema({
  tableName: { type: String, required: true },
  orders: [OrderItemSchema],
  date: { type: Date, default: Date.now },
  complete: { type: Boolean, default: false},
  server: String,
  orderTotal: Number,
  tips: Number,
  shiftId: String,
});

const ShiftSchema = new mongoose.Schema({
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  totalSales: { type: Number, default: 0 },
  totalTips: { type: Number, default: 0 }
})

const MenuItemModel = mongoose.model('menu', MenuItemSchema);
const OrderItemModel = mongoose.model('orderItem', OrderItemSchema);
const TableModel = mongoose.model('table', TableSchema);
const ShiftModel = mongoose.model('shift', ShiftSchema);

module.exports = { MenuItemModel, OrderItemModel, TableModel, ShiftModel };