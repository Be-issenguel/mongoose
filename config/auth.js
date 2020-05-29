const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('../models/Usuario');
const Usuario = mongoose.model('usuarios');

module.exports = function(passport) {
    passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'pw1'
    }, (email, senha, done) => {
        Usuario.findOne({
            email: email
        }).then((usuario) => {
            if (!usuario) {
                return done(null, false, {
                    message: 'Não existe utilizador com este email'
                })
            }
            bcrypt.compare(senha, usuario.senha, (erro, sucesso) => {
                if (sucesso) {
                    return done(null, usuario);
                } else {
                    return done(null, false, {
                        message: 'Credencias Inválidas'
                    });
                }
            });
        })
    }));

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    })

    passport.deserializeUser((id, done) => {
        Usuario.findById(id, (erro, usuario) => {
            done(erro, usuario);
        })
    })
}