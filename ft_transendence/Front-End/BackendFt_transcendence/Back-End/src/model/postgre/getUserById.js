import { pool } from "./Postgre.js";

async function getUserById(id) {
    const client = await pool.connect();
    try {
      const res = await client.query('SELECT * FROM users WHERE id = $1', [id]);
      if (res.rows.length > 0) {
        return res.rows[0];
      } else {
        console.log(`User with ID ${id} not found`);
        return null;
      }
    } catch (err) {
      console.error('Error getting user:', err);
    } finally {
      await client.release();
    }
  }