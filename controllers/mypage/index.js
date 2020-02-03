const { Router } = require('express');
const router = Router();
const ctrl = require('./mypage.ctrl');

router.get('/', ctrl.index);
router.get('/edit', ctrl.get_edit);
router.post('/edit', ctrl.post_edit);

module.exports = router;

