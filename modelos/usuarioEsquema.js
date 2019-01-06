
var mongoose = require('mongoose');

    var UsuarioSchema = new mongoose.Schema({
		usuario: String,
		pass: String,
        nombre: String,
		apellidos: String,
		email: String,
		telefono: String,
		ciudad: String,
		esGuia: Boolean,
		esAdmin: Boolean,
		fechaReg: Date,			// Fecha registro	
		puntuacion: Number,     // Suma de las puntuaciones de las rutas que ha creado
		numeroVotos: Number,
		idTwitter: Number,      // nombre de usuario de Twitter
		tokenTwitter: String,   //tokens que nos proporciona twitter al hacer login
		tokenpTwitter: String,  
		urlFoto: String,        // url de la foto de Perfil utilizada
		saldo: Number
    });
	
    module.exports = mongoose.model('Usuario', UsuarioSchema);
	