import Pool from 'pg'
/*
user: This is the username you use to connect to your PostgreSQL database.
host: This is the hostname or IP address of the machine where your PostgreSQL server is running. If PostgreSQL is running on your local machine, you can use 'localhost'. Otherwise, you should use the appropriate hostname or IP address.
database: This is the name of the PostgreSQL database you want to connect to.
password: This is the password associated with the username you provided.
*/

//Connection String:
// Create a connection string with your database credentials:
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',//
  database: 'your_database',
  password: 'your_password',
  port: 3008, // Default PostgreSQL port is 5432
});

// Optional: Connection pool configuration
pool.on('connect', (client) => {
  console.log('Connected to database');
  console.log("typeof(client) =" + typeof(client) + "  client = " + client)
});

pool.on('error', (err) => {
  console.error('Error connecting to database:', err);
});

export {pool};
