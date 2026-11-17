const createCrudModel = require('./crud-model');

module.exports = createCrudModel('cafeteria_info', [
  'nombre',
  'etiqueta_ubicacion',
  'titulo_parte1',
  'titulo_destacado',
  'titulo_parte2',
  'subtitulo_hero',
  'texto_boton_hero',
  'video_url',
  'historia',
  'filosofia',
  'direccion',
  'ciudad',
  'telefono',
  'email',
  'horarios',
  'foto_tienda_1',
  'foto_tienda_2',
  'foto_tienda_3'
]);
