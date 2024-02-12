import { pool } from "./Postgre.js";

async function deleteUser(id) {
    const client = await pool.connect();
    try {
      const res = await client.query('DELETE FROM users WHERE id = $1', [id]);
      console.log(`User with ID ${id} deleted`);
    } catch (err) {
      console.error('Error deleting user:', err);
    } finally {
      await client.release();
    }
  }