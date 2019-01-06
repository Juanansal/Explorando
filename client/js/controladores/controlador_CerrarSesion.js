app.controller('CerrarSesion', function($scope, $http, $location) 
{
	
    $scope.cerrarSesion = function()
	{
		localStorage.clear();
	};

	
});