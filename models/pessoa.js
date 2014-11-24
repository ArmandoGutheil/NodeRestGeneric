var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PessoaSchema   = new Schema({
	nome: String,
	idade: Number,
	cidade: String
});

module.exports = mongoose.model('Pessoa', PessoaSchema);