const Sequelize = require('sequelize');
const database = require('../util/database');

const companyProfiles = database.define('companyProfiles', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    companyId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'company', 
            key: 'id'
        }
    },
    profileId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'profile', 
            key: 'id'
        }
    }

});

module.exports = companyProfiles;