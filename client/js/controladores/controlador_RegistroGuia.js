app.controller('RegistroGuia', function($scope, $http) 
{
    $scope.usuario = localStorage.getItem('usuario');
	$scope.resultadoRegistroGuia = '';

	$scope.registrarGuia = function()
	{
		console.log('PASA POR AQUI')
		$http({
            method: 'GET',
            url: '/usuarios/registro_guia',
            params: {
                usuario: $scope.usuario
            }
        }).
        success(function(data) 
		{
			console.log(data);
            if(data == '0')
			{
				$scope.resultadoRegistroGuia = 'registro de guía correcto para el usuario '+$scope.usuario;
				localStorage.setItem("esGuia", 'true');
				window.location.href = '/principal.html';
				
				
            }else{
                console.log('Error al intentar recuperar el cliente.');
            }            
        }).
        error(function() {
            console.log('Error al intentar recuperar el cliente.');
        });
		
		
		
	}	
});
