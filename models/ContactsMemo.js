const moment = require('moment');

module.exports = (sequelize, dataType) => {
    const ContactsMemo = sequelize.define('ContactsMemo', {
            id : {
                type : dataType.BIGINT.UNSIGNED,
                primaryKey : true,
                autoIncrement : true
            },
            content : {
                type : dataType.TEXT,
                validate : {
                    len : [0, 300]
                }
            }
        }, {
            tableName : 'ContactsMemo'
        });

    ContactsMemo.prototype.dateFormat = (date) => (
        moment(date).format('YYYY-MM-DD // hh:mm')
    );

    return ContactsMemo;
}