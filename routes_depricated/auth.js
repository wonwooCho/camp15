const express = require('express');
const router = express.Router();

const facebook = require('./auth_facebook');
const naver = require('./auth_naver');

router.use('/facebook', facebook);
router.use('/naver', naver);

module.exports = router;