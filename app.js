const express = require('express');
const nunjucks = require('nunjucks');
const admin = require('./routes/admin');

const app = express();
const port = 3000;

nunjucks.configure('template', {
    autoescape: true,
    express: app
});

app.get('/', function (req, res) {
    res.send('first app');
});

app.use('/admin', admin);

app.listen(port, function () {
    console.log('Express listening on port', port);
});