var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var app = express();

// Configuracion del servidor   
    
    app.set('port', (process.env.PORT || 5000));

	app.listen(app.get('port'), function() {
	  console.log("Servidor configurado por puerto: "+app.get('port'));
	});

    // localizacion de los ficheros estaticos
    app.use(express.static(__dirname + '/client'));

	
	console.log('-----------------------------------------------');
	console.log('-----------------------------------------------');
	console.log('-----------------------------------------------');
	
    

// Conexion con la base de datos

/****************************************************************************/
/****************************************************************************/
/********************* CONEXION A LA BASE DE DATOS **************************/

var mongoose = require('mongoose');


// DATABASE

    // local

	/*
     mongoose.connect('mongodb://localhost/explorando_db', function(error){
		   if(error){
			  throw error; 
		   }else{
			  console.log('Conectado a MongoDB local');
       }
		  }); 
	
	*/
	
    mongoose.connect('mongodb://admin:admin@ds019058.mlab.com:19058/explorando_db', function(error){
       if(error)
	   {
          mongoose.connect('mongodb://localhost/explorando_db', function(error){
		   if(error){
			  throw error; 
		   }else{
			  console.log('Conectado a MongoDB local');
       }
		  }); 		  
       }else{ 
          console.log('Conectado a MongoDB web');
       }
    });
	

/****************** Peticiones a la base de datos **************************************/

	require('./modelos/peticiones/Ruta.js')(app);
	require('./modelos/peticiones/Usuarios.js')(app);
	require('./modelos/peticiones/Comentarios.js')(app);
	require('./modelos/peticiones/Reservas.js')(app);
	require('./modelos/peticiones/Twitter.js')(app);
	require('./modelos/peticiones/FotosRuta.js')(app);
	require('./modelos/peticiones/Paypal.js')(app);
	

	