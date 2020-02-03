const { Router } = require('express');
const router = Router();

router.use('/', require('./home'));
router.use('/accounts', require('./accounts'));
router.use('/admin', require('./admin'));
router.use('/auth', require('./auth'));
router.use('/chat', require('./chat'));
router.use('/mypage', require('./mypage'));

module.exports = router;