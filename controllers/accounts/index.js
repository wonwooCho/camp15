const { Router } = require('express');
const router = Router();
const ctrl = require('./accounts.ctrl');
const passport = require('../../middleware/passport-local');
const recaptcha = require('../../middleware/recaptcha');

router.get('/join', recaptcha.middleware.render, ctrl.get_join);
router.post('/join', recaptcha.middleware.verify, ctrl.post_join);

router.get('/login', ctrl.get_login);
router.post('/login' , passport.authenticate('local', { 
    failureRedirect: '/accounts/login', 
    failureFlash: true 
}), ctrl.post_login );
 
 
router.get('/logout', ctrl.get_logout);

// 이메일 인증관련
router.get('/join/check', ctrl.join_check);

router.get('/join/validate', ctrl.join_validate);

module.exports = router;