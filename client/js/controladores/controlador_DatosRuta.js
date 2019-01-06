
app.controller('DatosRuta', function($scope, $http, $location) {
    $scope._id = $location.search().id;
    $scope.titulo = '';
    $scope.fecha = ''
    $scope.descripcion = '';
	$scope.duracion = '';
	$scope.inicio = '';
	$scope.llegada = '';
	$scope.capacidad = '';
	$scope.apuntados = '';
	$scope.guia = '';
	$scope.NombreGuia = '';
	$scope.precio = '';
	
	$scope.usuarios = new Array();
	$scope.dataUsuarios = new Array();
	$scope.fotos = new Array();
	
	var url = $location.absUrl();
	var res = url.split("?id=")
	$scope._id = res[1];
	
	
    $scope.recuperarRuta = function() 
	{
		
		console.log($scope._id);
		
        $http({
            method: 'GET',
            url: '/rutas/recuperar_ruta_por_id',
            params: {
                _id: $scope._id
            }
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope._id = data._id;
                $scope.titulo = data.titulo;
                $scope.descripcion = data.descripcion;
                $scope.fecha = new Date(data.fecha);
                $scope.hora = data.hora;
				$scope.duracion = data.duracion;
				$scope.inicio = data.inicio;
				$scope.llegada = data.llegada;
				$scope.capacidad = data.capacidad;
				$scope.apuntados = data.apuntados;
				$scope.guia = data.guia;
				$scope.precio = data.precio;
				
				$scope.recuperarFotos();
				
				// Consulta a la base de datos para buscar el nombre del guia				
				$http({
					method: 'GET',
					url: '/usuarios/recuperar_nombre_por_usuario',
					params: {
						usuario: $scope.guia
					}
				}).
				success(function(data) 
				{
						
				if(data!=0 && data!=1 && data!=2)	
				{
					$scope.nombreGuia = data.nombre;
					$scope.urlFotoGuia = data.url;
				}
         
				}).
				error(function() {
					console.log('Error al realizar la peticion.');
				});

            }else{
                console.log('Ruta no encontrada');
            }            
        }).
        error(function() {
           console.log('Error al realizar la peticion.');
        });
    };
	
	
	$scope.recuperarFotos = function()
	{
		$http({
            method: 'GET',
            url: '/fotosRuta/recuperarFotoRutaPorIdRuta',
            params: {
                idRuta: $scope._id
            }
        }).
        success(function(data) {
            if(typeof(data) == 'object')
				{
					var aux;
					
					for(i=0;i<data.length || i>6;i++)
					{						
						aux = data[i].url;
						$scope.fotos.push(aux);
						
						console.log($scope.fotos[i]);
					}
				}
		}).
		error(function() {
			console.log('Error al realizar la peticion.');
		});
	}
	
	
	$scope.recuperarUsuariosReservas = function()
	{
		$http({
            method: 'GET',
            url: '/reservas/listarReservasPorRuta',
            params: {
                idRuta: $scope._id
            }
        }).
        success(function(data) 
		{
			if(typeof(data) == 'object')
			{
				$scope.usuarios = data;
				
				
				for(i=0; i<data.length; i++)
				  {
					  //console.log(data[i].usuarioRes);
					  
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
								$scope.dataUsuarios.push(data2);
								//console.log('PASA POR AQUI');
							}	
						}).
						error(function() {
							console.log('Error al realizar la peticion.');
						});
				  }
				
			}	
        }).
        error(function() {
            console.log('Error al realizar la peticion.');
        });
	};
	
	
	
	
	$scope.initDatosRuta = function()
	{
		$scope.recuperarRuta();
		$scope.recuperarUsuariosReservas();		
	};
	
	
	

});