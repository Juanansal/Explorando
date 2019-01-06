
var Reserva = require('../reservaEsquema');


module.exports = function(app)
{


	/*
		/reservas/listar
		Devuelve todas las reservas de la base de datos en un vector 
		
		Parametros -> X
		Devuelve   -> Vector
		
		OK    -> Devuelve un vector con el listado de las reservas
		ERROR 1 -> Error al acceder a la base de datos
	*/
    app.get('/reservas/listar', function(req, res){
        Reserva.find({}, function(error, reservas){
            if(error){
				console.log('ERROR - Listado de reservas fallado');
                res.send('1');				
            }else{
                res.send(reservas); 
				//console.log('OK - Listado de reservas');
            }
       })
    });
	
	
	/*
		/reservas/listarReservasPorUsuario
		Devuelve todas las reservas de la base de datos en un vector del usuario pasado por parametro
		
		Parametros -> usuario
		Devuelve   -> Vector
		
		OK    -> Devuelve un vector con el listado de las reservas
		ERROR 1 -> Error al acceder a la base de datos
		ERROR 2 -> Parametro no recibido
	*/
    app.get('/reservas/listarReservasPorUsuario', function(req, res){
		
		if(req.query.usuario!=null)
		{	
			Reserva.find({usuarioRes: req.query.usuario}, function(error, reservas){
				if(error){
					console.log('ERROR - Listado de reservas fallado');
					res.send('1');				
				}else{
					
					//console.log(reservas);
					res.send(reservas); 
					console.log('OK - Listado de reservas por usuario');
				}
		   })		   
		}
		else
		{
			console.log('ERROR - Falta parametro usuario');
			res.send('2');
		}
    });
	
	
	
	/*
		/reservas/listarReservasPorRuta
		Devuelve todas las reservas de la base de datos en un vector de la ruta pasado por parametro
		
		Parametros -> idRuta
		Devuelve   -> Vector
		
		OK    -> Devuelve un vector con el listado de las reservas
		ERROR 1 -> Error al acceder a la base de datos
		ERROR 2 -> Parametro no recibido
	*/
    app.get('/reservas/listarReservasPorRuta', function(req, res){
		
		if(req.query.idRuta!=null)
		{	
			Reserva.find({rutaRes: req.query.idRuta}, function(error, reservas){
				if(error){
					console.log('ERROR - Listado de reservas fallado');
					res.send('1');				
				}else{
					
					//console.log(reservas);
					res.send(reservas); 
					console.log('OK - Listado de reservas por usuario');
				}
		   })		   
		}
		else
		{
			console.log('ERROR - Falta parametro usuario');
			res.send('2');
		}
    });
	
	
	
	
	
	/*
		/reservas/listarReservasPorGuia
		Devuelve todas las reservas de la base de datos en un vector del guia pasado por parametro
		
		Parametros -> guia
		Devuelve   -> Vector
		
		OK    -> Devuelve un vector con el listado de las reservas
		ERROR 1 -> Error al acceder a la base de datos
		ERROR 2 -> Parametro no recibido
	*/
    app.get('/reservas/listarReservasPorGuia', function(req, res){
		
		if(req.query.guia!=null)
		{	
			Reserva.find({guia: req.query.guia}, function(error, reservas){
				if(error){
					console.log('ERROR - Listado de reservas fallado');
					res.send('1');				
				}else{
					
					//console.log(reservas);
					res.send(reservas); 
					console.log('OK - Listado de reservas por usuario');
				}
		   })		   
		}
		else
		{
			console.log('ERROR - Falta parametro usuario');
			res.send('2');
		}
    });
	
	
	
	
	
	
	/*
		/reservas/recuperar_reserva_por_id
		Devuelve la reserva con la id pasada por parametro
	
		Parametros -> _id
		Devuelve   -> json con todos los datos de la reserva
	
		OK      -> Devuelve un json con los datos de la reserva pasado por parametro
		ERROR 1 -> Error al acceder a la base de datos
	*/
    app.get('/reservas/recuperar_reserva_por_id', function(req, res){
        Reserva.findById(req.query._id, function(error, resultado){
            if(error){
				console.log('ERROR - Error al recuperar la reserva: '+req.query._id);
                res.send('1');
            }else{
				console.log('OK - Reserva de '+resultado.usuarioRes+' recuperada');
                res.send(resultado);
            }
       });
    });

	
	

	/*
		/reservas/guardar
		Guarda la reserva con los datos pasados por parametro
	
		Parametros -> rutaRes, usuarioRes, fecha, puntuacion, _id(opc)
		Devuelve   -> 0 (Todo OK) 
	
		OK    0 -> Reserva guardada correctamente
		ERROR 1 -> Error al guardar la nueva reserva
		ERROR 2 -> Error al buscar la reserva por la _id
		ERROR 3 -> Error al modificar la reserva
	*/
    app.post('/reservas/guardar', function(req, res){
        if(req.query._id == null){
            //Inserta
			var fechaReg = new Date();
			
            var reserva = new Reserva({
               rutaRes: req.query.rutaRes,
			   guia: req.query.guia,
               usuarioRes: req.query.usuarioRes,
               fecha: fechaReg,
               puntuacion: req.query.puntuacion,
			   precio: req.query.precio
            });
            reserva.save(function(error, resultado){
                if(error){
					console.log('ERROR - La reserva no se ha guardado correctamente');
                    res.send('1');
                }else{
					console.log('OK - Reserva de '+resultado.usuarioRes+' guardada correctamente');
                    res.send('0');
                }
            });
        }else{
            //Modifica
            Reserva.findById(req.query._id, function(error, resultado){
                if(error){
                    console.log('ERROR - La reserva no se ha guardado correctamente (Modificar)');
					res.send('2');
                }else{
                    var reserva = resultado;
                    reserva.rutaRes = req.query.rutaRes,
					reserva.guia = req.query.guia,
                    reserva.usuarioRes = req.query.usuarioRes,
                    reserva.puntuacion = req.query.puntuacion,
					reserva.precio = req.query.precio,
                    reserva.save(function(error, resultado){
                        if(error){
                            res.send('3');
							console.log('ERROR - La reserva no se ha guardado correctamente (Modificar)');
                        }else{ 
                            res.send('0');
							console.log('OK - Reserva de '+reserva.usuarioRes+ ' modificada correctamente');
                        }
                    });
                }
            });
        }
    });

	
	
	/*
		/reservas/eliminar
		Elimina la reserva de la base de datos con el _id pasado por parametro
	
		Parametros -> _id
		Devuelve   -> 0 (Todo OK) 
	
		OK    0 -> Reserva eliminada correctamente
		ERROR 1 -> Error al intentar eliminar la reserva
	*/
	
    app.post('/reservas/eliminar', function(req, res){
        Reserva.remove({_id: req.query._id}, function(error){
            if(error){
                res.send('1');
				console.log('ERROR - La reserva no se ha eliminado');
            }else{
				console.log('OK - Reserva eliminada correctamente');
                res.send('0');
            }
       });
    });
	
	
	
	
	/*
		/reservas/crearReservaUsuario
		Guarda la reserva con los datos pasados por parametro en la pagina de ruta, cuando un usuario solicita una ruta
	
		Parametros -> rutaRes, usuarioRes, precio, guia
		Devuelve   -> 0 (Todo OK) 
	
		OK    0 -> Reserva guardada correctamente
		ERROR 1 -> Error al guardar la nueva reserva
		ERROR 2 -> Parametros no recibidos
	*/
    app.post('/reservas/crearReservaUsuario', function(req, res){
            //Inserta
			
			if(req.query.rutaRes==null || req.query.usuarioRes==null)
			{
				res.send('2');
			}
			else
			{				
				var fechaReg = new Date();
		
				var reserva = new Reserva({
				   rutaRes: req.query.rutaRes,
				   guia: req.query.guia,
				   usuarioRes: req.query.usuarioRes,
				   fecha: fechaReg,
				   puntuacion: 0,
				   precio: req.query.precio
				});
				reserva.save(function(error, resultado){
					if(error){
						console.log('ERROR - La reserva no se ha guardado correctamente');
						res.send('1');
					}else{
						console.log('OK - Reserva de '+resultado.usuarioRes+' guardada correctamente');
						res.send('0');
					}
				});
			}
    });
	
	
	
	
	/*
		/reservas/puedeReservar
		Comprueba si el usuario puede realizar reservas de la ruta pasada por parametro
	
		Parametros -> rutaRes, usuarioRes
		Devuelve   -> 0 -> Si puede reservar, obj (_id) -> No puede reservar y devuelve un objeto con la _id
	
		OK    0       -> Si puede reservar
		OK    object(_id)  -> No puede reservar y devuelve un object con la _id de la reserva
		ERROR 1 -> Parametros no recibidos
		ERROR 2 -> Error al realizar la busqueda en la base de datos
	*/
	app.get('/reservas/puedeReservar', function(req, res){
       if(req.query.rutaRes==null || req.query.usuarioRes==null)
			{
				res.send('1');
			}
			else
			{
				Reserva.findOne({usuarioRes: req.query.usuarioRes, rutaRes: req.query.rutaRes}, function(error, resultado){
					if(error){
						console.log('ERROR - Error al realizar la busqueda en la base de datos: '+req.query.usuario);
						res.send('2');
					}else
					{
						
						if(resultado==null)
						{
							res.send('0');
							console.log('OK - Busqueda de '+req.query.usuario+' en puedeReservar correcta');
						}	
						else
						{
							var reserva = new Reserva({
							   _id: resultado._id,
							   puntuacion: resultado.puntuacion,
							});
							
							res.send(reserva);
							console.log('OK - Busqueda de '+req.query.usuario+' en puedeReservar correcta');						
						}
					}
				});
			}
    });
	
	
	
	/*
		/reservas/puedeVotar
		Comprueba si el usuario puede realizar votos en la ruta
	
		Parametros -> _id
		Devuelve   -> 0 -> Si puede votar, 1 No puede votar, 2 -> Ya ha votado
	
		OK    0 -> Si puede votar
		OK    1 -> No puede votar
		OK    2 -> Ya ha votado
		ERROR 3 -> Parametro _id no recibido
		ERROR 4 -> Error al realizar la busqueda en la base de datos
	*/
	app.get('/reservas/puedeVotar', function(req, res){
       if(req.query._id==null)
			{
				res.send('3');
			}
			else
			{
				Reserva.findById(req.query._id, function(error, resultado){
					if(error){
						console.log('ERROR - Error al realizar la busqueda en la base de datos');
						res.send('4');
					}else
					{						
						if(resultado==null)
						{
							res.send('1');
							console.log('Reserva no encontrada');
						}	
						else
						{	
							var fecha = new Date();
					
							if(resultado.puntuacion == '0')
							  {
								  res.send('0');
							  }
							else
							  {
								  res.send('2');
							  }						
						}
					}
				});
			}
    });
	
	
	/*
		/reservas/actualizarVoto
		Introduce en la base de datos el voto realizado por el usuario
	
		Parametros -> _id, num
		Devuelve   -> 0 -> OK
	
		OK    0 -> Actualizacion del voto en la base de datos realiazado correctamente
		ERROR 1 -> Parametros no recibidos
		ERROR 2 -> Error al realizar la peticion a la base de datos
		ERROR 3 -> Reserva no encontrada
		ERROR 4 -> La reserva no se ha guardado correctamente al insertar los datos en la db
	*/
	app.get('/reservas/actualizarVoto', function(req, res){
       if(req.query._id==null || req.query.num == null)
			{
				res.send('1');
			}
			else
			{
				Reserva.findById(req.query._id, function(error, resultado){
					if(error){
						console.log('ERROR - Error al realizar la busqueda en la base de datos');
						res.send('2');
					}else
					{						
						if(resultado==null)
						{
							res.send('3');
							console.log('Reserva no encontrada');
						}	
						else
						{						
							var reserva = resultado;
							reserva.puntuacion = req.query.num,
							reserva.save(function(error, resultado){
								if(error){
									res.send('4');
									console.log('ERROR - La reserva no se ha guardado correctamente al insertar los datos en la db');
								}else{ 
									res.send('0');
									console.log('OK - Reserva de '+reserva.usuarioRes+ ' modificada correctamente');
								}
							});						
						}
					}
				});
			}
    });
	
}

