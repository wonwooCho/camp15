const express = require('express');
const nunjucks = require('nunjucks');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// db 관련
const db = require('./models');

// DB authentication
db.sequelize.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');

    // 접속과 동시에 테이블 자동생성 시도
    return db.sequelize.sync();
})
.then(() => {
    console.log('DB Sync complete.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

const admin = require('./routes/admin');

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

// 미들웨어 이후 라우팅
app.get('/', (req, res) => {
    res.send('first app');
});

app.use('/admin', admin);

app.listen(port, () => {
    console.log('Express listening on port', port);
});