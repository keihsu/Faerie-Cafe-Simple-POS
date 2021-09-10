const { TableModel } = require('../database/models')

module.exports = {
  get: async (req, res) => {
    try {
      if (req.params.tableId) {
        const table = await TableModel.findOne({ _id: req.params.tableId }).exec();
        if (table) {
          res.status(200).json(table.orders);
        } else {
          res.status(400).send('Table not found.');
        }
      } else {
        res.status(400).send('tableId not defined.');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  post: async (req, res) => {
    try {
      if (req.params.tableId && req.body.itemName) {
        let qty = req.body.qty ? req.body.qty : 1;
        let notes = req.body.notes ? req.body.notes : '';

        const table = await TableModel.findOne({ _id: req.params.tableId }).exec();
        if (table) {
          table.orders.push({itemName: req.body.itemName, qty: qty, notes: notes});
          await table.save();
          res.sendStatus(200);
        } else {
          res.status(400).send('Table not found.');
        }
      } else {
        res.status(400).send('tableId not defined or item not defined.');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  patch: async (req, res) => {
    try {
      if (req.params.tableId && req.params.orderId) {
        const table = await TableModel.findOne({ _id: req.params.tableId }).exec();
        if (table) {
          let order = table.orders.id(req.params.orderId);
          if (order) {
            order.itemName = req.body.itemName ? req.body.itemName : order.itemName;
            order.qty = req.body.qty ? req.body.qty : order.qty;
            order.notes = req.body.notes ? req.body.notes : order.notes;
            if (req.body.complete !== undefined) {
              order.complete = req.body.complete;
            }
            console.log(order);
            await table.save();
          }
          res.sendStatus(200);
        } else {
          res.status(400).send('Table not found.');
        }
      } else {
        res.status(400).send('tableId not defined or orderId not defined.');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  delete: async (req, res) => {
    try {
      if (req.params.tableId && req.params.orderId) {
        const table = await TableModel.findOne({ _id: req.params.tableId }).exec();
        if (table) {
          let order = table.orders.id(req.params.orderId);
          if (order) {
            order.remove();
            await table.save();
          }
          res.sendStatus(200);
        } else {
          res.status(400).send('Table not found.');
        }
      } else {
        res.status(400).send('tableId not defined or orderId not defined.');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  options: (req, res) => {
    res.sendStatus(200);
  }
}