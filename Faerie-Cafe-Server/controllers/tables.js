const { TableModel } = require('../database/models')

module.exports = {
  get: async (req, res) => {
    console.log('query', req.query);
    const filter = {}
    if (req.query.shiftId) {
      filter.shiftId = req.query.shiftId;
    }
    if (req.query.viewAll === 'true') {
      filter.complete = true;
    } else {
      filter.complete = false;
    }
    console.log(filter);
    try {
      if (req.query.select) {
        const tables = await TableModel.find(filter).sort({date: req.query.order}).select(req.query.select);
        if (req.query.distinct === 'true') {
          const ids = [];
          tables.forEach((table) => {ids.push(table._id)});
          res.status(200).json(ids);
        } else {
          res.status(200).json(tables);
        }
      } else {
        const tables = await TableModel.find(filter).sort({date: req.query.order});
        console.log(tables);
        res.status(200).json(tables);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
  delete: async (req, res) => {
    try {
      await TableModel.deleteMany({});
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  options: (req, res) => {
    res.sendStatus(200);
  }
}