const express = require('express');
const nunjucks = require('nunjucks');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// flash  메시지 관련
const flash = require('connect-flash');
 
// passport 로그인 관련
const passport = require('passport');
const session = require('express-session');

// db 관련
const db = require('./models');

// DB authentication
db.sequelize.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');

    // 접속과 동시에 테이블 자동생성 시도
    return db.sequelize.sync();
    // return db.sequelize.drop();
})
.then(() => {
    console.log('DB Sync complete.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

const admin = require('./routes/admin');
const accounts = require('./routes/accounts');
const auth = require('./routes/auth');
const home = require('./routes/home');
const chat = require('./routes/chat');

const app = express();
const port = 3000;

nunjucks.configure('template', {
    autoescape : true,
    express : app
});

// 미들웨어
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// 업로드 정적 path 추가
app.use('/uploads', express.static('uploads'));

// session 관련 셋팅
app.use(session({
    secret: 'camp15',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 2000 * 60 * 60 //지속시간 2시간
    }
}));

// passport 적용
app.use(passport.initialize());
app.use(passport.session());

// 플래시 메시지 관련
app.use(flash());

//.......flash 아래에다 붙여 넣는다.
//로그인 정보 뷰에서만 변수로 셋팅, 전체 미들웨어는 router위에 두어야 에러가 안난다
// 템플릿에서만 사용할 글로벌변수 -> app.locals
app.use((req, res, next) => {
    app.locals.isLogin = req.isAuthenticated();
    // app.locals.URL_PARAMETER = req.url; // 현재 url 정보를 보내고 싶으면 이와같이 셋팅
    // app.locals.USER_DATA = req.user; // 사용 정보를 보내고 싶으면 이와같이 셋팅
    next();
});

app.use('/admin', admin);
app.use('/accounts', accounts);
app.use('/auth', auth);
app.use('/chat', chat);
app.use('/', home);

const server = app.listen(port, () => {
    console.log('Express listening on port', port);
});

const listen = require('socket.io');
const io = listen(server);
// io.on('connection', socket => {
//     // console.log('채팅을 위한 소켓서버 접속완료');
//     socket.on('client message', data => {
//         // console.log(data);
//         io.emit('server message', data.message);
//     });

//     // 예약어는 connection, disconnect정도. 나머지는 비교적 자유롭게 네이밍 가능
//     socket.on('disconnect', data => {
//         console.log('DISCONNECT ', data);
        
//     });
// });

require('./helpers/socketConnection')(io);  // 별도 모듈 변수선언 없이 불러옴과 동시에 io 파라미터 전달