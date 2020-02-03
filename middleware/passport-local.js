const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passwordHash = require('../helpers/passwordHash');
const models = require('../models');

passport.serializeUser(  (user, done) => {
    console.log('serializeUser');
    done(null, user);
});

passport.deserializeUser(  (user, done) => {
    console.log('deserializeUser');
    done(null, user);
});


passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField : 'password',
    passReqToCallback : true
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

module.exports = passport;