
const knex = require('knex');

const config = {
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '1234',
    database: 'naturalux',
  }
};

const db = knex(config);

module.exports = db;