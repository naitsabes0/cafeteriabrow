const createCrudRouter = require('./crud-router');
const controller = require('../controllers/productos-precios');

module.exports = createCrudRouter(controller);
