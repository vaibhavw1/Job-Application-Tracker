const dotEnv = require('dotenv').config({path: './.env'})
const Sequelize = require('sequelize');


const pass = process.env.DB_PASSWORD;
const user = process.env.DB_USER;
const dialect = process.env.DB_DIALECT;
const host = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const sequelize = new Sequelize(dbName, user, pass, {
    dialect: dialect,
    host: host
});

module.exports = sequelize;

