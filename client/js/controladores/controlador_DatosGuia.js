app.controller('DatosGuia', function($scope, $http, $location) 
{
	
	var url = $location.absUrl();
	var res = url.split("?id=");
	
	$scope.guia = res[1];	
	$scope.nombre = '';
	$scope.apellidos = '';
    $scope.ciudad = '';
	$scope.email = '';
	$scope.urlFoto = '';
	$scope.puntuacion = '';
	$scope.numeroVotos = '';
	$scope.media = null;
	  
	$scope.cargarGuia = function() 
	{
		if($scope.usuario!=null)
		{
		
			$http({
				method: 'GET',
				url: '/usuarios/recuperar_usuario_por_usuario',
				params: {
					usuario: $scope.guia
				}
			}).
			success(function(data) {
				if(typeof(data) == 'object')
				{
					$scope.nombre = data.nombre;
					$scope.apellidos = data.apellidos;  
					$scope.email = data.email;		
					$scope.ciudad = data.ciudad;
					$scope.urlFoto = data.urlFoto;
					$scope.puntuacion = data.puntuacion;
					$scope.numeroVotos = data.numeroVotos;
					
					$scope.puntuacion = parseInt($scope.puntuacion);
					$scope.numeroVotos = parseInt($scope.numeroVotos);
					
					$scope.media = ($scope.puntuacion/$scope.numeroVotos)*2;
				}
				else
				{
					console.log('Error '+data+' al intentar recuperar el usuario.');
				}            
			}).
			error(function() {
				console.log('Error al intentar recuperar el usuario.');
			});
		}
		else
		{
			console.log("Usuario no logeado");
		}
    };
	
	
});


