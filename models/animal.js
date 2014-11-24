var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AnimalSchema   = new Schema({
	raca: String	
});

module.exports = mongoose.model('Animal', AnimalSchema);