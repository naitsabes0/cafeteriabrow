const createCrudController = require('./crud-controller');
const model = require('../models/cafeteria-info');

module.exports = createCrudController(model);
