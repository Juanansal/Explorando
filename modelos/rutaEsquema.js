var mongoose = require('mongoose');

 var RutaSchema = new mongoose.Schema({
        titulo: String,
        descripcion: String,
        fecha: Date,
		hora: String,
		fechaReg: Date,
		duracion: String,
		inicio: String,
		llegada: String,
		capacidad: Number,
		apuntados: Number,
		guia: String,      // Usuario que creo la ruta
		precio: String,
		inicioC: Object,   // Coordenada de inicio
		wpC: Object,       // Vector con las coordenadas de los puntos intermedios
		llegadaC: Object,  // Coordenada del final
		loc: { type: [Number], index: '2d' }
		                   // Tipo de dato que mos permite realizar busquedas geolocalizadas
 });
	
    module.exports = mongoose.model('Ruta', RutaSchema);

	