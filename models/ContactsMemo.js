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

    return ContactsMemo;
}