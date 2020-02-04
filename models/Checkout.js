const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    const Checkout = sequelize.define('Checkout',
        {
            id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
            imp_uid: { type: DataTypes.STRING }, //고유ID
            merchant_uid: { type: DataTypes.STRING }, //상점 거래ID
            paid_amount: { type: DataTypes.INTEGER }, //결제금액
            apply_num: { type: DataTypes.STRING }, //카드 승인번호

            buyer_email: { type: DataTypes.STRING }, //이메일
            buyer_name: { type: DataTypes.STRING }, //구매자 성함
            buyer_tel: { type: DataTypes.STRING }, //전화번호
            buyer_addr: { type: DataTypes.STRING }, //구매자 주소

            buyer_postcode: { type: DataTypes.STRING }, //우편번호

            status: { type: DataTypes.STRING }, //결재완료, 배송중 등등
            song_jang: { type: DataTypes.STRING }, //송장번호

        }, {
            tableName: 'Checkout'
        }
    );

    Checkout.prototype.dateFormat = (date) => (
        moment(date).format('YYYY-MM-DD // h:mm')
    );

    return Checkout;
}