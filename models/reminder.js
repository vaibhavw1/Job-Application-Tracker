const Sequelize = require('sequelize');

const database = require('../util/database');

const  Reminder = database.define('reminders',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    remindAfter : {
        type: Sequelize.DATE,
        allowNull: false
    }
});

module.exports = Reminder;