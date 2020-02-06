const models = require('../../models');
const dotenv = require('dotenv');

dotenv.config();

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

exports.get_complete = async(req, res) => {

    // 모듈 선언
    const { Iamporter } = require('iamporter');
    const iamporter = new Iamporter({
        apiKey: process.env.IAMPORT_API_KEY,
        secret: process.env.IAMPORT_API_SECRET
    });

    try{ 

        const iamportData = await iamporter.findByImpUid(req.query.imp_uid);
        await models.Checkout.create({
            imp_uid : iamportData.data.imp_uid,
            merchant_uid : iamportData.data.merchant_uid,
            paid_amount : iamportData.data.amount,
            apply_num : iamportData.data.apply_num,
            
            buyer_email : iamportData.data.buyer_email,
            buyer_name : iamportData.data.buyer_name,
            buyer_tel : iamportData.data.buyer_tel,
            buyer_addr : iamportData.data.buyer_addr,
            buyer_postcode : iamportData.data.buyer_postcode,
    
            status : "결제완료",
        });
        
        res.redirect('/checkout/success');

    } catch(e) {
        console.log(e);
    }
};

exports.get_success = (req, res) => {
    res.render('checkout/success.html');
};

exports.get_nomember = (req, res) => {
    res.render('checkout/nomember.html');
};

exports.get_nomember_search = async(req, res) => {
    try {
        const checkouts = models.Checkout.findAll({
            where: {
                buyer_email: req.query.buyer_email
            }
        });

        res.render('checkout/search.html', { checkouts });
        
    } catch(e) {
        console.log(e)
    }    
}