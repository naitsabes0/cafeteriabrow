function parseId(value) {
  if (!/^[1-9]\d*$/.test(value)) {
    const error = new Error('El id debe ser un entero positivo');
    error.statusCode = 400;
    throw error;
  }

  return Number(value);
}

function createCrudController(model) {
  return {
    async getAll(req, res) {
      res.json(await model.findAll());
    },

    async getById(req, res) {
      const record = await model.findById(parseId(req.params.id));
      if (!record) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }
      return res.json(record);
    },

    async create(req, res) {
      const id = await model.create(req.body);
      res.status(201).json({ id });
    },

    async update(req, res) {
      const id = parseId(req.params.id);
      await model.update(id, req.body);
      const record = await model.findById(id);
      if (!record) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }
      return res.json(record);
    },

    async delete(req, res) {
      const deleted = await model.delete(parseId(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }
      return res.status(204).end();
    }
  };
}

module.exports = createCrudController;
