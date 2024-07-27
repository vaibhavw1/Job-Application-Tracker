const Sequelize = require('sequelize');

const database = require('../util/database');
const User = require('../models/user');

const  Profile = database.define('profile',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name:{
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    }, 
        
    resumeLink : Sequelize.TEXT,
    carrerGoals: Sequelize.TEXT ,
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,  
            key: 'userId'
        }
    }
},{
    uniqueKeys: {
        profile_unique:{
            fields: ['name','userId']
        }
    }
});

module.exports = Profile;