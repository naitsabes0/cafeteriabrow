const createCrudModel = require('./crud-model');

module.exports = createCrudModel('contactos', [
  'nombre_completo',
  'email',
  'telefono',
  'motivo_contacto',
  'fecha_reserva',
  'cantidad_personas',
  'mensaje',
  'fecha_envio'
]);
