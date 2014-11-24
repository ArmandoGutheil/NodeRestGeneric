var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CervejaSchema   = new Schema({
	marca: String	
});

module.exports = mongoose.model('Cerveja', CervejaSchema);