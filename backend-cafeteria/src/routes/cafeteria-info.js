const createCrudRouter = require('./crud-router');
const controller = require('../controllers/cafeteria-info');

module.exports = createCrudRouter(controller);
