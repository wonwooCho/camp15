const express = require('express');
const router = express.Router();
const models = require('../models');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passwordHash = require('../helpers/passwordHash');

passport.serializeUser((user, done) => {
    console.log('serializeUser');
    done(null, user); 
});

passport.deserializeUser((user, done) => {
    // const result = user;
    // result.password = "";
    console.log('deserializeUser');
    done(null, user);
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {

    console.log('LOCAL PASSPORT');

    // 조회
    const user = await models.User.findOne({
        where: {
            username,
            password: passwordHash(password),
        },
        // 이 옵션이 있으면 json으로 데이터 뿌릴때 패스워드는 제외한다
        // attributes: { exclude: ['password'] }
    });

    // 유저에서 조회되지 않을시
    if (!user) {
        return done(null, false, { message: '일치하는 아이디 패스워드가 존재하지 않습니다.' });

    // 유저에서 조회 되면 세션등록쪽으로 데이터를 넘김
    } else {
        return done(null, user.dataValues);
    }
}));

router.get('/', (_, res) => {
    res.send('account app');
});

router.get('/join', (_, res) => {
    res.render('accounts/join.html');
});

router.post('/join', async(req, res) => {
    try {
        const duplicatedUsername = await models.User.findOne({
            where: {
                username: req.body.username
            }
        });

        if (duplicatedUsername !== null) {
            res.render('accounts/join.html', {
                flashMessage: '중복된 아이디입니다.',
                informed: req.body
            });
            return;
        }

        const duplicatedDisplayname = await models.User.findOne({
            where: {
                displayname: req.body.displayname
            }
        });

        if (duplicatedDisplayname !== null) {
            res.render('accounts/join.html', {
                flashMessage: '중복된 닉네임입니다.',
                informed: req.body
            });
            return;
        }

        await models.User.create(req.body);
        res.send('<script>alert("회원가입 성공");\location.href="/accounts/login";</script>');
        
    } catch(e) {

    }
});

router.get('/login', (req, res) => {
    res.render('accounts/login.html', { flashMessage: req.flash().error });
});

router.post('/login', 
    passport.authenticate('local', { 
        failureRedirect: '/accounts/login', 
        failureFlash: true
    }), (req, res) => {
        res.send('<script>alert("로그인 성공");location.href="/";</script>');
    }
);

router.get('/success', (req, res) => {
    res.send(req.user);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/accounts/login');
});

module.exports = router;