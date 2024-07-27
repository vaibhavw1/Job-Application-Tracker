const Sequelize = require('sequelize');

const database = require('../util/database');

const  Company = database.define('company',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    email : {
        type: Sequelize.STRING,
     
    },
    phone : Sequelize.STRING,
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },

    
    companySize : Sequelize.STRING,
    industry: Sequelize.STRING,
    notes: Sequelize.TEXT
});

module.exports = Company;