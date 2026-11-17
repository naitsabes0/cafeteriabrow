const createCrudController = require('./crud-controller');
const model = require('../models/especialidades');

module.exports = createCrudController(model);
