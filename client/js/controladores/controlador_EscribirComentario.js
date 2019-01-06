
app.controller('EscribirComentario', function($scope, $http, $location) {
	
	$scope.usuarioCom = localStorage.getItem('usuario');

	var url = $location.absUrl();
	var res = url.split("?id=");
	$scope.rutaCom = res[1];
	
    $scope.comentario = '';
	
	$scope.resultado = '';
	
	
    $scope.guardarComentario = function() {
			
		var fechaActual = new Date();			
		
		console.log($scope.comentario);
		
        $http({
            method: 'POST',
            url: '/comentarios/guardar',
            params: {
				usuarioCom: $scope.usuarioCom,
				rutaCom: $scope.rutaCom,
                comentario: $scope.comentario,
				fecha: fechaActual,
            }
        }).
        success(function(data) {
            if(data == '0'){
                $scope.resultado = 'Comentario guardado con exito';    
            }else{
                console.log('Error numero '+data+' al intentar guardar el comentario');
				$scope.resultado = 'Error al escribir el comentario';
            }
        }).
        error(function() {
            console.log('Error al intentar realizar la peticion al servidor');
			$scope.resultado = 'Error al escribir el comentario';
        });
    };
	
	
	
});