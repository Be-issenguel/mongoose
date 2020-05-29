const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
const Categoria = mongoose.model('categorias');

router.get('/index', (req, res) => {
    Categoria.find().then((categorias) => {
        res.render('categoria/index', {
            categorias: categorias,
        })
    }).catch((erro) => {
        console.log('Erro ao buscar as categorias: ' + erro);
    })
});

router.get('/add', (req, res) => {
    res.render('categoria/new');
});

router.post('/save', (req, res) => {
    var erros = [];
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({
            nome: 'Nome inválido'
        });
    } else if (req.body.nome.length < 5) {
        erros.push({
            nome: 'O nome deve ter pelo menos 5 caracteres'
        });
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({
            nome: 'Slug inválido'
        });
    }

    if (erros.length > 0) {
        res.render('categoria/new', {
            erros: erros
        });
    } else {
        new Categoria({
            nome: req.body.nome,
            slug: req.body.slug,
        }).save().then(() => {
            req.flash('success_msg', 'Categoria salva com sucesso!');
            res.redirect('/categoria/index');
        }).catch(() => {
            req.flash('error_msg', 'Erro ao salvar a categoria');
        });
    }
});

router.get('/show/:id', (req, res) => {
    Categoria.findById(req.params.id).then((categoria) => {
        res.render('categoria/edit', {
            categoria: categoria
        })
    }).catch(() => {
        req.flash('error_msg', 'Erro ao pesquisar a categoria, tente novamente');
        res.redirect('/categoria/index');
    })
});

router.post('/update', (req, res) => {
    var erros = [];
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({
            nome: 'Nome inválido'
        });
    } else if (req.body.nome.length < 5) {
        erros.push({
            nome: 'O nome deve ter pelo menos 5 caracteres'
        });
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({
            nome: 'Slug inválido'
        });
    }
    if (erros.length > 0) {
        res.render('categoria/show', {
            erros: erros
        });
    } else {
        Categoria.findById(req.body.id).then((categoria) => {
            categoria.nome = req.body.nome;
            categoria.slug = req.body.slug;
            categoria.save().then(() => {
                req.flash('success_msg', 'Categoria actualizada com sucesso!');
                res.redirect('/categoria/index');
            }).catch(() => {
                req.flash('error_msg', 'Erro ao actualizar a categoria');
                res.redirect('/categoria/show' + req.body.id);
            })
        }).catch(() => {
            req.flash('error_msg', 'Categoria não encontrada');
            res.redirect('/categoria/index');
        })
    }

});

router.get('/delete/:id', (req, res) => {
    Categoria.remove({
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg', 'Categoria removida com sucesso!');
        res.redirect('/categoria/index');
    }).catch(() => {
        req.flash('error_msg', 'Erro ao remover a categoria');
        res.redirect('/categoria/index');
    });
});

module.exports = router;