const cafeteriaInfo = require('../models/cafeteria-info');
const servicios = require('../models/servicios');
const especialidades = require('../models/especialidades');
const productosPrecios = require('../models/productos-precios');

async function postPrompt(req, res) {
  const { prompt, history } = req.body;
  if (typeof prompt !== 'string' || prompt.trim().length === 0) {
    const error = new Error('El campo "prompt" debe ser un texto no vacío');
    error.statusCode = 400;
    throw error;
  }

  // Consulta 100% en vivo a MySQL usando tus modelos
  const [cafeteria, listaServicios, listaEspecialidades, productos] =
    await Promise.all([
      cafeteriaInfo.findAll(),
      servicios.findAll(),
      especialidades.findAll(),
      productosPrecios.findAll()
    ]);

  // Limpiamos únicamente las URLs de las fotos (imagen/video_url) para no saturar la memoria de Gemma3
  const infoLimpia = cafeteria.map(({ video_url, foto_tienda_1, foto_tienda_2, foto_tienda_3, ...resto }) => resto);
  const serviciosLimpios = listaServicios.map(({ imagen, ...resto }) => resto);
  const especialidadesLimpias = listaEspecialidades.map(({ imagen, ...resto }) => resto);
  const productosLimpios = productos.map(({ imagen, ...resto }) => resto);

  const contextoBD = JSON.stringify({
    cafeteria_info: infoLimpia,
    servicios: serviciosLimpios,
    especialidades: especialidadesLimpias,
    productos_precios: productosLimpios
  }, null, 2);

  const system = [
    'Eres el Barista Virtual de CoffeeHouse Cochabamba.',
    'A continuación tienes la base de datos oficial en vivo extraída de MySQL en formato JSON:',
    contextoBD,
    'REGLAS DE RAZONAMIENTO PARA TUS RESPUESTAS:',
    '1. Usa EXCLUSIVAMENTE los productos y el campo "precio_bob" que aparecen en "productos_precios". Prohibido inventar productos o precios que no estén en ese JSON.',
    '2. Si el usuario menciona un presupuesto (ej. "tengo X Bs"), compara mentalmente el número "precio_bob" de cada producto contra X. Lista SOLO los productos donde "precio_bob" sea menor o igual a X. NUNCA incluyas en tu respuesta productos cuyo "precio_bob" sea mayor al dinero que tiene el usuario.',
    '3. Ten en cuenta todo el historial de la conversación: si el usuario mencionó gustos o restricciones en mensajes anteriores (ej. ingredientes que no desea), filtra tus recomendaciones respetando lo que dijo antes.',
    '4. Responde en español, de forma breve, directa y conversacional.'
  ].join('\n\n');

  const model = process.env.OLLAMA_MODEL;
  if (!model) {
    const error = new Error('La variable OLLAMA_MODEL no está configurada');
    error.statusCode = 500;
    throw error;
  }

  const ollamaUrl = (process.env.OLLAMA_URL || 'http://localhost:11434').replace(/\/+$/, '');

  // Historial de la sesión actual enviado desde el frontend
  const historialMensajes = Array.isArray(history)
    ? history
        .filter(m => m && typeof (m.text || m.content) === 'string' && (m.text || m.content).trim() !== '')
        .map(m => ({
          role: m.sender === 'user' || m.role === 'user' ? 'user' : 'assistant',
          content: (m.text || m.content).trim()
        }))
    : [];

  const messages = [
    { role: 'system', content: system },
    ...historialMensajes,
    { role: 'user', content: prompt.trim() }
  ];

  let ollamaResponse;
  try {
    ollamaResponse = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
        options: {
          temperature: 0.3
        }
      })
    });
  } catch (cause) {
    const error = new Error('No se pudo conectar con Ollama', { cause });
    error.statusCode = 502;
    throw error;
  }

  if (!ollamaResponse.ok) {
    const error = new Error(`Ollama respondió con estado ${ollamaResponse.status}`);
    error.statusCode = 502;
    throw error;
  }

  const result = await ollamaResponse.json();
  const respuestaTexto = result?.message?.content ?? result?.response;

  if (typeof respuestaTexto !== 'string') {
    const error = new Error('Ollama devolvió una respuesta inválida');
    error.statusCode = 502;
    throw error;
  }

  res.json({ response: respuestaTexto.trim() });
}

module.exports = { postPrompt };