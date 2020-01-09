const moment = require('moment');

module.exports = (sequelize, data_types) => {
    var Products = sequelize.define('Products', {
        id : { type : data_types.INTEGER, primaryKey : true, autoIncrement : true },
        name : { type : data_types.STRING },
        price : { type : data_types.INTEGER },
        description : { type : data_types.TEXT }
    });

    // Products 모델 관계도
    Products.associate = (models) => {

        // Memo모델에 외부키를 건다.
        // onDelete 옵션의 경우 Products모델 중 하나가 삭제되면 외부키가 걸린 Memo들도 같이 삭제된다.
        Products.hasMany(models.ProductsMemo, {
            as : 'Memo',
            foreignKey : 'product_id',
            sourceKey : 'id',
            onDelete : 'CASCADE'
        });
    }

    Products.prototype.dateFormat = (date) => (
        moment(date).format('YYYY-MM-DD')
    );

    return Products;
}