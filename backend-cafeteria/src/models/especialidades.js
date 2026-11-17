const createCrudModel = require('./crud-model');

module.exports = createCrudModel('especialidades', [
  'nombre',
  'origen_grano',
  'notas_cata',
  'metodo_extraccion',
  'barista_autor',
  'descripcion',
  'imagen'
]);
