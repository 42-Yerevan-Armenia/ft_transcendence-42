import { pool } from "./Postgre.js";

async function createUserInDb(name, email) {
    const client = await pool.connect();
    try {
      const res = await client.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
      console.log(`User created with ID: ${res.rows[0].id}`);
    } catch (err) {
      console.error('Error creating user:', err);
    } finally {
      await client.release();
    }
}
