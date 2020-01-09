const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    const ProductsMemo = sequelize.define('ProductsMemo', {
            id : { type : DataTypes.BIGINT.UNSIGNED, primaryKey : true, autoIncrement : true },
            content :  { 
                type : DataTypes.TEXT,
                validate : {
                    len : [0, 500],
                }
            }
        }, {
            tableName : 'ProductsMemo'
        }
    );

    ProductsMemo.prototype.dateFormat = (date) => (
        moment(date).format('YYYY-MM-DD // hh:mm')
    );

    return ProductsMemo;
}