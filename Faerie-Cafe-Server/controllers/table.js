const { TableModel } = require('../database/models')

module.exports = {
  get: async (req, res) => {
    try {
      if (req.params.tableId) {
        const table = await TableModel.findOne({ _id: req.params.tableId }).exec();
        if (table) {
          res.status(200).json(table);
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
      if (req.body.tableName) {
        const newTable = new TableModel({
          tableName: req.body.tableName,
          shiftId: req.body.shiftId,
          server: req.body.server,
        });
        await newTable.save();
        res.status(200).json(newTable);
      } else {
        res.status(400).send('Table name or shift not defined.');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  patch: async (req, res) => {
    try {
      if (req.params.tableId) {
        const table = await TableModel.findOne({ _id: req.params.tableId }).exec();
        if (table) {
          console.log(table);
          if (req.body.complete !== undefined) {
            table.complete = req.body.complete;
          }
          if (req.body.server) {
            table.server = req.body.server;
          }
          if (req.body.orderTotal) {
            table.orderTotal = req.body.orderTotal;
          }
          if (req.body.tips) {
            table.tips = req.body.tips;
          }
          await table.save()
          res.sendStatus(200);
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
  delete: async (req, res) => {
    try {
      if (req.params.tableId) {
        await TableModel.deleteOne({ _id: req.params.tableId }).exec();
      }
      res.status(200);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  options: (req, res) => {
    res.sendStatus(200);
  }
}