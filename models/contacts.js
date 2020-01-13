const moment = require('moment');

module.exports = (sequelize, dataTypes) => {
    var Contacts = sequelize.define('Contacts', {
        id : { type : dataTypes.INTEGER, primaryKey : true, autoIncrement : true },
        name : { type : dataTypes.STRING },
        manufacturer : { type : dataTypes.STRING },
        description : { type : dataTypes.TEXT }
    });

    Contacts.prototype.dateFormat = (date) => (
        moment(date).format('YYYY-MM-DD')
    );

    return Contacts;
}