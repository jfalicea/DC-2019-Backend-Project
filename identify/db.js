require('dotenv').config();

const pgp = require('pg-promise')({
    query: (e) => console.log(e.query)
})

const db = pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

console.log('RAN DB FILE.');

module.exports = db;