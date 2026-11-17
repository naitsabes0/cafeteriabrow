const createCrudRouter = require('./crud-router');
const controller = require('../controllers/especialidades');

module.exports = createCrudRouter(controller);
