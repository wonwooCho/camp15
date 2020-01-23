const moment = require('moment');

module.exports = (sequelize, dataTypes) => {
    var Products = sequelize.define('Products', {
        id: { type: dataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: dataTypes.STRING },
        thumbnail: { type: dataTypes.STRING },
        price: { type: dataTypes.INTEGER },
        description: { type: dataTypes.TEXT }
    });

    // Products 모델 관계도
    Products.associate = (models) => {

        // Memo모델에 외부키를 건다.
        // onDelete 옵션의 경우 Products모델 중 하나가 삭제되면 외부키가 걸린 Memo들도 같이 삭제된다.
        Products.hasMany(models.ProductsMemo, {
            as: 'Memo',
            foreignKey: 'product_id',
            sourceKey: 'id',
            onDelete: 'CASCADE'
        });

        // User에서 Products를 hasMany로 associate걸었고, Products가 하위 테이블 느낌.
        // Products모델에서 User에 접근하기 위해 필요한 config
        Products.belongsTo(models.User, {
            as: 'Owner',   // => home.js -> as 'Owner'
            foreignKey: 'user_id',
            targetKey: 'id'
        });
    }

    Products.prototype.dateFormat = (date) => (
        moment(date).format('YYYY-MM-DD')
    );

    return Products;
}