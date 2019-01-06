app.controller('GestionarVotos', function($scope, $http, $location) 
{
	
	
	$scope.usuarioRes = localStorage.getItem('usuario');
	
	var url = $location.absUrl();
	var res = url.split("?id=")
	$scope.rutaRes = res[1];
	
});