var mongoose = require('mongoose');

    var FotosRutaSchema = new mongoose.Schema({
        url: String,
		idRuta: String,
		fecha: String
    });
	
    module.exports = mongoose.model('FotosRuta', FotosRutaSchema);