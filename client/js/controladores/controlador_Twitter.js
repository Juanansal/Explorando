app.controller('Twitter', function($scope, $http, $location) {

	console.log('Pasa por Login Twitter');
	
	
	$scope.twittear = function(comentario, user)
	{
		console.log('Usuario: '+user);
		console.log('Texto: '+comentario);
	
		$http({
				method: 'GET',
				url: '/twitter/twittearComentario',
				params: {
					texto: comentario,
					usuario: user
				}
				}).
				success(function(data) 
				{
					if(data == '0')
					{
						console.log('Twitt enviado correctamente');
					}
					else
					{
						console.log('Error al enviar el Tweet con código: '+data)
					}
					

				}).
				error(function() {
					console.log('Error al realizar la peticion de login twitter');
				});
	};
	
	
	$scope.loginTwitter = function()
	{
		console.log('HOLA');
	
		$http({
				method: 'GET',
				url: '/login/twitter'
				}).
				success(function(data) 
				{

					console.log('Login correcto');
					console.log(data);

				}).
				error(function() {
					console.log('Error al realizar la peticion de login twitter');
				});
	};
	
	  
});