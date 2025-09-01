const { pool } = require('../../db');

const Locataire = {
  findById: async (id) => {
    const result = await pool.query('SELECT * FROM locataires WHERE id=$1;', [id]);
    return result.rows[0];
  }
};

module.exports = Locataire;
