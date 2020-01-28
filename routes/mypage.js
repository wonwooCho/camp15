const express = require('express');
const router = express.Router();

const models = require('../models');
const passwordHash = require('../helpers/passwordHash');

router.get('/edit', (req, res) => {
    const userInfo = req.user;
    const isLocalUser = userInfo.provider === 'camp15';

    res.render('mypage/edit.html', {
        userInfo: req.user,
        isLocalUser: isLocalUser
    });
});

router.post('/edit', async(req, res) => {
    try {
        var storedUser = await models.User.findOne({
            where: {
                id: req.user.id
            }
        });

        if (storedUser !== null) {
            await models.User.update({
                password: typeof req.body.password !== 'undefined' ? passwordHash(req.body.password) : storedUser.password,
                displayname: req.body.displayname
            }, {
                where: {
                    id: req.user.id
                }
            });

            var updateddUser = await models.User.findOne({
                where: {
                    id: req.user.id
                }
            });

            // console.log('updateddUser: ');
            // console.log(updateddUser);
            // console.log('req.user: ');
            // console.log(req.user);
            
            req.login(updateddUser.dataValues, (err) => {
                if (err) {
                    console.log(err);
                    return res.send('<script>alert("ERROR");\location.href="/";</script>');
                }
                return res.send('<script>alert("성공적으로 수정되었습니다.");\location.href="/";</script>');
            });
            
        } else {
            res.send('<script>alert("ERROR - 유효하지 않은 계정입니다.");\location.href="/";</script>');
        }

    } catch(e) {
        console.log(`mypage/edit error - ${e}`);
    }
});

module.exports = router;