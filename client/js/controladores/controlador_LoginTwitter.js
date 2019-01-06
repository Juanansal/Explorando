app.controller('Twitter', function($scope, $http, $location) {

	console.log('Pasa por Login Twitter');
	
	
	$scope.twittear = function()
	{
	
		$http({
				method: 'GET',
				url: '/usuarios/twittearComentario',
				params: {
					texto: 'Hola mancos'				
				}
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
	
	$scope.login = function()
	{
	
		$http({
				method: 'GET',
				url: '/login/twitter/return',
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