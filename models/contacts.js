const moment = require('moment');

module.exports = (sequelize, data_types) => {
    var Contacts = sequelize.define('Contacts', {
        id : { type : data_types.INTEGER, primaryKey : true, autoIncrement : true },
        name : { type : data_types.STRING },
        manufacturer : { type : data_types.STRING },
        description : { type : data_types.TEXT }
    });

    Contacts.prototype.dateFormat = (date) => (
        moment(date).format('YYYY-MM-DD')
    );

    return Contacts;
}