const { Router } = require('express');
const router = Router();
const ctrl = require('./admin.ctrl');
const paginate = require('express-paginate');
const csrfProtection = require('../../middleware/csrf');
const adminRequired = require('../../middleware/adminRequired');

const upload = require('../../middleware/multer');

// 이렇게하면 이 아래로 모든 url에 adminRequired가 걸린다.
router.use(adminRequired);

// (n, m) -> 한 페이지에 노출되는 아이템 개수, m -> 최대 가져오는 전체 아이템 개수
router.get('/products', paginate.middleware(10, 1000), ctrl.get_products);

router.get('/products/write', csrfProtection, ctrl.get_write );
router.post('/products/write', upload.single('thumbnail'), csrfProtection, ctrl.post_write);

router.get('/products/detail/:id', ctrl.get_detail);
router.post('/products/detail/:id', ctrl.post_detail);

router.get('/products/edit/:id', csrfProtection, ctrl.get_edit); 
router.post('/products/edit/:id', upload.single('thumbnail'), csrfProtection, ctrl.post_edit);
router.get('/products/delete/:id', ctrl.get_delete);

router.get('/products/delete/:product_id/:memo_id', ctrl.delete_memo);
router.post('/products/ajax_summernote', upload.single('thumbnail'), ctrl.ajax_summernote);

router.get('/order', ctrl.get_order);
router.get('/order/edit/:id', ctrl.get_order_edit);
router.post('/order/edit/:id', ctrl.post_order_edit);

router.get('/statistics', ctrl.statistics);

router.post('/tag', ctrl.write_tag);
router.delete('/tag/:product_id/:tag_id', ctrl.delete_tag);

module.exports = router;