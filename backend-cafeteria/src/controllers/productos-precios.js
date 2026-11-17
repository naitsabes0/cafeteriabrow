const createCrudController = require('./crud-controller');
const model = require('../models/productos-precios');

module.exports = createCrudController(model);
