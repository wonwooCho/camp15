const express = require('express');

const app = express();
const port = 3000;

app.get('/', function (req, res) {
    res.send('first app');
});

app.get('/admin', function (req, res) {
    res.send('admin app');
});

app.listen(port, function () {
    console.log('Express listening on port', port);
});