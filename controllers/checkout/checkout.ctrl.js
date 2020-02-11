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

exports.get_shipping = async(req, res) => {

    // 모듈선언
    const request = require('request-promise');
    const cheerio = require('cheerio');
    
    try {
        //대한통운의 현재 배송위치 크롤링 주소
        const url = "https://www.doortodoor.co.kr/parcel/ \
        doortodoor.do?fsp_action=PARC_ACT_002&fsp_cmd=retrieveInvNoACT&invc_no=" + req.params.invc_no;
        let result = []; //최종 보내는 데이터
        
        const html = await request(url);
        const $ = cheerio.load(html, { decodeEntities: false }); //한글 변환

        const tdElements = $(".board_area").find("table.mb15 tbody tr td"); //td의 데이터를 전부 긁어온다

        // 아래 주석을 해제하고 콘솔에 찍어보세요.
        // console.log(tdElements);

        // 한 row가 4개의 칼럼으로 이루어져 있으므로
        // 4로 나눠서 각각의 줄을 저장한 한줄을 만든다

        var tmpData = {};
        for (var i = 0; i < tdElements.length; ++i) {
            var cellData = tdElements[i];
            var cellI = i % 4;

            switch (cellI) {
                case 0:
                    tmpData = {};
                    tmpData['step'] = cellData.children[0].data.trim();
                    break;

                case 1:
                    tmpData['date'] = cellData.children[0].data;
                    break;

                case 2:
                    tmpData['status'] = cellData.children[0].data;
                    if (1 < cellData.children.length) {
                        tmpData['status'] += cellData.children[2].data;
                    }
                    break;

                case 3:
                    tmpData['location'] = cellData.children[1].children[0].data;
                    result.push(tmpData);
                    break;
            }
        }

        res.render('checkout/shipping.html', { result });
        
    } catch(e) {
        console.log(e);
    }
}