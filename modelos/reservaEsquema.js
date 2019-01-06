var mongoose = require('mongoose');

    var ReservaSchema = new mongoose.Schema({
        rutaRes: String,
		guia: String,        // usuario guia que crea la ruta
        usuarioRes: String,  // usuario que se apunta a la ruta
        fecha: Date,
		puntuacion: String,  // Puntuacion que otorga el usuario a la ruta
		precio: Number       // Precio que ha pagado el usuario
    });
	
    module.exports = mongoose.model('Reserva', ReservaSchema);
	
	
	/*
		rutaRes: String,
        usuarioRes: String,
        fecha: String,
		puntuacion: String
	*/