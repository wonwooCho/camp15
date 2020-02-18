const models = require('../../models');

exports.get_join = (req, res) => {
    res.render('accounts/join.html');
}

// exports.post_join = async (req, res) => {
    
//     // 환경 설정 변수 관련
//     const dotenv = require('dotenv');
//     dotenv.config(); // LOAD CONFIG

//     try {

//          // body 데이터 삽입
//          const user = await models.User.create({

//             username : req.body.username,
//             displayname : req.body.displayname,
//             password : req.body.password,
//             status : "이메일미인증" // 이메일 미인증 상태
            
//         });
        
//         const duplicatedUsername = await models.User.findOne({
//             where: {
//                 username: req.body.username
//             }
//         });

//         if (duplicatedUsername !== null) {
//             res.render('accounts/join.html', {
//                 flashMessage: '중복된 아이디입니다.',
//                 informed: req.body
//             });
//             return;
//         }

//         const duplicatedDisplayname = await models.User.findOne({
//             where: {
//                 displayname: req.body.displayname
//             }
//         });

//         if (duplicatedDisplayname !== null) {
//             res.render('accounts/join.html', {
//                 flashMessage: '중복된 닉네임입니다.',
//                 informed: req.body
//             });
//             return;
//         }

//         req.body.provider = 'camp15';
//         await models.User.create(req.body);
//         res.send('<script>alert("회원가입 성공");\location.href="/accounts/login";</script>');
        
//     } catch(e) {

//     }
// }

exports.post_join = async (req, res) => {

    // 환경 설정 변수 관련
    const dotenv = require('dotenv');
    dotenv.config(); // LOAD CONFIG


    try {

        // body 데이터 삽입
        const user = await models.User.create({

            username: req.body.username,
            displayname: req.body.displayname,
            password: req.body.password,
            provider: 'camp15',
            status: "이메일미인증" // 이메일 미인증 상태
            
        });

        // 인증키 생성후 DB 삽입
        const hash_key = require('../../helpers/genKey')(user.id);
        
        await models.EmailKey.create({
            hash_key,
            user_id : user.id
        });

        // 인증 메일 발송
        const template = require('../../helpers/email/joinTemplate');
        const sigin_up_url = `${process.env.SITE_DOMAIN}/accounts/join/validate?hash_key=${hash_key}`;

        await require('../../helpers/email/sendMail')({
            to : user.username ,
            subject : "노드쇼핑몰 가입 인증메일 입니다.",
            mail_body : template(sigin_up_url)
        });

        res.redirect(`/accounts/join/check?email=${user.username}`);

    } catch (e) {
        console.log(e)
        res.send('<script> \
            alert("양식에 맞게 작성해주세요. 또는 관리자에게 문의해주세요."); \
            history.go(-1); \
        </script>')
    }
}

exports.join_validate = async (req, res) => {
    try {
        // 인증키에 일치하는 아이디를 받아온다
        const active = await models.EmailKey.findOne({
            where: { 
                hash_key: req.query.hash_key 
            }
        });

        if (!active) {
            // 존재하지 않는 키값일시 또는 실수로 상단 주소를 지웠을 경우
            return require('../../helpers/show404template')(res);
        }

        // 사용자 상태를 이메일 인증으로 바꾼다
        await models.User.update({
            status: "이메일인증완료"
        }, {
            where: { id: active.user_id }
        });

        const user = await models.User.findByPk(active.user_id);
        res.render('accounts/email_active.html', { email : user.username });

    } catch(e) {

    }
}

exports.get_login = (req, res) => {
    res.render('accounts/login.html', { flashMessage: req.flash().error });
}

exports.post_login = (req, res) => {
    res.send('<script>alert("로그인 성공");location.href="/";</script>');
}

exports.get_logout = (req, res) => {
    req.logout();
    res.redirect('/accounts/login');
}

exports.join_check = (req, res) => {
    res.render('accounts/email_check.html', { email: req.query.email });
}