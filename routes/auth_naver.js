const express = require('express');
const router = express.Router();

const passport = require('passport');
const NaverStrategy = require('passport-naver').Strategy;

const models = require('../models');

const dotenv = require('dotenv');
dotenv.config();

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new NaverStrategy({
    clientID: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
    callbackURL: `${process.env.SITE_DOMAIN}/auth/naver/callback`,
    svcType: 0  // optional. see http://gamedev.naver.com/index.php/%EC%98%A8%EB%9D%BC%EC%9D%B8%EA%B2%8C%EC%9E%84:OAuth_2.0_API
}, async(accessToken, refreshToken, profile, done) => {
    console.log("네이버 로그인 사용자 정보");

    try {
        const username = `naver_${profile.id}`;
        var storedUser = await models.User.findOne({
            where: {
                username
            }
        });

        if (storedUser === null) {
            storedUser = await models.User.create({
                username,
                displayname: profile.displayName,
                password: 'naver_static_pw'
            });
        }

        return done(null, storedUser.dataValues);

    } catch(e) {
        console.log(e);
    }
}));

router.get('/', passport.authenticate('naver', null));

router.get('/callback', passport.authenticate('naver', { 
    successRedirect: '/',
    failureRedirect: '/auth/naver/fail'
}));

router.get('/success', (req, res) => {
    res.send(req.user);
});

router.get('/fail', (req,res) => {
    res.send('naver login fail');
});

module.exports = router;