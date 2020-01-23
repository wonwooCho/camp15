const express = require('express');
const router = express.Router();

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const models = require('../models');

const dotenv = require('dotenv');
dotenv.config();

passport.serializeUser( (user, done) => {
    done(null, user);
});

passport.deserializeUser( (user, done) => {
    done(null, user);
});

passport.use(new FacebookStrategy({
        // https://developers.facebook.com에서 appId 및 scretID 발급
        clientID : process.env.FACEBOOK_APPID , // 입력하세요
        clientSecret : process.env.FACEBOOK_SECRETCODE , // 입력하세요.
        callbackURL : `${process.env.SITE_DOMAIN}/auth/facebook/callback`,
        profileFields : ['id', 'displayName', 'photos', 'email'] // 받고 싶은 필드 나열
    }, async(accessToken, refreshToken, profile, done) => {
        
        console.log('페이스북 로그인 사용자 정보');
        //아래 하나씩 찍어보면서 데이터를 참고해주세요.
        // console.log(accessToken);
        // console.log(refreshToken);
        console.log(profile);
        //console.log(profile.displayName);
        //console.log(profile.emails[0].value);
        //console.log(profile._raw);
        //console.log(profile._json);
        
        // 페이스북 인증 실패의 경우 무조건 fail로 보내고 있으므로
        // 여기 들어온건 무조건 인증엔 성공했다고 가정한다.
        try {
            const username =`fb_${profile.id}`;

            // // db에 아이디 존재하는지 확인
            // const existUserCount = await models.User.count({
            //     where : {
            //         // 아이디로 조회
            //         username
            //     }
            // });

            // if (!existUserCount) {
            //     user = await models.User.create({
            //         username,
            //         displayname : profile.displayName,
            //         password : "facebook"
            //     });
            // } else {
            //     user = await models.User.findOne({
            //         where : { 
            //             username
            //         } 
            //     });
            // }

            // return done(null, user);

            var storedUser = await models.User.findOne({
                where : {
                    username
                }
            });

            if (storedUser === null) {
                storedUser = await models.User.create({
                    username,
                    displayname : profile.displayName,
                    password : "facebook"
                });
            }

            return done(null, storedUser);

        } catch(e) {
            console.log(e);
        }
    }
));

// http://localhost:3000/auth/facebook 접근시 facebook으로 넘길 url 작성해줌
router.get('/facebook', passport.authenticate('facebook', { scope: 'email'}) );

//인증후 페이스북에서 이 주소로 리턴해줌. 상단에 적은 callbackURL과 일치
router.get('/facebook/callback',
    passport.authenticate('facebook', { 
            successRedirect: '/',
            failureRedirect: '/auth/facebook/fail' 
        }
    )
);

router.get('/facebook/success', (req,res) => {
    res.send(req.user);
});

router.get('/facebook/fail', (req,res) => {
    res.send('facebook login fail');
});

module.exports = router;