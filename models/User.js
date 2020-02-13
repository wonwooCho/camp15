const passwordHash = require('../helpers/passwordHash');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },

        username: {
            type: DataTypes.STRING,
            validate: {
                len: [0, 50]
            },
            allowNull: false
        },
            
        password: { 
            type: DataTypes.STRING,
            validate: {
                len: [3, 100]
            },
            allowNull: false
        },
        
        displayname: {
            type: DataTypes.STRING
        },

        provider: {
            type: DataTypes.STRING,
            allowNull: false
        },

    }, {
        tableName: 'User'
    });

    User.associate = models => {
        User.hasMany(
            // Products 모델에 외부키를 건다
            // onDelete 옵션의 경우 제품 하나가 삭제되면 외부키가 걸린 메모들도 전부 삭제해준다. 단 sync를 다시 해줘야됨
            // as 의 경우 모델명과 똑같이 하지 않는다 Products (x)
            models.Products, {
                as: 'Product',
                foreignKey: 'user_id',
                sourceKey: 'id',
                onDelete: 'CASCADE'
            }
        );

        // 즐겨찾기(좋아요) 구현
        User.belongsToMany(models.Products, {
            through: {
                // User와 Product는 many-many 관계이므로 그 중간에서
                // 좋아요 관계를 저장할 중간테이블 자동 생성한다.
                // User, Products의 foreign key만 저장하는 구조
                model: 'LikesProducts',
                unique: false
            },
            as: 'Likes',
            foreignKey: 'user_id',
            sourceKey: 'id',
            constraints: false
        });
    }

    User.beforeCreate((user, _) => {
        console.log('User HOOK!');
        user.password = passwordHash(user.password);
    });

    return User;
}