// src/models/ticketModel.js
const { pool } = require('../../db');

const Ticket = {
  // Tạo ticket mới
  create: async ({ locataireId, type_incident, description }) => {
    const query = `
      INSERT INTO tickets (locataire_id, type_incident, description, status, created_at, updated_at)
      VALUES ($1, $2, $3, 'new', NOW(), NOW())
      RETURNING *;
    `;
    const values = [locataireId, type_incident, description];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query('SELECT * FROM tickets WHERE id=$1;', [id]);
    return result.rows[0];
  },

  // Lấy tất cả ticket
  findAll: async () => {
    const result = await pool.query('SELECT * FROM tickets ORDER BY created_at DESC;');
    return result.rows;
  },

  // Phân công artisan cho ticket
  assignArtisan: async (ticketId, artisanId) => {
    const query = `
      UPDATE tickets
      SET artisan_id = $1, status = 'assigned', updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [artisanId, ticketId]);
    return result.rows[0];
  },

  // Update trạng thái ticket
  updateStatus: async (ticketId, status) => {
    const query = `
      UPDATE tickets
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [status, ticketId]);
    return result.rows[0];
  }
};

module.exports = Ticket;
