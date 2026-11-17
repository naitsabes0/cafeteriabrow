const createCrudController = require('./crud-controller');
const model = require('../models/contactos');

module.exports = createCrudController(model);
