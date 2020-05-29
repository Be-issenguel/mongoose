const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
require('../models/Postagem');
const Categoria = mongoose.model('categorias');
const Postagem = mongoose.model('postagens');


router.get('/index', (req, res) => {
    Postagem.find().populate('categoria').sort({
        data: "desc"
    }).then((postagens) => {
        res.render('postagem/index', {
            postagens: postagens
        });
    }).catch(() => {
        req.flash('error_msg', 'Erro encontrar as postagens');
    })
})
router.get('/add', (req, res) => {
    Categoria.find().then((categorias) => {
        res.render('postagem/new', {
            categorias: categorias
        });
    })
});

router.post('/create', (req, res) => {
    var erros = [];
    if (!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) {
        erros.push({
            nome: 'Titulo inválido'
        });
    } else if (req.body.titulo.length < 5) {
        erros.push({
            nome: 'O titulo deve ter no mínimo 5 caracteres'
        });
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({
            nome: 'Slug inválido'
        });
    }
    if (erros.length > 0) {
        res.render('postagem/new', {
            erros: erros
        });
    } else {
        new Postagem({
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            categoria: req.body.categoria
        }).save().then(() => {
            req.flash('success_msg', 'Post salvo com sucesso');
            res.redirect('/postagem/index');
        }).catch(() => {
            req.flash('error_msg', 'Erro ao salvar o post, tente novamente');
            res.redirect('/postagem/add');
        })
    }
})

router.get('/edit/:id', (req, res) => {
    Postagem.findById(req.params.id).then((postagem) => {
        Categoria.find().then((categorias) => {
            res.render('postagem/edit', {
                postagem: postagem,
                categorias: categorias
            })
        });
    }).catch(() => {
        req.flash('error_msg', 'Post não encontrado, por favor tente novamente!');
        res.redirect('/postagem/index');
    })
});

router.post('/update', (req, res) => {
    Postagem.findById(req.body.id).then((postagem) => {
        postagem.titulo = req.body.titulo;
        postagem.slug = req.body.slug;
        postagem.descricao = req.body.descricao;
        postagem.categoria = req.body.categoria;
        postagem.save().then(() => {
            req.flash('success_msg', 'Post actualizado com sucesso');
            res.redirect('/postagem/index');
        }).catch(() => {
            req.flash('error_msg', 'Erro ao actualizar o post, por favor tente novamente!');
            res.redirect('/postagem/index');
        })
    }).catch(() => {
        req.flash('error_msg', 'Erro! post não encontrado');
        res.redirect('/postagem/index');
    })
});

router.get('/delete/:id', (req, res) => {
    Postagem.deleteOne({
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg', 'Post removido com sucesso!');
        res.redirect('/postagem/index');
    }).catch(() => {
        req.flash('error_msg', 'Erro ao remover o post');
        res.redirect('/postagem/index');
    })
});

module.exports = router;