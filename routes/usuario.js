const expres = require('express');
const router = expres.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
require('../models/Usuario');
const Usuario = mongoose.model('usuarios');

router.get('/add', (req, res) => {
    res.render('usuario/add');
});

router.post('/create', (req, res) => {
    erros = [];
    if (!req.body.uname || typeof req.body.uname == undefined || req.body.uname == null) {
        erros.push({
            nome: 'Nome de utilizador inválido'
        });
    }
    if (!req.body.pw1 || typeof req.body.pw1 == undefined || req.body.pw1 == null) {
        erros.push({
            nome: 'Palavra passe inválida'
        })
    } else if (req.body.pw1.length < 8) {
        erros.push({
            nome: 'A palavra passe deve ter no minímo 8 caracteres'
        })
    }

    if (req.body.pw1 != req.body.pw2) {
        erros.push({
            nome: 'As palavras passe não combinam'
        });
    }

    if (erros.length > 0) {
        res.render('usuario/add', {
            erros: erros
        })
    } else {


        Usuario.findOne({
            email: req.body.email
        }).then((usuario) => {
            if (usuario) {
                req.flash('error_msg', 'Já existe uma conta com este email no nosso sistema');
                res.redirect('/usuario/add');
            } else {
                const newUsuario = new Usuario({
                    nome: req.body.uname,
                    email: req.body.email,
                    senha: req.body.pw1
                });

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(newUsuario.senha, salt, (erro, hash) => {
                        if (erro) {
                            req.flash('error_msg', 'Erro ao gerar o senha');
                            res.redirect('/usuario/add');
                        } else {
                            newUsuario.senha = hash;
                            newUsuario.save().then((usuario) => {
                                req.flash('success_msg', 'Utilizador criado com sucesso!');
                                res.redirect('/usuario/login');
                            }).catch((erro) => {
                                req.flash('error_msg', 'Erro ao criar a conta, tente novamente!');
                                res.redirect('/usuario/add');
                            });
                        }
                    });
                });

            }
        }).catch((erro) => {
            req.flash('error_msg', 'Erro interno, consulte seu administrador');
            res.redirect('/usuario/add');
        })
    }
})

router.get('/login', (req, res) => {
    res.render('usuario/login');
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/usuario/login',
        failureFlash: true
    })(req, res, next);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Saiste com sucesso');
    res.redirect('/');
})

module.exports = router;