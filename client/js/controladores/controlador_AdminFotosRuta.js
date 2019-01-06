
app.controller('AdminFotosRuta', function($scope, $http) {
    $scope._id = null;
	$scope.url = '';
	$scope.fecha = '';
    $scope.fotosRuta = [];
	

    $scope.cargarFotosRuta = function(){
        $http({
            method: 'GET', url: '/fotosRuta/listar'
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope.fotosRuta = data;
            }else{
                console.log('Error al intentar recuperar las fotos de la ruta.');
            }
        }).
        error(function() {
            console.log('Error al intentar realizar la peticion al servidor');
        });
    };
	
	
    $scope.guardarFotoRuta = function() {
			
		var fechaActual = new Date();			
			
        $http({
            method: 'POST',
            url: '/fotosRuta/guardar',
            params: {
				url: $scope.url,
				fecha: fechaActual,
				_id: $scope._id
            }
        }).
        success(function(data) {
            if(data == '0'){
                $scope.limpiarDatos();
                $scope.cargarFotosRuta();    
            }else{
                console.log('Error numero '+data+' al intentar guardar la foto de ruta');
            }
        }).
        error(function() {
            console.log('Error al intentar realizar la peticion al servidor');
        });
    }
	
	
    $scope.recuperarFotoRuta = function(indice) {
        $http({
            method: 'GET',
            url: '/fotosRuta/recuperar_fotoRuta_por_id',
            params: {
                _id: indice
            }
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope._id = data._id;
				$scope.url = data.url;
				$scope.fecha = data.fecha;
            }else{
                console.log('Error numero '+data+' al intentar recuperar la foto de Ruta');
            }            
        }).
        error(function() {
            console.log('Error al intentar realizar la peticion al servidor');
        });
    };
	
    $scope.eliminarFotoRuta = function(indice) {
        $http({
            method: 'POST',
            url: '/fotosRuta/eliminar',
            params: {
                _id: indice
            }
        }).
        success(function(data) {
            if(data == '0'){
                $scope.limpiarDatos();
                $scope.cargarFotosRuta();
            }else{
                console.log('Error numero '+data+' al intentar eliminar la foto de la ruta');
            }            
        }).
        error(function() {
            console.log('Error al intentar realizar la peticion al servidor');
        });
    };
    $scope.limpiarDatos = function() {
        $scope._id = null;
		$scope.url = '';
		$scope.fecha = '';
    };
	
});