const models = require('../../models');

exports.get_join = (req, res) => {
    res.render('accounts/join.html');
}

exports.post_join = async (req, res) => {
    try {
        const duplicatedUsername = await models.User.findOne({
            where: {
                username: req.body.username
            }
        });

        if (duplicatedUsername !== null) {
            res.render('accounts/join.html', {
                flashMessage: '중복된 아이디입니다.',
                informed: req.body
            });
            return;
        }

        const duplicatedDisplayname = await models.User.findOne({
            where: {
                displayname: req.body.displayname
            }
        });

        if (duplicatedDisplayname !== null) {
            res.render('accounts/join.html', {
                flashMessage: '중복된 닉네임입니다.',
                informed: req.body
            });
            return;
        }

        req.body.provider = 'camp15';
        await models.User.create(req.body);
        res.send('<script>alert("회원가입 성공");\location.href="/accounts/login";</script>');
        
    } catch(e) {

    }
}

exports.get_login = (req, res) => {
    res.render('accounts/login.html', { flashMessage: req.flash().error });
}

exports.post_login = (req, res) => {
    res.send('<script>alert("로그인 성공");location.href="/";</script>');
}

exports.get_logout = (req, res) => {
    req.logout();
    res.redirect('/accounts/login');
}
