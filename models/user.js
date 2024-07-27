const Sequelize = require('sequelize');

const database = require('../util/database');

const  User = database.define('users',{
    userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    email : {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    phone : Sequelize.STRING,
    name: Sequelize.TEXT,
    password: Sequelize.TEXT
});

module.exports = User;