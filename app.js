const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const {
    allowInsecurePrototypeAccess
} = require('@handlebars/allow-prototype-access');
const routerPostagem = require('./routes/postagem');
const routerCategoria = require('./routes/categoria');
const routerUsuario = require('./routes/usuario');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('./config/auth')(passport)
require('./models/Postagem');
const {
    eAdmin
} = require('./helpers/eAdmin');
const Postagem = mongoose.model('postagens');

const path = require('path');
const app = express();
const PORTA = 3000;
//conexao
mongoose.connect('mongodb://localhost/teste').then(() => {
    console.log('Conectado com sucesso');
}).catch((erro) => {
    console.log('Erro na conexão: ' + erro);
});
//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
//handlebars
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(handlebars)
}));
app.set('view engine', 'handlebars');
//arquivos publicos
//sessão
app.use(session({
    secret: 'node-mongoose',
    resave: true,
    saveUninitialized: true,
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())
    //Middlewares

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})
app.use(express.static(path.join(__dirname, 'public')));
//Rotas

app.get('/', (req, res) => {
    Postagem.find().populate('categoria').sort({
        data: "desc"
    }).then((postagens) => {
        res.render('home', {
            postagens: postagens
        });
    }).catch(() => {
        req.flash('error_msg', 'Erro encontrar as postagens');
    });
})
app.use('/postagem', eAdmin, routerPostagem);
app.use('/categoria', routerCategoria);
app.use('/usuario', routerUsuario);

app.listen(PORTA, () => {
    console.log(`Aceda a aplicação em http://localhost:${PORTA}`);
})