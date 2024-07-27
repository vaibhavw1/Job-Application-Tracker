const Sequelize = require('sequelize');

const database = require('../util/database');

const  Application = database.define('application',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    companyName:{
        type: Sequelize.STRING,
    }, 
    date: {
        type: Sequelize.DATEONLY,
        defaultValue: new Date()
    },
    status: Sequelize.CHAR,
    notes: Sequelize.TEXT,
    uploadLink: Sequelize.TEXT
});

module.exports = Application;