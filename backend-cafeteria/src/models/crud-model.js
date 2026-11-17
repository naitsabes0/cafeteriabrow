const pool = require('../config/database');

function createCrudModel(table, columns) {
  const allowedColumns = new Set(columns);

  function getColumns(data) {
    const keys = Object.keys(data);
    const unknownColumns = keys.filter((key) => !allowedColumns.has(key));

    if (unknownColumns.length > 0) {
      const error = new Error(`Campos no permitidos: ${unknownColumns.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    if (keys.length === 0) {
      const error = new Error('Debe enviar al menos un campo válido');
      error.statusCode = 400;
      throw error;
    }

    return keys;
  }

  return {
    async findAll() {
      const [rows] = await pool.query(`SELECT * FROM \`${table}\``);
      return rows;
    },

    async findById(id) {
      const [rows] = await pool.execute(
        `SELECT * FROM \`${table}\` WHERE id = ?`,
        [id]
      );
      return rows[0] || null;
    },

    async create(data) {
      const fields = getColumns(data);
      const placeholders = fields.map(() => '?').join(', ');
      const columnNames = fields.map((field) => `\`${field}\``).join(', ');
      const values = fields.map((field) => data[field]);
      const [result] = await pool.execute(
        `INSERT INTO \`${table}\` (${columnNames}) VALUES (${placeholders})`,
        values
      );
      return result.insertId;
    },

    async update(id, data) {
      const fields = getColumns(data);
      const assignments = fields.map((field) => `\`${field}\` = ?`).join(', ');
      const values = fields.map((field) => data[field]);
      const [result] = await pool.execute(
        `UPDATE \`${table}\` SET ${assignments} WHERE id = ?`,
        [...values, id]
      );
      return result.affectedRows > 0;
    },

    async delete(id) {
      const [result] = await pool.execute(
        `DELETE FROM \`${table}\` WHERE id = ?`,
        [id]
      );
      return result.affectedRows > 0;
    }
  };
}

module.exports = createCrudModel;
