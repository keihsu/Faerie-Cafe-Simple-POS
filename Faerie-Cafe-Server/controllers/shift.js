const { ShiftModel } = require('../database/models')

module.exports = {
  get: async (req, res) => {
    try {
      if (req.params.shiftId) {
        const shift = await ShiftModel.findOne({ _id: req.params.shiftId }).exec();
        if (shift) {
          res.status(200).json(shift);
        } else {
          res.status(400).send('Shift not found.');
        }
      } else {
        const shifts = await ShiftModel.find().sort({startTime: 'desc'});
        res.status(200).json(shifts);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  post: async (req, res) => {
    try {
      const newShift = new ShiftModel();
      await newShift.save();
      res.status(200).json(newShift);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  patch: async (req, res) => {
    try {
      if (req.params.shiftId) {
        const shift = await ShiftModel.findOne({ _id: req.params.shiftId }).exec();
        if (shift) {
          if (req.body.orderTotal !== undefined) {
            shift.totalSales += req.body.orderTotal;
          }
          if (req.body.tips !== undefined) {
            shift.totalTips += req.body.tips;
          }
          if (req.body.end !== undefined) {
            shift.endTime = Date.now();
          }
          await shift.save();
          res.sendStatus(200);
        } else {
          res.status(404).send('Shift not found.');
        }
      } else {
        res.status(400).send('Shift ID not defined');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  delete: async (req, res) => {
    try {
      await ShiftModel.deleteMany({});
      res.sendStatus(200);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  options: (req, res) => {
    res.sendStatus(200);
  }
}