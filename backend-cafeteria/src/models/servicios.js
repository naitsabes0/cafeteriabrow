const createCrudModel = require('./crud-model');

module.exports = createCrudModel('servicios', [
  'nombre',
  'descripcion',
  'categoria_badge',
  'horario_o_detalle',
  'imagen'
]);
