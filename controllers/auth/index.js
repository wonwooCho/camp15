const { Router } = require('express');
const router = Router();

const passportFacebook = require('../../middleware/passport-facebook');
const passportNaver = require('../../middleware/passport-naver');

///////////////////////////////////////////////////////////////
// facebook
///////////////////////////////////////////////////////////////
router.get('/facebook', passportFacebook.authenticate('facebook', { scope: 'email'}) ); 

// 인증후 페이스북에서 이 주소로 리턴해줌. 상단에 적은 callbackURL과 일치
router.get('/facebook/callback', passportFacebook.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/auth/facebook/fail'
}));
 
// 로그인 성공시 이동할 주소
router.get('/facebook/success', (req, res) => {
    res.send(req.user);
});
 
router.get('/facebook/fail', (req, res) => {
    res.send('facebook login fail');
});

///////////////////////////////////////////////////////////////
// naver
///////////////////////////////////////////////////////////////
router.get('/naver', passportNaver.authenticate('naver', null));

router.get('/naver/callback', passportNaver.authenticate('naver', { 
    successRedirect: '/',
    failureRedirect: '/auth/naver/fail'
}));

router.get('/naver/success', (req, res) => {
    res.send(req.user);
});

router.get('/naver/fail', (req,res) => {
    res.send('naver login fail');
});

module.exports = router;