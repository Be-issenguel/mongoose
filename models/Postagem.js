const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Postagem = new Schema({
    titulo: {
        type: String,
        require: true,
    },
    slug: {
        type: String,
        require: true,
    },
    descricao: {
        type: String,
        require: true,
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'categorias',
        require: true,
    },
    data: {
        type: Date,
        require: true,
        default: Date.now()
    }
});

mongoose.model('postagens', Postagem);