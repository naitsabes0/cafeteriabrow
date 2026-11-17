const createCrudRouter = require('./crud-router');
const controller = require('../controllers/contactos');

module.exports = createCrudRouter(controller);
