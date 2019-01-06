var mongoose = require('mongoose');

    var ComentarioSchema = new mongoose.Schema({
        usuarioCom: String,
		nombreUsuarioCom: String,
        rutaCom: String,
		url: String,
        comentario: String,
        fecha: Date
    });
    module.exports = mongoose.model('Comentario', ComentarioSchema);
	
	
	/*
		usuarioCom: String,
        RutaCom: String,
        comentario: String,
        fecha: String
	*/