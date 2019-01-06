
var Comentario = require('../comentarioEsquema');


module.exports = function(app)
{


	/*
		/comentarios/listar
		Devuelve todos las comentarios de la base de datos en un vector 
		
		Parametros -> X
		Devuelve   -> Vector
		
		OK    -> Devuelve un vector con el listado de los comentarios
		ERROR 1 -> Error al acceder a la base de datos
	*/
    app.get('/comentarios/listar', function(req, res){
        Comentario.find({}, function(error, comentarios){
            if(error){
				console.log('ERROR - Listado de comentarios fallado');
                res.send('1');				
            }else{
                res.send(comentarios); 
				//console.log('OK - Listado de comentarios');
            }
       })
    });
	
	
	
	
	/*
		/comentarios/recuperar_comentario_por_id
		Devuelve el comentario con la id pasada por parametro
	
		Parametros -> _id
		Devuelve   -> json con todos los datos del comentario
	
		OK      -> Devuelve un json con los datos del comentario pasado por parametro
		ERROR 1 -> Error al acceder a la base de datos
	*/
    app.get('/comentarios/recuperar_comentario_por_id', function(req, res){
        Comentario.findById(req.query._id, function(error, resultado){
            if(error){
				console.log('ERROR - Error al recuperar el comentario: '+req.query._id);
                res.send('1');
            }else{
				console.log('OK - Comentario de '+resultado.usuarioCom+' recuperado');
                res.send(resultado);
            }
       });
    });

	
	

	/*
		/comentarios/guardar
		Guarda el comentario con los datos pasados por parametro
	
		Parametros -> usuarioCom, nombreUsuarioCom, rutaCom, comentario, fecha, _id(opc)
		Devuelve   -> 0 (Todo OK) 
	
		OK    0 -> Comentario guardado correctamente
		ERROR 1 -> Error al guardar el nuevo comentario
		ERROR 2 -> Error al buscar el comentario por la _id
		ERROR 3 -> Error al modificar el comentario
	*/
    app.post('/comentarios/guardar', function(req, res){
        if(req.query._id == null){
            //Inserta
            var comentario = new Comentario({
               usuarioCom: req.query.usuarioCom,
			   nombreUsuarioCom: req.query.nombreUsuarioCom,
               rutaCom: req.query.rutaCom,
			   url: req.query.url,
               comentario: req.query.comentario,
               fecha: req.query.fecha
            });
            comentario.save(function(error, resultado){
                if(error){
					console.log('ERROR - El comentario no se ha guardado correctamente');
                    res.send('1');
                }else{
					console.log('OK - Comentario de '+resultado.usuarioCom+' guardado correctamente');
                    res.send('0');
                }
            });
        }else{
            //Modifica
            Comentario.findById(req.query._id, function(error, resultado){
                if(error){
                    console.log('ERROR - El comentario no se ha guardado correctamente (Modificar)');
					res.send('2');
                }else{
                    var comentario = resultado;
                    comentario.usuarioCom = req.query.usuarioCom,
					comentario.nombreUsuarioCom = req.query.nombreUsuarioCom,
                    comentario.rutaCom = req.query.rutaCom,
					comentario.url = req.query.url,
                    comentario.comentario = req.query.comentario,
                    comentario.fecha = req.query.fecha,
                    comentario.save(function(error, resultado){
                        if(error){
                            res.send('3');
							console.log('ERROR - El comentario no se ha guardado correctamente (Modificar)');
                        }else{ 
                            res.send('0');
							console.log('OK - Comentario de '+comentario.usuarioCom+ ' modificado correctamente');
                        }
                    });
                }
            });
        }
    });

	
	
	/*
		/comentarios/eliminar
		Elimina el comentario de la base de datos con el _id pasado por parametro
	
		Parametros -> _id
		Devuelve   -> 0 (Todo OK) 
	
		OK    0 -> Comentario eliminado correctamente
		ERROR 1 -> Error al intentar eliminar el comentario
	*/
	
    app.post('/comentarios/eliminar', function(req, res){
        Comentario.remove({_id: req.query._id}, function(error){
            if(error){
                res.send('1');
				console.log('ERROR - El comentario no se ha eliminado');
            }else{
				console.log('OK - Comentario eliminado correctamente');
                res.send('0');
            }
       });
    });
	
	
	
	
	
	/*
		/comentarios/listarComentariosPorRuta
		Devuelve todos los comentarios que coincida con la ruta pasada por parametro
	
		Parametros -> rutaCom
		Devuelve   -> Vector 
	
		OK      -> Devuelve un vector con el listado de los comentarios
		ERROR 1 -> Parametro rutaCom no recibido
		ERROR 2 -> Error al acceder a la base de datos
	*/
	
	app.get('/comentarios/listarComentariosPorRuta', function(req, res){
		
		if(req.query.rutaCom == null)
		{
			console.log('ERROR - Parametro rutaCom no recibido');
			res.send('1');
		}
		else
		{
			Comentario.find({rutaCom: req.query.rutaCom}, function(error, comentarios){
				if(error){
					console.log('ERROR - Listado de comentarios fallado');
					res.send('2');				
				}else{
					res.send(comentarios); 
					console.log('OK - Listado de comentarios de ruta realizado');
				}
            })
		}
    });
	
	
	
	
	
	
}

	

