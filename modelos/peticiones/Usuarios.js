
var Usuario = require('../usuarioEsquema');
var express = require('express');
var twitterKey = 'cpjcXHtrYxc3U1geRZes6yv9j';
var twitterKeySecreta = 'OJK6lmtmszh72Ni9vH5ImOoe2jKQp0EAA4rervZ9eD4Voz9ECQ';
var bodyParser = require('body-parser');
var multer  = require('multer');
var upload = multer({ dest: 'client/imagenes/perfil/' });
var fs = require('fs');



  

module.exports = function(app)
{
	/*
		/usuarios/listar
		Devuelve todos los usuarios de la base de datos en un vector 
		
		Parametros -> X
		Devuelve   -> Vector
		
		OK    -> Devuelve un vector con el listado de los usuarios
		ERROR 1 -> Error al acceder a la base de datos
	*/	
    app.get('/usuarios/listar', function(req, res){
        Usuario.find({}, function(error, usuarios){
            if(error){
				console.log('ERROR - Listado de usuarios fallado');
                res.send('1');				
            }else{
                res.send(usuarios); 
				//console.log('OK - Listado de usuarios');
            }
       })
    });


	
	
	/*
		/usuarios/recuperar_usuario_por_id
		Devuelve el usuario con la id pasada por parametro
	
		Parametros -> _id
		Devuelve   -> json con todos los datos del usuario
	
		OK    -> Devuelve un json con los datos del usuario pasado por parametro
		ERROR 1 -> Error al acceder a la base de datos
	*/
    app.get('/usuarios/recuperar_usuario_por_id', function(req, res){
        Usuario.findById(req.query._id, function(error, resultado){
            if(error){
				console.log('ERROR - Error al recuperar el usuario: '+req.query._id);
                res.send('1');
            }else{
                res.send(resultado);
            }
       });
    });
	
	
	
	
	
	/*
		/usuarios/recuperar_usuario_por_usuario
		Devuelve todos los datos de usuario con el nombre de usuario pasado por parametro
	
		Parametros -> usuario
		Devuelve   -> json con todos los datos del usuario
	
		OK      -> Devuelve un json con los datos del usuario pasado por parametro
		ERROR 1 -> Error al acceder a la base de datos
		ERROR 2 -> Usuario no encontrado
	*/
	app.get('/usuarios/recuperar_usuario_por_usuario', function(req, res){
        Usuario.findOne({usuario: req.query.usuario}, function(error, resultado){
            if(error){
				console.log('ERROR - Error al recuperar el usuario: '+req.query.usuario);
                res.send('1');
            }else
			{
				
				if(resultado==null)
				{
					res.send('2');
					console.log('ERROR - Usuario no encontrado');
				}	
				else
				{
					console.log('OK - Usuario '+resultado.usuario+' recuperado');
					res.send(resultado);
				}
            }
       });
    });
	
	
	
	
	/*
		/usuarios/recuperar_nombre_por_usuario
		Devuelve el nombre del usuario pasado por parametro
	
		Parametros -> usuario
		Devuelve   -> nombre (String)
	
		OK      -> Devuelve el nombre del usuario pasado por parametro
		ERROR 1 -> Error al acceder a la base de datos
		ERROR 2 -> Usuario no encontrado
	*/
	app.get('/usuarios/recuperar_nombre_por_usuario', function(req, res){
        Usuario.findOne({usuario: req.query.usuario}, function(error, resultado){
            if(error){
				console.log('ERROR - Error al recuperar el usuario: '+req.query.usuario);
                res.send('1');
            }else
			{
				
				if(resultado==null)
				{
					res.send('2');
					console.log('ERROR - Usuario no encontrado');
				}	
				else
				{
					console.log('OK - Usuario '+resultado.usuario+' recuperado');
					res.send({nombre: resultado.nombre, url:resultado.urlFoto});
				}
            }
       });
    });
	
	
	
	/*
		/usuarios/comprobar_usuario
		Busca el usuario pasado por parametro en la base de datos
	
		Parametros -> usuario
		Devuelve   -> 0 (Usuario encontrado) //--// 1 (Usuario no encontrado)
	
		OK  0 -> Usuario encontrado
		OK  1 -> Usuario no encontrado
		ERROR 2 -> Error al acceder a la base de datos
	*/
	app.get('/usuarios/comprobar_usuario', function(req, res){
		
        Usuario.findOne({usuario: req.query.usuario}, function(error, resultado){
            if(error){
				console.log('ERROR - Error en comprobar_usuario: '+req.query.usuario);
                res.send('2');
            }
			else
			{
				if(resultado == null)
				{
					res.send('1');
				}
				else
				{
					res.send('0');
				}
				console.log('OK - Comprobar usuario realizado con exito');
            }
       });
    });

	
	
	
	/*
		/usuarios/guardar
		Guarda el usuario con los datos pasados por parametro
	
		Parametros -> usuario,pass,nombre,apellidos,email,telefono,ciudad,esguia,_id(opc)
		Devuelve   -> 0 (Todo OK) 
	
		OK    0 -> Usuario guardado correctamente
		ERROR 1 -> Error al guardar nuevo usuario
		ERROR 2 -> Error al buscar usuario por la _id
		ERROR 3 -> Error al modificar el usuario
	*/
    app.post('/usuarios/guardar', function(req, res){
        if(req.query._id == null){
            //Inserta nuevo
			var fecha = new Date();
			
            var usuario = new Usuario({
			   usuario: req.query.usuario,
               pass: req.query.pass,
               nombre: req.query.nombre,
			   apellidos: req.query.apellidos,
               email: req.query.email,
			   telefono: req.query.telefono,
			   ciudad: req.query.ciudad,
			   esGuia: false,
			   esAdmin: false,
			   fechaReg: fecha
            });
            usuario.save(function(error, documento){
                if(error){
					console.log('ERROR - El usuario no se ha guardado correctamente');
                    res.send('1');
                }else{
					console.log('OK - Usuario '+documento.usuario+' guardado correctamente');
                    res.send('0');
                }
            });
        }else{
            //Modifica
            Usuario.findById(req.query._id, function(error, documento){
                if(error)
				{
                    console.log('ERROR - El usuario no se ha guardado correctamente (Modificar)');
					res.send('2');
                }
				else
				{
                    var usuario = documento;
					usuario.usuario = req.query.usuario,
                    usuario.pass = req.query.pass,
                    usuario.nombre = req.query.nombre,
					usuario.apellidos = req.query.apellidos,
                    usuario.email = req.query.email,
					usuario.telefono = req.query.telefono,
					usuario.ciudad = req.query.ciudad,
					usuario.esGuia = req.query.esGuia
                    usuario.save(function(error, documento){
                        if(error){
                            res.send('3');
							console.log('ERROR - El usuario no se ha guardado correctamente (Modificar)');
                        }else{ 
                            res.send('0');
							console.log('OK - Usuario -'+usuario.usuario+ '- modificado correctamente');
                        }
                    });
                }
            });
        }
    });

	
	
	
	
	/*
		/usuarios/eliminar
		Elimina el usuario de la base de datos con el _id pasado por parametro
	
		Parametros -> _id
		Devuelve   -> 0 (Todo OK) 
	
		OK    0 -> Usuario eliminado
		ERROR 1 -> Error al intentar eliminar el usuario
	*/
    app.post('/usuarios/eliminar', function(req, res){
        Usuario.remove({_id: req.query._id}, function(error){
            if(error){
                res.send('1');
				console.log('ERROR - El usuario no se ha eliminado');
            }else{
				console.log('OK - Usuario eliminado correctamente');
                res.send('0');
            }
       });
    });
	
	
	
	
	
	/*
		/usuarios/login
		Comprueba el login, si devuelve un objeto con los datos del usuario es correcto
	
		Parametros -> usuario, pass
		Devuelve   -> json con los datos del usuario logeado 
	
		ERROR 1 -> Error al conectar
		ERROR 2 -> Usuario no encontrado 
		ERROR 3 -> Contraseña incorrecta
	*/
	app.get('/usuarios/login', function(req, res){
		
        Usuario.findOne({usuario: req.query.usuario}, function(error, resultado){
            if(error){
				console.log('ERROR - Error en el login: '+req.query.usuario);
                res.send('1');
            }
			else
			{
				if(resultado == null)
				{
					res.send('2');
					console.log('ERROR - Usuario no encontrado en la base de datos (login)');
				}
				else
				{
					if(req.query.pass == resultado.pass)
					  {						  
						   var enviar = new Usuario({
						   usuario: resultado.usuario,
						   esGuia: resultado.esGuia,
						   esAdmin: resultado.esAdmin,
						   _id: resultado._id,
						   nombre: resultado.nombre,
						   urlFoto: resultado.urlFoto
						   
						});		
						
						  
						  res.send(enviar);
						  console.log('OK - Login de '+ resultado.usuario+' realizado con exito');
					  }
					else
					  {
						  res.send('3');
						  console.log('ERROR - Contraseña incorrecta de '+resultado.usuario+' al realizar el login');
					  }
				}
            }
       });
    });
	
	
	
	
	
	
	/*
		/usuarios/registroUsuario
		Guarda el usuario con los datos pasados por parametro
	
		Parametros -> usuario,pass,nombre,apellidos,email
		Devuelve   -> 0 (Todo OK) 
	
		OK    0 -> Usuario guardado correctamente
		ERROR 1 -> Error al guardar nuevo usuario
	*/
	app.post('/usuarios/registroUsuario', function(req, res){
		
            //Inserta nuevo
			var fecha = new Date();
			
            var usuario = new Usuario({
			   usuario: req.query.usuario,
               pass: req.query.pass,
               nombre: req.query.nombre,
			   apellidos: req.query.apellidos,
               email: req.query.email,
			   esGuia: false,
			   esAdmin: false,
			   urlFoto: '',
			   fechaReg: fecha
            });
            usuario.save(function(error, documento){
                if(error){
					console.log('ERROR - El usuario no se ha guardado correctamente');
                    res.send('1');
                }else{
					console.log('OK - Usuario '+documento.usuario+' guardado correctamente');
					
					
					/*****************  ENVIO DE CORREO *******************************/
					
					/*
					var email = new sendgrid.Email();

					
					 var email = 
					 {
						to:       documento.email,
						from:     "registro@explorando.com",
						subject:  'Registro correcto Explorando',
						html:     'Registro realizado correctamente <br> Acceda a la web pulsando <a href="explorando.herokuapp.com">AQUI</a>'
					 };
			
					sendgrid.send(email,  function(err, resultado) 
					{
						if (err) 
							{
								console.log('Error al enviar el email de registro');
							}
						else
						    {
								console.log('Enviado email a la siguiente dirección correctamente: '+ documento.email);
							}
						
					});
					*/
					
					/******************************************************************/
					
                    res.send('0');
                }
            });
    });

	
	
	
	
	/*
		/usuarios/registro_guia
		Realiza el registro de un usuario a guia
	
		Parametros -> usuario
		Devuelve   -> 0 (Todo OK)
	
		OK  0   -> Usuario pasado a guia correctamente
		ERROR 1 -> Error al conectar
		ERROR 2 -> Usuario no encontrado
		ERROR 3 -> Error al guardar el usuario
	*/
	app.get('/usuarios/registro_guia', function(req, res){
		
        Usuario.findOne({usuario: req.query.usuario}, function(error, resultado){
            if(error){
				console.log('ERROR - Error en el login: '+req.query.usuario);
                res.send('1');
            }
			else
			{
				if(resultado == null)
				{
					res.send('2');
					console.log('ERROR - Usuario no encontrado en la base de datos (registro Guia)');
				}
				else
				{
					
					//AQUI HABRIA QUE HACER LAS COMPROBACIONES DE PAYPAL UNA VEZ SE HAGA
					// SI TODO ES CORRECTO ENTONCES ...
					
					var usuario = resultado;				
					usuario.esGuia = true;
					usuario.puntuacion = 0;
					usuario.numeroVotos = 0;
					usuario.saldo = 0;
					
					usuario.save(function(error, resultado){
                        if(error){
                            res.send('3');
							console.log('ERROR - El usuario no se ha guardado correctamente (Registro de guias)');
                        }else{ 
							res.send('0');
                        }
                    });
					
					
				}
            }
       });
    });
	
	
	/*
		/usuarios/modificar_pass
		Cambia la contraseña pasado por parametro del usuario, ademas comprueba si son correctas
	
		Parametros -> usuario, pass1, pass2
		Devuelve   -> 0 (Todo OK)
	
		OK  0   -> Contraseña modificada correctamente
		ERROR 1 -> No se han recibido todos los parametros
		ERROR 2 -> Las contraseñas no coinciden
		ERROR 3 -> Error al buscar el usuario en la base de datos
		ERROR 4 -> Error al guardar el usuario
	*/
	app.post('/usuarios/modificar_pass', function(req, res){
		
        if(req.query.usuario == null || req.query.pass1 == null || req.query.pass2 == null)
		  {
			  console.log('ERROR 1 - Parametros no recibidos correctamente');
              res.send('1');
          }
		else
		  {
            Usuario.findOne({usuario: req.query.usuario}, function(error, resultado)
			{
                if(error)
				{
                    console.log('ERROR 3 - Error al buscar el usuario en la base de datos');
					res.send('3')
                }
				else
				{
					
					if(req.query.pass1 != req.query.pass2)
					  {
						  console.log('ERROR 2 - Contraseñas no coinciden');
						  res.send('2')
					  }
					else
					  {			  
						    var usuario = resultado;
							usuario.pass = req.query.pass1,
							usuario.save(function(error, resultado)
							{
								if(error)
								{
									res.send('4');
									console.log('ERROR 4 - Usuario no se ha guardado correctamente');
								}
								else
								{ 
									res.send('0');
									console.log('OK - Pass del usuario '+req.query.usuario+ ' modificado correctamente');
								}
							}); 
					  }                  
                }
            });
		  }
    });
			
			
			
			
			
			
		
	/*
		/usuarios/modificarPerfil
		Guarda el usuario con los datos pasados por parametro
	
		Parametros -> usuario,pass,nombre,apellidos,email,telefono,ciudad,esguia,_id
		Devuelve   -> 0 (Todo OK) 
	
		OK    0 -> Usuario guardado correctamente
		ERROR 1 -> Error al guardar nuevo usuario
		ERROR 2 -> Error al buscar usuario por la _id
		ERROR 3 -> Error al modificar el usuario
	*/
	app.post('/usuarios/modificarPerfil', function(req, res){

	
            Usuario.findById(req.query._id, function(error, documento){
                if(error)
				{
                    console.log('ERROR - El usuario no se ha guardado correctamente (Modificar)');
					res.send('2');
                }
				else
				{
					
                    var usuario = documento;
					usuario.usuario = req.query.usuario,
                    usuario.pass = req.query.pass,
                    usuario.nombre = req.query.nombre,
					usuario.apellidos = req.query.apellidos,
                    usuario.email = req.query.email,
					usuario.telefono = req.query.telefono,
					usuario.ciudad = req.query.ciudad,
					usuario.esGuia = req.query.esGuia
                    usuario.save(function(error, documento){
                        if(error){
                            res.send('3');
							console.log('ERROR - El usuario no se ha guardado correctamente (Modificar)');
                        }else{ 
                            res.send('0');
							console.log('OK - Usuario -'+usuario.usuario+ '- modificado correctamente');
                        }
                    });
                }
            });
        
    });
	
	
	
	
	app.post('/usuarios/subirFotoPerfil', upload.single('foto'), function(req, res){
	
		//console.log('Pasa por aqui');
		//console.log('Fotos: '+req.files);
		//console.log('Foto mia:'+req.query.upload);
		//app.use(bodyParser.json());
		//app.use(bodyParser.urlencoded({extended: true}));
		
		//response.send('0');
		console.log(req.body);
		console.log(req.file);
		
		if(req.file)
		  {
			  var foto = req.file;
			  console.log('Pasa por aqui');
			  
			  // Recoje los datos del tipo de archivo y extensiones
			  var aux = foto.mimetype.split("/");
			  var tipo = aux[0];
			  
			  if(tipo == 'image')
			    {
					Usuario.findById(req.body._id, function(error, documento){
						if(error)
						{
							console.log('ERROR - Error al cocnectar con la base de datos (SubirFotoPerfil)');
						}
						else
						{
							var filePath = "client/"+documento.urlFoto ; 
							
							var vacio=false;
							if(documento.urlFoto=='') vacio = true;	 					
							
							var usuario = documento;
							usuario.urlFoto = 'imagenes/perfil/'+foto.filename,
							usuario.save(function(error, documento){
								if(error){
									console.log('ERROR - El usuario no se ha guardado correctamente (SubirFotoPerfil)');
								}else{ 
									console.log('Añadida url de la foto de perfil a la base de datos');
									
									// Borrar imagen de perfil anterior
									
									if(vacio==false)
									  {
										 fs.unlinkSync(filePath);
									  }
									   
								}
							});
						}
					});
					
				}
		  }
		
		

		
	res.writeHead(302, {'Location': '/modificar_perfil.html?id'});
	res.end();
            
        
    });
	
	
	
	
	/*
		/usuarios/actualizarVotos
		Actualiza la puntuacion del guia con el nuevo voto introducido en la ruta
	
		Parametros -> usuario, num
		Devuelve   -> 0 (Todo OK) 
	
		OK    0 -> Actualizacion realizada con exito
		ERROR 1 -> Parametros no recibidos
		ERROR 2 -> Error al realizar la peticion a la base de datos
		ERROR 3 -> Datos no encontrados
		ERROR 4 -> Error al guardar los nuevos datos
	*/
	app.post('/usuarios/actualizarVotos', function(req, res){
		
		
		if(req.query.usuario == null && req.query.num == null)
		{
			res.send('1');
			console.log('ERROR - Parametros no recibidos en actualizarVotos de guia');
	    }
		else
		{
			Usuario.findOne({usuario: req.query.usuario}, function(error, resultado){
				if(error)
				{
					console.log('ERROR - Error al realizar la peticion a la base de datos');
					res.send('2');
				}
				else
				{
					if(resultado == null)
					{
						res.send('3');
						console.log('ERROR - Datos no encontrados en la peticion de actualizar votos de guia');
					}
					else
					{
						var usuario = resultado;
						
						/*
							puntuacion: Number,
							numeroVotos: Number,
						*/
						
						var puntos = parseInt(req.query.num);
						puntos = puntos + usuario.puntuacion;
						
						var votos = usuario.numeroVotos + 1; 
					
						//console.log('TTTTT: '+usuario.puntuacion);
						//console.log('Puntos: '+puntos+'      Votos: '+votos);
						
						usuario.puntuacion = puntos,
						usuario.numeroVotos = votos;
						
						usuario.save(function(error, resultado){
								if(error){
									res.send('4');
									console.log('ERROR - El usuario no se ha guardado correctamente al actualizar los votos');
								}else{ 
									res.send('0');
									console.log('OK - Votos al guia actualizado correctamente');
								}
							});
							
					}
				}
		   });
		}
	});
	
	
	
	/*
		/usuarios/modificarSaldo
		Añade o elimina saldo del guia
	
		Parametros -> usuario, num, modo (1-sumar, 2-restar)
		Devuelve   -> 0 (Todo OK) 
	
		OK    0 -> Actualizacion realizada con exito
		ERROR 1 -> Error al realizar la peticion a la base de datos
		ERROR 2 -> Datos no encontrados
		ERROR 3 -> Error al guardar los nuevos datos
	*/
	app.post('/usuarios/modificarSaldo', function(req, res){
		
			
			Usuario.findOne({usuario: req.query.usuario}, function(error, resultado){
				if(error)
				{
					console.log('ERROR - Error al realizar la peticion a la base de datos');
					res.send('1');
				}
				else
				{
					if(resultado == null)
					{
						res.send('2');
						console.log('ERROR - Datos no encontrados en la peticion de actualizar votos de guia');
					}
					else
					{
						
						
						var usuario = resultado;
						
						console.log(req.query.modo);
						
						if(req.query.modo==1)
						{
							usuario.saldo = usuario.saldo + parseInt(req.query.num)
						}
						if(req.query.modo==2)
						{
							usuario.saldo = usuario.saldo - parseInt(req.query.num)
						}
						
						if(req.query.modo==3)
						{
							usuario.saldo = 0;
						}
						
						usuario.save(function(error, resultado){
								if(error){
									res.send('3');
									console.log('ERROR - El usuario no se ha guardado correctamente al actualizar el saldo');
								}else{ 
									res.send('0');
									console.log('OK -Actualizacion del saldo realizado correctamente');
								}
							});
							
					}
				}
		   });
		
	});
	
	
}

