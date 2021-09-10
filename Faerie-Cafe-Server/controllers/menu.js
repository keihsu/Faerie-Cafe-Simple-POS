const { MenuItemModel } = require('../database/models')

module.exports = {
  get: async (req, res) => {
    try {
      const menuItems = await MenuItemModel.find().sort({itemName: 'asc'});
      res.status(200).json(menuItems);
    } catch (err) {
      res.status(500).send(err);
    }
  },
  post: async (req, res) => {
    try {
      if (req.body.itemName && req.body.price) {
        const newMenuItem = new MenuItemModel({
          itemName: req.body.itemName,
          price: req.body.price,
        });
        await newMenuItem.save();
        res.status(200).json(newMenuItem);
      } else {
        res.status(400).send('Either item name or price not defined.');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  patch: async (req, res) => {
    try {
      if (req.body.itemName && req.body.price) {
        const menuItem = await MenuItemModel.findOne({ itemName: req.body.itemName }).exec();
        if (menuItem) {
          menuItem.price = req.body.price;
          await menuItem.save();
          res.sendStatus(200);
        } else {
          res.status(404).send('Menu item not found.');
        }
      } else {
        res.status(400).send('New item price not defined');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  delete: async (req, res) => {
    console.log(req.body);
    try {
      if (req.body.itemName) {
        await MenuItemModel.deleteOne({ itemName: req.body.itemName });
        res.sendStatus(200);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  options: (req, res) => {
    res.sendStatus(200);
  }
}