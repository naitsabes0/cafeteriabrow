# Servidor API Backend - CoffeeHouse Cochabamba

Implementa un servidor API REST en Node.js y Express con esta estructura exacta:

src/
  config/
    database.js         # Pool de conexión mysql2/promise usando variables de .env
  controllers/          # Controladores CRUD para las 5 tablas y chatbot.js
  models/               # Consultas SQL parametrizadas para cada tabla
  routes/               # Rutas Express para cada tabla y chatbot
  middlewares/          # error-handler.js y require-json-object.js
  app.js                # Configuración de Express, CORS, JSON y registro de rutas
  index.js              # Punto de entrada que carga dotenv y levanta el servidor en PORT 3000

## Base de datos MySQL (`dbwebcafe`)
Usa `mysql2/promise` leyendo `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` desde `.env`.

## Tablas para generar Modelos, Controladores y Rutas CRUD completas (GET, GET/:id, POST, PUT/:id, DELETE/:id)
1. Tabla `cafeteria_info` -> Ruta `/api/cafeteria-info`
   Campos: `id`, `nombre`, `etiqueta_ubicacion`, `titulo_parte1`, `titulo_destacado`, `titulo_parte2`, `subtitulo_hero`, `texto_boton_hero`, `video_url`, `historia`, `filosofia`, `direccion`, `ciudad`, `telefono`, `email`, `horarios`, `foto_tienda_1`, `foto_tienda_2`, `foto_tienda_3`
2. Tabla `servicios` -> Ruta `/api/servicios`
   Campos: `id`, `nombre`, `descripcion`, `categoria_badge`, `horario_o_detalle`, `imagen`
3. Tabla `especialidades` -> Ruta `/api/especialidades`
   Campos: `id`, `nombre`, `origen_grano`, `notas_cata`, `metodo_extraccion`, `barista_autor`, `descripcion`, `imagen`
4. Tabla `productos_precios` -> Ruta `/api/productos-precios`
   Campos: `id`, `nombre`, `categoria`, `descripcion`, `precio_bob`, `tamanio_presentacion`, `destacado`, `imagen`
5. Tabla `contactos` -> Ruta `/api/contactos`
   Campos: `id`, `nombre_completo`, `email`, `telefono`, `motivo_contacto`, `fecha_reserva`, `cantidad_personas`, `mensaje`, `fecha_envio`

## Ruta del Chatbot (Ollama + Gemma3 CON LECTURA EN TIEMPO REAL DE MYSQL)
- Ruta: `POST /api/chatbot` y alias `POST /ollama-prompt`
- El controlador `src/controllers/chatbot.js` debe:
  1. Recibir `{ "prompt": "pregunta del usuario" }`.
  2. Consultar en tiempo real MySQL (`cafeteria_info`, `servicios`, `especialidades` y `productos_precios`) para inyectar todos los datos, direcciones, horarios y precios en Bolivianos (Bs.) dentro del `system` prompt de Ollama.
  3. Enviar la petición a `${OLLAMA_URL}/api/generate` con `model: process.env.OLLAMA_MODEL` y `stream: false`.
  4. Responder `{ "response": "..." }`.