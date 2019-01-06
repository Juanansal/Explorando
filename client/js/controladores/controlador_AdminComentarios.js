
app.controller('AdminComentarios', function($scope, $http) {
    $scope._id = null;
	$scope.usuarioCom = '';
	$scope.rutaCom = '';
    $scope.comentario = '';
    $scope.comentarios = [];
	

    $scope.cargarComentarios = function(){
        $http({
            method: 'GET', url: '/comentarios/listar'
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope.comentarios = data;
            }else{
                console.log('Error al intentar recuperar los comentarios.');
            }
        }).
        error(function() {
            console.log('Error al intentar realizar la peticion al servidor');
        });
    };
	
	
    $scope.guardarComentario = function() {
			
		var fechaActual = new Date();			
			
        $http({
            method: 'POST',
            url: '/comentarios/guardar',
            params: {
				usuarioCom: $scope.usuarioCom,
				rutaCom: $scope.rutaCom,
                comentario: $scope.comentario,
				fecha: fechaActual,
                _id: $scope._id
            }
        }).
        success(function(data) {
            if(data == '0'){
                $scope.limpiarDatos();
                $scope.cargarComentarios();    
            }else{
                console.log('Error numero '+data+' al intentar guardar el comentario');
            }
        }).
        error(function() {
            console.log('Error al intentar realizar la peticion al servidor');
        });
    }
	
	
    $scope.recuperarComentario = function(indice) {
        $http({
            method: 'GET',
            url: '/comentarios/recuperar_comentario_por_id',
            params: {
                _id: indice
            }
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope._id = data._id;
				$scope.usuarioCom = data.usuarioCom;
				$scope.rutaCom = data.rutaCom;
                $scope.comentario = data.comentario;
            }else{
                console.log('Error numero '+data+' al intentar recuperar el comentario');
            }            
        }).
        error(function() {
            console.log('Error al intentar realizar la peticion al servidor');
        });
    };
	
    $scope.eliminarComentario = function(indice) {
        $http({
            method: 'POST',
            url: '/comentarios/eliminar',
            params: {
                _id: indice
            }
        }).
        success(function(data) {
            if(data == '0'){
                $scope.limpiarDatos();
                $scope.cargarComentarios();
            }else{
                console.log('Error numero '+data+' al intentar eliminar el comentario');
            }            
        }).
        error(function() {
            console.log('Error al intentar realizar la peticion al servidor');
        });
    };
    $scope.limpiarDatos = function() {
        $scope._id = null;
		$scope.usuarioCom = '';
		$scope.rutaCom = '';
        $scope.comentario = '';
    };
	
});