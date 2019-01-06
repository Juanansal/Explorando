
var Ruta = require('../rutaEsquema');
var Reserva = require('../reservaEsquema');


module.exports = function(app)
{


	/*
		/rutas/listar
		Devuelve todas las rutas de la base de datos en un vector 
		
		Parametros -> X
		Devuelve   -> Vector
		
		OK    -> Devuelve un vector con el listado de las rutas
		ERROR 1 -> Error al acceder a la base de datos
	*/
    app.get('/rutas/listar', function(req, res){
        Ruta.find({}, function(error, rutas){
            if(error){
				console.log('ERROR - Listado de rutas fallado');
                res.send('1');				
            }else{
                res.send(rutas); 
				//console.log('OK - Listado de rutas');
            }
       })
    });


	
	
	
	
	
	/*
		/rutas/listarRutasPorGuia
		Devuelve todas las rutas de la base de datos en un vector del guia pasado por parametro
		Ademas segun la opcion, si es (1- Devuelve solo las rutas siguiente a la fecha actual,
								   	   2- Devuelve solo las rutas anteriores a la fecha actual
									   3- Todas)
		
		Parametros -> guia, opcion
		Devuelve   -> Vector
		
		OK    -> Devuelve un vector con el listado de las rutas
		ERROR 1 -> Parametros no recibidos
		ERROR 2 -> Error al acceder a la base de datos (opcion==1)
		ERROR 3 -> Error al acceder a la base de datos (opcion==2)
	*/
    app.get('/rutas/listarRutasPorGuia', function(req, res)
	{
		if(req.query.opcion == null ||req.query.guia == null)
		  {
			  console.log("Parametros no recibidos");
			  res.send('1');
		  }
		else
		  {
			var fechaActual = new Date();  
		
			if(req.query.opcion==1)
			{
				Ruta.find({'guia': req.query.guia, 'fecha':{$gte: fechaActual}}, function(error, rutas){
				if(error){
					console.log('ERROR - Listado de rutas fallado');
					res.send('2');				
				}else{
					res.send(rutas); 
					//console.log('OK - Listado de rutas');
				}
				})
			}
			
			if(req.query.opcion==2)
			{
				Ruta.find({'guia': req.query.guia, 'fecha':{$lt: fechaActual}}, function(error, rutas){
				if(error){
					console.log('ERROR - Listado de rutas fallado');
					res.send('3');				
				}else{
					res.send(rutas); 
					//console.log('OK - Listado de rutas');
				}
				})
			}
			
			if(req.query.opcion==3)
			{
				Ruta.find({'guia': req.query.guia}, function(error, rutas){
				if(error){
					console.log('ERROR - Listado de rutas fallado');
					res.send('3');				
				}else{
					res.send(rutas); 
					//console.log('OK - Listado de rutas');
				}
				})
			}
			
	     }
    });	
	
	
	
	
	
	
	/*
		/rutas/busquedaGeo
		Devuelve las rutas mas cercanas al punto indicado a una distancia pasada por parametro (por defecto 5km)
		
		Parametros -> coord, distancia(int)
		Devuelve   -> Vector
		
		OK    -> Devuelve un vector con el listado de las rutas
		ERROR 1 -> Error al acceder a la base de datos
	*/	
    app.get('/rutas/busquedaGeo', function(req, res){
		
		var aux = JSON.parse(req.query.coord);
		
		var coord = [];
		coord[0] = aux.lng;
		coord[1] = aux.lat;
		
        Ruta.find({loc: {$near: coord, $maxDistance: 0.05}}).limit(10).exec(function(error, rutas){
            if(error){
				console.log('ERROR - Listado de rutas fallado\n'+ error);
                res.send('1');				
            }else{
                res.send(rutas); 
				//console.log('OK - Listado de rutas');
            }
       })
    });	
	

	
	
	
	/*
		/rutas/recuperar_ruta_por_id
		Devuelve la ruta con la id pasada por parametro, si recbe una opcion(1- Devuelve solo las rutas siguiente a la fecha actual,
																			 2- Devuelve solo las rutas anteriores a la fecha actual)
	
		Parametros -> _id, opcion
		Devuelve   -> json con todos los datos de la ruta
	
		OK    -> Devuelve un json con los datos de la ruta pasada por parametro
		ERROR 1 -> Error al acceder a la base de datos (sin opcion)
		ERROR 2 -> Error al acceder a la base de datos (opcion 2)
		ERROR 3 -> Error al acceder a la base de datos (opcion 1)
		
	*/
    app.get('/rutas/recuperar_ruta_por_id', function(req, res)
	{
		if(req.query.opcion==null)
		{
			Ruta.findById(req.query._id, function(error, resultado)
			{
				if(error){
					console.log('ERROR - Error al recuperar la ruta: '+req.query._id);
					res.send('1');
				}else{
					console.log('OK - Ruta '+resultado.titulo+' recuperada');
					res.send(resultado);
				}
			});
		}
		else
		{
			fechaActual = new Date();

			if(req.query.opcion==2)
			  {	  
				  //Ruta.findById(req.query._id, {fecha:{$lt: fechaActual}}, function(error, resultado)
				  Ruta.findOne({_id: req.query._id, 'fecha':{$lt: fechaActual}}, function(error, resultado)
					{
						if(error){
							console.log('ERROR - Error al recuperar la ruta: '+req.query._id);
							res.send('2');
						}else{
							//console.log('OK - Ruta '+resultado.titulo+' recuperada');
							res.send(resultado);
						}
					});
			  }
			  
			if(req.query.opcion==1)
			  {	  
				  //Ruta.findById(req.query._id, {fecha:{$lt: fechaActual}}, function(error, resultado)
				  Ruta.findOne({_id: req.query._id, 'fecha':{$gte: fechaActual}}, function(error, resultado)
					{
						if(error){
							console.log('ERROR - Error al recuperar la ruta: '+req.query._id);
							res.send('3');
						}else{
							//console.log('OK - Ruta '+resultado.titulo+' recuperada');
							res.send(resultado);
						}
					});
			  }  
		}
		
		
        
    });

	
	
	
	
	
	/*
		/rutas/guardar
		Guarda la ruta con los datos pasados por parametro
	
		Parametros -> titulo, descripcion,fecha,hora,duracion,inicio,llegada,capacidad,apuntados,guia,precio,_id(opc)
		Devuelve   -> 0 (Todo OK) 
	
		OK    0 -> Ruta guardada correctamente
		ERROR 1 -> Error al guardar la nueva ruta
		ERROR 2 -> Error al buscar la ruta por la _id
		ERROR 3 -> Error al modificar la ruta
	*/
    app.post('/rutas/guardar', function(req, res){
        if(req.query._id == null){
            //Inserta nueva
			
			var fechaRegistro = new Date();
			
            var ruta = new Ruta({
               titulo: req.query.titulo,
               descripcion: req.query.descripcion,
               fecha: req.query.fecha,
			   fechaReg: fechaRegistro,
			   duracion: req.query.duracion,
			   inicio: req.query.inicio,
			   llegada: req.query.llegada,
			   capacidad: req.query.capacidad,
			   apuntados: req.query.apuntados,
			   guia: req.query.guia,
			   precio: req.query.precio
            });
            ruta.save(function(error, resultado){
                if(error){
					console.log('ERROR - La ruta no se ha guardado correctamente');
                    res.send('1');
                }else{
					console.log('OK - Ruta '+resultado.titulo+' guardada correctamente');
                    res.send('0');
                }
            });
        }else{
            //Modifica
            Ruta.findById(req.query._id, function(error, resultado){
                if(error){
                    console.log('ERROR - La ruta no se ha guardado correctamente (Modificar)');
					res.send('2');
                }else{
                    var ruta = resultado;
                    ruta.titulo = req.query.titulo,
                    ruta.descripcion = req.query.descripcion,
                    ruta.fecha = req.query.fecha,
					ruta.duracion = req.query.duracion,
					ruta.inicio = req.query.inicio,
					ruta.llegada = req.query.llegada,
					ruta.capacidad = req.query.capacidad,
					ruta.apuntados = req.query.apuntados,
					ruta.guia = req.query.guia,
					ruta.precio = req.query.precio,
                    ruta.save(function(error, resultado){
                        if(error){
                            res.send('3');
							console.log('ERROR - La ruta no se ha guardado correctamente (Modificar)');
                        }else{ 
                            res.send('0');
							console.log('OK - Ruta '+ruta.titulo+ ' modificado correctamente');
                        }
                    });
                }
            });
        }
    });

	
	
	
	
	
	
	
	/*
		/rutas/eliminar
		Elimina la ruta de la base de datos con el _id pasado por parametro
	
		Parametros -> _id
		Devuelve   -> 0 (Todo OK) 
	
		OK    0 -> Ruta eliminada correctamente
		ERROR 1 -> Error al intentar eliminar la ruta
	*/
    app.post('/rutas/eliminar', function(req, res){
        Ruta.remove({_id: req.query._id}, function(error){
            if(error)
			{
                res.send('1');
				console.log('ERROR - La ruta no se ha eliminado');
            }
			else
			{
				console.log('OK - Ruta eliminada correctamente');
                res.send('0');
            }
       });
    });
	



	/*
		/rutas/crearRuta
		Guarda la ruta con los datos pasados por parametro
	
		Parametros -> titulo, descripcion,fecha,hora,duracion,inicio,llegada,capacidad,apuntados,guia,precio,_id(opc)
		Devuelve   -> 0 (Todo OK) 
	
		OK    0 -> Ruta guardada correctamente
		ERROR 1 -> Error al guardar la nueva ruta
	*/
	app.post('/rutas/crearRuta', function(req, res){


			console.log(req.query.dibujado);

			var fechaRegistro = new Date();
			
			var aux = JSON.parse(req.query.inicioC);
			console.log('AUX: '+aux);
			console.log('AUX LAT: '+aux.lat);
			
			var coord = [];
			coord[0] = aux.lng;
			coord[1] = aux.lat;
			
			
            var ruta = new Ruta({
               titulo: req.query.titulo,
               descripcion: req.query.descripcion,
               fecha: req.query.fecha,
			   hora: req.query.hora,
			   fechaReg: fechaRegistro,
			   duracion: req.query.duracion,			   
			   inicio: req.query.inicio,
			   llegada: req.query.llegada,
			   capacidad: req.query.capacidad,
			   apuntados: 0,
			   guia: req.query.guia,
			   precio: req.query.precio,
			   inicioC: req.query.inicioC,
			   wpC: req.query.wpC,
			   llegadaC: req.query.llegadaC,
			   loc: coord
            });
            ruta.save(function(error, resultado){
                if(error){
					console.log('ERROR - La ruta no se ha guardado correctamente');
                    res.send('1');
                }else{
					console.log('OK - Ruta '+resultado.titulo+' guardada correctamente');
                    res.send('0');
                }
            });
    });

	
	/*
		/rutas/modificarRuta
		Modifica la ruta con los parametros y el id pasados
	
		Parametros -> titulo, descripcion,fecha,hora,duracion,inicio,llegada,capacidad,apuntados,guia,precio, _id
		Devuelve   -> 0 (Todo OK) 
	
		OK    0 -> Ruta guardada correctamente
		ERROR 1 -> Error al guardar la ruta modificada
		ERROR 2 -> Error al realizar la petición a la base de datos
	*/
	app.post('/rutas/modificarRuta', function(req, res){


			console.log(req.query.dibujado);

			var fechaRegistro = new Date();
			
			var aux = JSON.parse(req.query.inicioC);
			console.log('AUX: '+aux);
			console.log('AUX LAT: '+aux.lat);
			
			var coord = [];
			coord[0] = aux.lng;
			coord[1] = aux.lat;
			
			
			Ruta.findById(req.query._id, function(error, resultado){
                if(error){
                    console.log('ERROR - Error en la petición a la base de datos');
					res.send('2');
                }else{
                    var ruta = resultado;
                    ruta.titulo = req.query.titulo,
                    ruta.descripcion = req.query.descripcion,
                    ruta.fecha = req.query.fecha,
					ruta.hora = req.query.hora,
					ruta.duracion = req.query.duracion,
					ruta.inicio = req.query.inicio,
					ruta.llegada = req.query.llegada,
					ruta.capacidad = req.query.capacidad,
					ruta.apuntados = req.query.apuntados,
					ruta.guia = req.query.guia,
					ruta.precio = req.query.precio,
					ruta.inicioC = req.query.inicioC,
					ruta.wpC = req.query.wpC,
					ruta.llegadaC = req.query.llegadaC,
					ruta.loc = coord,
                    ruta.save(function(error, resultado){
                        if(error){
                            res.send('1');
							console.log('ERROR - La ruta no se ha guardado correctamente (Modificar)');
                        }else{ 
                            res.send('0');
							console.log('OK - Ruta '+ruta.titulo+ ' modificado correctamente');
                        }
                    });
                }
            });
			
    });	

	
	
	
	/*
		/rutas/actualizarApuntados
		Modifica el numero de apuntados sumando o restando dependiendo de los parametros
	
		Parametros -> opcion  (1- Sumar, 2- Restar), num, _id
		Devuelve   -> 0 (Todo OK Sumar) o 1 (Todo OK Restar)
	
		OK    0 -> Apuntados actualizado correctamente
		ERROR 1 -> Parametros no recibidos
		ERROR 2 -> Error al realizar la petición a la base de datos
		ERROR 3 -> Ruta llena
		ERROR 4 -> Error al insertar los nuevos datos en la bse de datos
	*/
	app.post('/rutas/actualizarApuntados', function(req, res){

			if(req.query.opcion == null && req.query.num == null && req.query._id == null)
			{
				console.log('ERROR - Parametros en actualizarApuntados no recibidos');
				res.send('1');
			}	
			else
			{
				Ruta.findById(req.query._id, function(error, resultado){
                if(error)
					{
						console.log('ERROR - Error en la petición a la base de datos');
						res.send('2');
					}
					else
					{					
						console.log(resultado);
						var aux = parseInt(resultado.apuntados);
						
						console.log('ANTES: '+aux);
						
						if (req.query.opcion==1)					
							aux = aux+parseInt(req.query.num);
						if (req.query.opcion==2)			
							aux = aux-parseInt(req.query.num);
						console.log('DESPUES: '+aux);

						
						if(aux> parseInt(resultado.capacidad))
						{
							res.send('3');
						}
						else
						{
							var ruta = resultado;
							ruta.apuntados = aux,
							
							ruta.save(function(error, resultado){
								if(error){
									res.send('4');
									console.log('ERROR - La ruta no se ha guardado correctamente (Modificar)');
								}else{ 
									res.send('0');
									console.log('OK - Ruta '+ruta.titulo+ ' modificado correctamente');
								}
							});
						}	
					}
				});
			}
			
			
    });	
	
	
	
	
	
	/*
		/rutas/estaLlena
		Comprueba si la ruta esta llena o no
	
		Parametros -> _id
		Devuelve   -> 0 (No esta llena) o 1 (Esta llena)
	
		OK    0 -> Ruta no llena
		OK    1 -> Ruta llena
		ERROR 2 -> Error al realizar la petición a la base de datos
	*/
	    app.get('/rutas/estaLlena', function(req, res){
		
        Ruta.findById(req.query._id, function(error, resultado){
                if(error)
				{
                    console.log('ERROR - Error en la petición a la base de datos');
					res.send('2');
                }
				else
				{
					var apuntados = parseInt(resultado.apuntados);
					var capacidad = parseInt(resultado.capacidad);
					
					if(apuntados >= capacidad)
					  {
						  res.send('1');
					  }
					else
					  {
						  res.send('0');
					  }
                }
        });
    });	
	
}




