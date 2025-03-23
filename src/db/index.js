const knex = require('knex');

let CONNECTION;
const DB = {
    users: () => CONNECTION('users'),
    books: () => CONNECTION('books'),
    history: () => CONNECTION('history'),
};

function initDatabaseConnection() {
    CONNECTION = knex({
        client: 'pg',
        connection: {
            host: process.env.SQLDB_HOST,
            port: process.env.SQLDB_PORT,
            user: process.env.SQLDB_USER,
            password: process.env.SQLDB_PASSWORD,
            database: process.env.SQLDB_DATABASE,
        },
    });
}

module.exports = {
    DB,
    initDatabaseConnection,
};