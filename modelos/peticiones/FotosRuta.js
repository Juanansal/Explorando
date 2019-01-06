var FotosRuta = require('../fotosRutaEsquema');

var express = require('express');

var bodyParser = require('body-parser');
var multer  = require('multer');
var upload = multer({ dest: 'client/imagenes/fotosRuta/' });
var fs = require('fs');

module.exports = function(app)
{


	/*
		/fotosRuta/listar
		Devuelve todos las fotos de las rutas de la base de datos en un vector 
		
		Parametros -> X
		Devuelve   -> Vector
		
		OK    -> Devuelve un vector con el listado de las fotos
		ERROR 1 -> Error al acceder a la base de datos
	*/
    app.get('/fotosRuta/listar', function(req, res){
        FotosRuta.find({}, function(error, fotos){
            if(error){
				console.log('ERROR - Listado de fotos de ruta fallado');
                res.send('1');				
            }else{
                res.send(fotos); 
            }
       })
    });
	
	
	
	
	/*
		/fotosRuta/recuperar_fotoRuta_por_id
		Devuelve la foto con la id pasada por parametro
	
		Parametros -> _id
		Devuelve   -> json con todos los datos de la foto de ruta
	
		OK      -> Devuelve un json con los datos da la foto pasado por parametro
		ERROR 1 -> Error al acceder a la base de datos
	*/
    app.get('/fotosRuta/recuperar_fotoRuta_por_id', function(req, res){
        FotosRuta.findById(req.query._id, function(error, resultado){
            if(error){
				console.log('ERROR - Error al recuperar la foto de la ruta: '+req.query._id);
                res.send('1');
            }else{
				console.log('OK - Foto de recuperada');
                res.send(resultado);
            }
       });
    });
	
	
	
	
	
	/*
		/fotosRuta/recuperarFotoRutaPorIdRuta
		Devuelve la foto con la id de ruta pasada por parametro
	
		Parametros -> idRuta
		Devuelve   -> json con todos los datos de las fotos de ruta
	
		OK      -> Devuelve un json con los datos de las fotos perteneciente a la idRuta pasada ppor parametro
		ERROR 1 -> Parametros no recibidos
		ERROR 2 -> Error al acceder a la base de datos
	*/
	app.get('/fotosRuta/recuperarFotoRutaPorIdRuta', function(req, res)
	{	
		if(req.query.idRuta != null)
		{	
	
			FotosRuta.find({idRuta: req.query.idRuta}, function(error, resultado){
				if(error){
					console.log('ERROR - Error al recuperar la foto de la ruta: '+req.query._id);
					res.send('2');
				}else{
					console.log('OK - Foto de recuperada');
					console.log(resultado);
					res.send(resultado);
				}
		   });
	   
	    }
		else
		{
			res.send('1')
		}
    });

	
	

	/*
		/fotosRuta/guardar
		Guarda el comentario con los datos pasados por parametro
	
		Parametros -> url, idRuta, _id(opc)
		Devuelve   -> 0 (Todo OK) 
	
		OK    0 -> Foto de Ruta guardada correctamente
		ERROR 1 -> Error al guardar la nueva foto de Ruta
		ERROR 2 -> Error al buscar el la foto por _id
		ERROR 3 -> Error al modificar los datos de la foto
	*/
    app.post('/fotosRuta/guardar', function(req, res){
        if(req.query._id == null){
            //Inserta
			
			var fecha = new Date();
			
            var fotoRuta = new FotosRuta({
               url: req.query.url,
			   idRuta : req.query.idRuta,
			   fecha: fecha
			   
            });
            fotoRuta.save(function(error, resultado){
                if(error){
					console.log('ERROR - La foto no se guaradado correctamente');
                    res.send('1');
                }else{
					console.log('OK - Foto guardada correctamente');
                    res.send('0');
                }
            });
        }else{
            //Modifica
            FotosRuta.findById(req.query._id, function(error, resultado){
                if(error){
                    console.log('ERROR - Los datos de la foto no se han guardado correctamente (Modificar)');
					res.send('2');
                }else{
                    var fotoRuta = resultado;
                    fotoRuta.url = req.query.url,
					fotoRuta.idRuta = req.query.idRuta,
                    fotoRuta.save(function(error, resultado){
                        if(error){
                            res.send('3');
							console.log('ERROR - Lo datos de la foto de ruta no se ha guardado correctamente (Modificar)');
                        }else{ 
                            res.send('0');
							console.log('OK - Foto de ruta de modificada correctamente');
                        }
                    });
                }
            });
        }
    });

	
	
	/*
		/fotosRuta/eliminar
		Elimina la foto de ruta de la base de datos con el _id pasado por parametro
	
		Parametros -> _id
		Devuelve   -> 0 (Todo OK) 
	
		OK    0 -> Foto de ruta eliminado correctamente
		ERROR 1 -> Error al intentar eliminar la foto de la ruta
	*/
	
    app.post('/fotosRuta/eliminar', function(req, res){
        FotosRuta.remove({_id: req.query._id}, function(error){
            if(error){
                res.send('1');
				console.log('ERROR - La foto de ruta no se ha eliminado');
            }else{
				console.log('OK - Foto de ruta eliminada correctamente');
                res.send('0');
            }
       });
    });
	
	
	
	/*
		/fotosRuta/subirFotosRuta
		Sube al servidor la foto pasada por el parametro file del formulario
	
		Parametros -> file
		Devuelve   -> redireccion a gestionarRutas.html 
	
		OK      -> redirige a gestionarRutas.html
		ERROR 1 -> Foto no guardada correctamente
	*/
	
    app.post('/fotosRuta/subirFotosRuta', upload.single('foto'), function(req, res)
	{
        
        console.log(req);  
		
		if(req.file)
		  {
			  console.log('HOLAAAAAAAAAAAAAAAAAAAAA');
			  
			  var foto = req.file;
			  console.log('Pasa por aqui');
			  
			  // Recoje los datos del tipo de archivo y extensiones
			  var aux = foto.mimetype.split("/");
			  var tipo = aux[0];
			  
			  if(tipo == 'image')
			    {
					var fecha = new Date();
					
					var fotoRuta = new FotosRuta({
					   url: 'imagenes/fotosRuta/'+foto.filename,
					   idRuta : req.body._id,
					   fecha: fecha
					   
					});
					fotoRuta.save(function(error, resultado){
						if(error){
							console.log('ERROR - La foto no se guaradado correctamente');
						}else{
							console.log('OK - Foto guardada correctamente');
						}
					});
					
					
				}
		  }
		
		
		
		res.writeHead(302, {'Location': '/gestionarRutas.html'});
		res.end();
     
    });
	
}	




