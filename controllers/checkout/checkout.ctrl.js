const models = require('../../models');

exports.index = (req, res) => {
    
    let totalAmount = 0;
    let cartList = {};

    if( typeof(req.cookies.cartList) !== 'undefined') {
        cartList = JSON.parse(unescape(req.cookies.cartList));
        for( const key in cartList){
            totalAmount += parseInt(cartList[key].amount);
        }
    }

    res.render('checkout/index.html', { cartList, totalAmount } );
}

exports.post_complete = async(req, res) => {
    await models.Checkout.create(req.body);
    res.json({ message: "success" });
};

exports.get_success = (req, res) => {
    res.render('checkout/success.html');
};