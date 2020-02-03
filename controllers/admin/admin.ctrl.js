const models = require('../../models');
const paginate = require('express-paginate');

const fs = require('fs');

exports.get_products = async(req,res) => {
    try {
        const [products, totalCount] = await Promise.all([
            models.Products.findAll({
                include: [
                    {
                        model: models.User,
                        as: 'Owner',
                        attributes: ['username', 'displayname']
                    },
                ],
                limit: req.query.limit,
                offset: req.offset
            }),

            models.Products.count()
        ]);

        const pageCount = Math.ceil(totalCount / req.query.limit);
        // const pageCount = (totalCount / req.query.limit) + (totalCount % req.query.limit);

        // 1번 파람: page 네비게이션 바에 노출되는 최대 page 수
        const pages = paginate.getArrayPages(req)(5, pageCount, req.query.page);

        res.render('admin/products.html', { products, pages, pageCount });
    } catch(e) {
        console.log('admin/products - ' + e);
    }
}

exports.get_write = (req, res) => {
    res.render('admin/form.html' , { csrfToken: req.csrfToken() });
}

exports.post_write = async(req, res) => {
    // key - body 간 필드명이 동일하면 req.body만 넣어줘도 자동으로 맵핑된다.
    // 즉 { name: req.body.name, ... } 생략 가능
    try {
        req.body.thumbnail = req.file ? req.file.filename : "";

        // 유저를 가져온다음에 저장
        const user = await models.User.findByPk(req.user.id);
        await user.createProduct(req.body);
        
        res.redirect('/admin/products');
        
    } catch(e) {
        console.log(`products/write error -> ${e}`);
    }
}

exports.get_detail = async(req, res) => {
    try {
        const data_from_db = await models.Products.findOne({
            where: {
                id: req.params.id
            },
            include: [
                'Memo'
            ]
        });
        res.render('admin/detail.html', { product: data_from_db });
    } catch(e) {

    }
}

exports.post_detail = async(req, res) => {
    try {
        const product = await models.Products.findByPk(req.params.id);
        // create + as에 적은 내용 ( Products.js association 에서 적은 내용 )
        await product.createMemo(req.body);
        res.redirect(`/admin/products/detail/${req.params.id}`); 
    } catch(e) {

    }
}

exports.get_edit = async(req, res) => {
    try {
        const data_from_db = await models.Products.findByPk(req.params.id);
        res.render('admin/form.html', {
            product: data_from_db,
            csrfToken: req.csrfToken()
         });
    } catch(e) {

    }
}

exports.post_edit = async(req, res) => {
    try {
        const product = await models.Products.findByPk(req.params.id);

        // 파일이 존재하면 이전이미지 지운다.
        if (req.file && product.thumbnail) {
            fs.unlinkSync(`${uploadDir}/${product.thumbnail}`);
        }

        // 수정요청이 파일명을 들고있으면 덮어씌우고, 안들고있으면 DB에서 가져옴
        req.body.thumbnail = req.file ? req.file.filename : product.thumbnail;

        await models.Products.update(req.body, {
            where: {
                id: req.params.id
            }
        });

        res.redirect(`/admin/products/detail/${req.params.id}`);
    } catch(e) {
        console.log(`products/edit/${req.params.id} error -> ${e}`);
    }
}

exports.get_delete = async(req, res) => {
 try {
        // 파일 제거
        var product = await models.Products.findByPk(req.params.id);
        if (product.thumbnail)
            fs.unlinkSync(`${uploadDir}/${product.thumbnail}`);

        await models.Products.destroy({
            where: { 
                id: req.params.id
            }
        });
        res.redirect('/admin/products');
    } catch(e) {

    }
}

exports.delete_memo = async(req, res) => {
    try {
        await models.ProductsMemo.destroy({
            where: {
                id: req.params.memo_id
            }
        });
        res.redirect(`/admin/products/detail/${req.params.product_id}`);
    } catch(e) {

    }
}

exports.ajax_summernote = (req,res) => {
    res.send(`/uploads/${req.file.filename}`);
}