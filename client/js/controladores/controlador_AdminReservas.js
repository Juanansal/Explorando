
app.controller('AdminReservas', function($scope, $http) {
    $scope._id = null;
	$scope.rutaRes = '';
	$scope.usuarioRes = '';
	$scope.puntuacion = '';
    $scope.reservas = [];
	

    $scope.cargarReservas = function(){
        $http({
            method: 'GET', url: '/reservas/listar',
			params: {
				       guia: $scope.usuario,
					   opcion: opc
					}
        }).
        success(function(data) {
            if(typeof(data) == 'object')
			{
                $scope.reservas = data;
            }
			else
			{
                console.log('Error al intentar recuperar las reservas.');
            }
        }).
        error(function() {
            console.log('Error al intentar realizar la peticion al servidor');
        });
    };
	
	
    $scope.guardarReserva = function() {
			
        $http({
            method: 'POST',
            url: '/reservas/guardar',
            params: {
				rutaRes: $scope.rutaRes,
				usuarioRes: $scope.usuarioRes,
				puntuacion: $scope.puntuacion,
                _id: $scope._id
            }
        }).
        success(function(data) {
            if(data == '0'){
                $scope.limpiarDatos();
                $scope.cargarReservas();    
            }else{
                console.log('Error numero '+data+' al intentar guardar la reserva');
            }
        }).
        error(function() {
            console.log('Error al intentar realizar la peticion al servidor');
        });
    }
	
	
    $scope.recuperarReserva = function(indice) {
        $http({
            method: 'GET',
            url: '/reservas/recuperar_reserva_por_id',
            params: {
                _id: indice
            }
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope._id = data._id;
				$scope.rutaRes = data.rutaRes;
				$scope.usuarioRes = data.usuarioRes;
				$scope.puntuacion = data.puntuacion;
            }else{
                console.log('Error numero '+data+' al intentar recuperar la reserva');
            }            
        }).
        error(function() {
            console.log('Error al intentar realizar la peticion al servidor');
        });
    };
	
    $scope.eliminarReserva = function(indice) {
        $http({
            method: 'POST',
            url: '/reservas/eliminar',
            params: {
                _id: indice
            }
        }).
        success(function(data) {
            if(data == '0'){
                $scope.limpiarDatos();
                $scope.cargarReservas();
            }else{
                console.log('Error numero '+data+' al intentar eliminar la reserva');
            }            
        }).
        error(function() {
            console.log('Error al intentar realizar la peticion al servidor');
        });
    };
    $scope.limpiarDatos = function() {
        $scope._id = null;
		$scope.rutaRes = '';
		$scope.usuarioRes = '';
		$scope.puntuacion = '';
    };
	
});