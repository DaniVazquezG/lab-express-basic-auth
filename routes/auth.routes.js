const router = require('express').Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User.model');

const SALT_ROUNDS = 10;



router.get('/create', (req, res) => {
    res.render('auth/create');
});

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.get('/user', (req, res) => {
    const user = req.session.user;
    console.log(req.session);
    res.render('user/index', user);
});

router.post('/create', (req, res, next) => {
    const { username, password } = req.body;
    UserModel.create({ username, password })
        .then((user) => {
            console.log(user);
            res.render('auth/user', user);
        })
        .catch((err) => {
            next(err);
        });
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    UserModel.findOne({ username }).then((user) => {
        if (!user) {
            res.render('auth/login', {
                messageError: 'Usuario o contraseña incorrectos.',
            });
            return;
        }
        const verifyPass1 = bcrypt.compareSync(password, user.password);

        if (verifyPass1) {
            req.session.user = user;
            // res.render('auth/user', user);
            res.redirect('/auth/user');
        } else {
            res.render('auth/login', {
                messageError: 'Usuario o contraseña incorrectos.',
            });
        }
    });
});














module.exports = router;