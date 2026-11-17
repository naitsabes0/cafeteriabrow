const createCrudModel = require('./crud-model');

module.exports = createCrudModel('productos_precios', [
  'nombre',
  'categoria',
  'descripcion',
  'precio_bob',
  'tamanio_presentacion',
  'destacado',
  'imagen'
]);
