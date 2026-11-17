const createCrudRouter = require('./crud-router');
const controller = require('../controllers/servicios');

module.exports = createCrudRouter(controller);
