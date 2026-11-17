const express = require('express');
const requireJsonObject = require('../middlewares/require-json-object');

function createCrudRouter(controller) {
  const router = express.Router();

  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', requireJsonObject, controller.create);
  router.put('/:id', requireJsonObject, controller.update);
  router.delete('/:id', controller.delete);

  return router;
}

module.exports = createCrudRouter;
