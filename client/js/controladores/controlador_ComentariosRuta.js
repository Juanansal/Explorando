
app.controller('ComentariosRuta', function($scope, $http, $location) {
	
	$scope.usuarioCom = localStorage.getItem('usuario');
	$scope.nombreUsuarioCom = localStorage.getItem('nombre');
	$scope.urlUsuario = localStorage.getItem('url');
	
	var url = $location.absUrl();
	var res = url.split("?id=");
	$scope.rutaCom = res[1];
	$scope.comentarios = [];
	
	$scope.resultado = '';
	
	
	$scope.mostrarComentarios = function()
	  {
		  //console.log("PASA por mostar comentarios");
		  $scope.nombres = new Array();
		  
		  if($scope._id == '')
		  {
			  console.log("Id de la ruta no detectado");
		  }
		  else
	      {
			    $http({
				method: 'GET', 
				url: '/comentarios/listarComentariosPorRuta',
				params: { rutaCom: $scope.rutaCom }
				}).
				
				success(function(data) {
					
					if(typeof(data) == 'object')
					   {
						   $scope.comentarios = data;
				       }
						
					else
					   {
						    console.log('Error numero '+data+' al intentar recuperar los comentarios.');
					   }
					
				}).
				error(function() {
					console.log('Error al intentar realizar la peticion al servidor');
				});
		   };
	   }
	   
	   
	   
	$scope.guardarComentario = function() 
	{
			
		var fechaActual = new Date();			
		
        $http({
            method: 'POST',
            url: '/comentarios/guardar',
            params: {
				usuarioCom: $scope.usuarioCom,
				nombreUsuarioCom: $scope.nombreUsuarioCom,
				rutaCom: $scope.rutaCom,
				url: $scope.urlUsuario,
                comentario: $scope.comentario,
				fecha: fechaActual,
            }
        }).
        success(function(data) {
            if(data == '0')
			{
                $scope.resultado = 'Comentario guardado con exito';
				$scope.mostrarComentarios();
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
	
	
	$scope.eliminarComentario = function(id)
	{
		$http({
            method: 'POST',
            url: '/comentarios/eliminar',
            params: {
				_id: id 
            }
        }).
        success(function(data) {
            if(data == '0')
			{
				console.log('Comentario Eliminado con exito');
				$scope.mostrarComentarios();
            }
			else
			{			
                console.log('Error numero '+data+' al intentar eliminar el comentario');
				$scope.resultado = 'Error al borrar el comentario';
            }
        }).
        error(function() {
            console.log('Error al intentar realizar la peticion al servidor');
			$scope.resultado = 'Error al borrar el comentario';
        });
	}
	   
	   
});