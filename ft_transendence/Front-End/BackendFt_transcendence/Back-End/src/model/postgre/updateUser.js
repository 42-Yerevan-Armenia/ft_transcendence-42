import { pool } from "./Postgre.js";

async function updateUser(id, name, email) {
    const client = await pool.connect();
    try {
      const res = await client.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id]);
      console.log(`User with ID ${id} updated`);
    } catch (err) {
      console.error('Error updating user:', err);
    } finally {
      await client.release();
    }
  }