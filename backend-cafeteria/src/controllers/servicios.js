const createCrudController = require('./crud-controller');
const model = require('../models/servicios');

module.exports = createCrudController(model);
