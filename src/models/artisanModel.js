const { pool } = require('../../db');

const Artisan = {
  // Tìm artisan theo specialty
  findBySpecialty: async (type_incident) => {
    const result = await pool.query(
      'SELECT * FROM artisans WHERE type_specialite=$1 LIMIT 1;',
      [type_incident]
    );
    return result.rows[0];
  }
};

module.exports = Artisan;
