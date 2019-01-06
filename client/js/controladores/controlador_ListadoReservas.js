
app.controller('ListadoReservas', function($scope, $http) 
{
    $scope.reservas = [];	
	$scope.usuario = localStorage.getItem('usuario');
	
	$scope.cargarReservas = function(){
        $http({
            method: 'GET', url: '/reservas/listarReservasPorGuia',
			params: {
				       guia: $scope.usuario,
					}
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope.reservas = data;
				
				$scope.nombres = new Array();
				
				for(i=0; i<data.length; i++)
				  {
					  $http({
							method: 'GET',
							url: 'usuarios/recuperar_usuario_por_usuario',
							params: {
								usuario: data[i].usuarioRes
							}
						}).
						success(function(data2) 
						{
							//console.log(data2);
							if(typeof(data2) == 'object')
							{
								$scope.nombres.push(data2.nombre);
								//console.log('PASA POR AQUI');
							}	
						}).
						error(function() {
							console.log('Error al realizar la peticion.');
						}); 
				  }
				
				//console.log(data);
            }else{
                console.log('Error al intentar recuperar las reservas.');
            }
        }).
        error(function() {
            console.log('Error al intentar realizar la peticion al servidor');
        });
    };
	
	
	$scope.enviarPaypal = function()
	{
		console.log('PASA POR AQUI');
		
		$http({
            method: 'GET',
            url: '/paypal/retirarSaldo',
            params: 
			{
				_id: $scope.rutaRes
            }
        }).
        success(function(data) 
		{	
			console.log(data);			
			
						$http({
							method: 'POST',
							url: '/usuarios/modificarSaldo',
							params: {
								usuario: $scope.usuario,
								modo: 3
							}
						}).
						success(function(data2) 
						{						
							window.location.href = "gestionarPagos.html";
						}).
						error(function() {
							console.log('Error al realizar la peticion.');
						}); 					
			
			
			
			//window.location.href = ruta;
        }).
        error(function() {
            console.log('Error al intentar realizar la peticion al servidor');
			$scope.resultado = "Error al solicitar la reserva";
        });
	}
	
	
});