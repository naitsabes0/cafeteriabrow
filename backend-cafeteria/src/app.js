const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/error-handler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/cafeteria-info', require('./routes/cafeteria-info'));
app.use('/api/servicios', require('./routes/servicios'));
app.use('/api/especialidades', require('./routes/especialidades'));
app.use('/api/productos-precios', require('./routes/productos-precios'));
app.use('/api/contactos', require('./routes/contactos'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/ollama-prompt', require('./routes/chatbot'));

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});
app.use(errorHandler);

module.exports = app;
