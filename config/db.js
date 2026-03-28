const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "ramazone",
    password: "raghu1675",
    port: 5432,
});

module.exports = pool;