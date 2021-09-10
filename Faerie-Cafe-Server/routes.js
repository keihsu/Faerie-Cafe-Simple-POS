var router = require('express').Router();
var controller = require('./controllers');

// Menu Routes

// Retrieves Current Menu
router.get('/menu', controller.menu.get);
// Adds new menu item
router.post('/menu', controller.menu.post);
// Updates price of menu item
router.patch('/menu', controller.menu.patch);
// Removes menu item
router.delete('/menu', controller.menu.delete);
// Menu options
router.options('/menu', controller.menu.options);

// Gets all non-completed tables
// Query params:
// viewAll - 'true' or 'false',
// order - 'asc' or 'desc,
// filter - user provided filter value,
// distinct - 'true' or 'false'
router.get('/tables', controller.tables.get);
// Deletes all tables
router.delete('/tables', controller.tables.delete);

// Gets single table with matching tableId
router.get('/table/:tableId', controller.table.get);
// Opens a new table
router.post('/table', controller.table.post);
// Updates table information
router.patch('/table/:tableId', controller.table.patch);
// Deletes table
router.delete('/table', controller.table.delete);
// Table Options
router.options('/table', controller.table.options);

// Retrieves table orders
router.get('/table/:tableId/orders', controller.orders.get);
// Adds an order to the table
router.post('/table/:tableId/orders', controller.orders.post);
// Updates an order on the table
router.patch('/table/:tableId/orders/:orderId', controller.orders.patch);
// Removes an order from the table
router.delete('/table/:tableId/orders/:orderId', controller.orders.delete);


// Gets all shifts
router.get('/shift', controller.shift.get);
// Gets all shifts
router.get('/shift/:shiftId', controller.shift.get);
// Creates a new shift
router.post('/shift', controller.shift.post);
// Updates shift details
router.patch('/shift/:shiftId', controller.shift.patch);
// Deletes all shifts
router.delete('/shift', controller.shift.delete);
// Shift options
router.options('/shift', controller.shift.options);

module.exports = router;