
var Usuario = require('../usuarioEsquema');
var session = require('express-session');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var Twitter = require('twitter');

var twitterKey = 'cpjcXHtrYxc3U1geRZes6yv9j';
var twitterKeySecreta = 'OJK6lmtmszh72Ni9vH5ImOoe2jKQp0EAA4rervZ9eD4Voz9ECQ';



// Al pulsar el boton de login Twitter ejecutara esto trozo del codigo
passport.use(new Strategy({
    consumerKey: twitterKey,
    consumerSecret: twitterKeySecreta,
    callbackURL: '/login/twitter/return'
  },
  function(token, tokenSecret, profile, cb) {

	//console.log('SECRETO: '+token);
	//console.log('SECRETO: '+tokenSecret);
	//console.log('profile: '+profile);
	
	//console.log('id: '+profile.id);
	//console.log('displayName: '+profile.displayName);
	
	var fecha = new Date();
	
	
	Usuario.findOne({usuario: profile.id}, function(error, resultado){
            if(error){
				console.log('ERROR - Error en el login de twitter:');
            }
			else
			{
				//console.log('resultado: '+resultado);
				
				if(resultado == null)
				{
					var usuario = new Usuario
					({
						usuario: profile.id,
						nombre: profile.username,
						esGuia: false,
						esAdmin: false,
						fechaReg: fecha,
						tokenTwitter: token,
						tokenpTwitter: tokenSecret
					});
					usuario.save(function(error, documento){
					if(error){
						console.log('ERROR - El usuario no se ha guardado correctamente en el login de twitter');
					}else{
						console.log('Nuevo usuario de twitter ingresado correctamente');
					}
					});
				}
				else
				{				
					
				}
            }
       });
	
    return cb(null, profile);
  }));
  
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


  

module.exports = function(app)
{
	
	app.use(session({
		resave: false,
		saveUninitialized: true,
		secret: 'bla bla bla'
	}));
	/*
	
	app.use(session({resave: false, saveUninitialized: true, secret: 'keyboard cat', key: 'sid', cookie: { secure: true }}));
	*/
	
	app.use(passport.initialize());
	app.use(passport.session());  
	

	
	
	/*
		/twitter/twittearComentario
		Twittea un parametro, con los datos de twitter del usuario y comentario pasado por parametro
	
		Parametros -> usuario, texto
		Devuelve   -> 0 - Todo correcto
	
		OK    0 -> Todo correcto
		ERROR 1 -> Parametros no recibidos
		ERROR 2 -> Error al acceder a la base de datos
		ERROR 3 -> Usuario no encontrado
		ERROR 4 -> Usuario no Twitter
		ERROR 5 -> Error al escribir el Tweet
		
		
	*/
	app.get('/twitter/twittearComentario', function(req, res)
	{
		
		if(req.query.texto==null || req.query.usuario==null)
		{
			res.send('1');
		}
		else
		{
			Usuario.findOne({usuario: req.query.usuario}, function(error, resultado){
            if(error){
				console.log('ERROR - Error al recuperar el usuario: '+req.query.usuario);
                res.send('2');
            }else
			{	
				console.log('REsultado: '+resultado)

		
				if(resultado==null)
				{
					res.send('3');
					console.log('ERROR - Usuario no encontrado');
				}	
				else
				{
					if(resultado.tokenTwitter==null)
					  {					  
						  res.send('4');
					  }
					  else
					  {
							// Aqui realizamos el twitter
							
							var twitter = new Twitter({
							consumer_key: twitterKey,
							consumer_secret: twitterKeySecreta,
							access_token_key: resultado.tokenTwitter,
							access_token_secret: resultado.tokenpTwitter
							});
							
							twitter.post('statuses/update', {status: req.query.texto}, function(error, tweets, response){
							  if(error)
							  {
								  res.send('5');
								  console.log('Error al intentar escribir un twet del comentario con error: '+error[0]);
							  }	
							  else
							  {
								//console.log(tweets);  // The favorites.
								//console.log(response);  // Raw response object.
								
								console.log('Tweet escrito correctamente');		  
								res.send('0');
							  }
							  
							});
							
					  }
					
				}
            }
			});
		}
	});

		
		
		
	app.get('/twitter/recogetDatos', function(req, res)
	{
		
		if(req.user==undefined)
		  {
			 res.send('1') 
		  }
		else
		  {
			  res.send(req.user);
		  }		
	});
	
	
	
	
	app.get('/login/twitter',
		  passport.authenticate('twitter'));
		  


	app.get('/login/twitter/return/', function(req,res,next) {
		
		
		passport.authenticate(
			'twitter',
			 {
			   callbackURL:"/login/twitter"
			 , successRedirect:"/principal.html?twitter=true"
			 , failureRedirect:"/"
			 }
		   ) (req,res,next);
		 });	  
			  
			  
			  
	
			
	
	
	
	
	
	
	
}

