const moment = require('moment');

module.exports = (sequelize, data_types) => {
    var contacts = sequelize.define('Contacts', {
        id: { type: data_types.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: data_types.STRING },
        manufacturer: { type: data_types.STRING },
        description: { type: data_types.TEXT }
    });

    contacts.prototype.dateFormat = (date) => (
        moment(date).format('YYYY-MM-DD')
    );

    return contacts;
}