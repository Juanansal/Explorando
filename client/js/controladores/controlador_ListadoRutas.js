
app.controller('ListadoRutas', function($scope, $http) {
    $scope.rutas = [];
	$scope.activo = new Array;
	$scope.activoBoton = new Array;
	
	$scope.usuario = localStorage.getItem('usuario');
	
    $scope.InitCargarRutas = function()
	{
        $http({
            method: 'GET', url: '/rutas/listar'
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope.rutas = data;
            }else{
                console.log('Error al intentar recuperar las rutas.');
            }
        }).
        error(function() {
            console.log('Error al intentar realizar la peticion al servidor');
        });
    };
	
	
	$scope.rutasDelGuia = function(opc)
	{	
        $http({
            method: 'GET', url: '/rutas/listarRutasPorGuia',
			params: {
				       guia: $scope.usuario,
					   opcion: opc
					}
        }).
        success(function(data) 
		{
            if(typeof(data) == 'object')
			{
                $scope.rutas = data;
            }
			else
			{
                console.log('Error numero '+data+' al intentar recuperar las rutas');
            }
        }).
        error(function() 
		{
            console.log('Error al intentar realizar la peticion al servidor');
        });
    };
	
	$scope.rutasDelGuiaPublico = function(opc,guiaEnv)
	{	
        $http({
            method: 'GET', url: '/rutas/listarRutasPorGuia',
			params: {
				       guia: guiaEnv,
					   opcion: opc
					}
        }).
        success(function(data) 
		{
            if(typeof(data) == 'object')
			{
                $scope.rutas = data;
            }
			else
			{
                console.log('Error numero '+data+' al intentar recuperar las rutas');
            }
        }).
        error(function() 
		{
            console.log('Error al intentar realizar la peticion al servidor');
        });
    };
	
	$scope.rutasReservadas = function(opc)
	{
		//console.log("PASA POR AQUI!!!!!");
		$scope.rutas = [];
		
        $http({
            method: 'GET', url: '/reservas/listarReservasPorUsuario',
			params: {usuario: $scope.usuario}
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
				
				if(data.length>0)
				{
					$scope.reservas = data;
					
					for(var i=0; i<$scope.reservas.length; i++)
					  {  
						   $http({
								method: 'GET', url: '/rutas/recuperar_ruta_por_id',
								params: {
									      _id: $scope.reservas[i].rutaRes,
									      opcion: opc
										}
							}).
							success(function(data) {
								if(typeof(data) == 'object')
								{
									$scope.rutas.push(data);		
								}
								else
								{
									console.log('Error al intentar recuperar las ruta');
								}
							}).
							error(function() {
								console.log('Error al intentar realizar la peticion al servidor');
							});
					  }
				}
				else
				{
					// Aqui mostrar el codigo cuando no haya reservas
					console.log("Reservas no encontradas");
				}
				
				
            }else{
                console.log('Error al intentar recuperar las rutas.');
            }
        }).
        error(function() {
            console.log('Error al intentar realizar la peticion al servidor');
        });
    };
	
	
	
    $scope.cargarRutasGeo = function(opc)
	{
		var latitud;
		var longitud;
		
		if (navigator.geolocation) 
		  {
			navigator.geolocation.getCurrentPosition(function(position) 
			{
				
				if(opc==1 || opc==2)
				{		
			
					switch(opc)
					{
						case 1: if(marcaClick !=null)
								 {
									latitud = marcaClick.getPosition().lat();
									longitud = marcaClick.getPosition().lng();
								 }
								break;
								
						case 2: 
								latitud = position.coords.latitude;
								longitud = position.coords.longitude;
								break;
					}
			
			
					if(latitud != null)
					{
			
						$http({
							method: 'GET', 
							url: '/rutas/busquedaGeo',
							params: {
								coord: {lat: latitud, lng: longitud},
								distancia: 5000
							}
							
						}).
						success(function(data) {
							if(typeof(data) == 'object'){
								$scope.rutas = data;
							}else{
								console.log('Error al intentar recuperar las rutas.');
							}
						}).
						error(function() {
							console.log('Error al intentar realizar la peticion al servidor');
						});
					}
					else
					{
						console.log("Coordenadas no encontradas");
					}
				}
				else
				{
					console.log("Error en los parametros");
				}
			});
		}
    };
	
	
	

	
	$scope.dibujarRuta = function(id, indice)
	{
		console.log(id);
		
		console.log("Pasa por buscarRuta");
		console.log("Numero de id de la ruta: "+id);

			$http({
				method: 'GET',
				url: '/rutas/recuperar_ruta_por_id',
				params: {
					_id: id
				}
			}).
			success(function(data) 
			{
					var inicio;
					var llegada;
					var wp;
					
					// pintar boton activo					
					$scope.activo = [];
					$scope.activo[indice]='active';
					
					$scope.activoBoton = [];
					$scope.activoBoton[indice]='boton-lista-info-activo'
					
					// Pasar coordenadas a un formato correcto
					nuevowp = new Array();				
					inicio = JSON.parse(data.inicioC);
					llegada = JSON.parse(data.llegadaC);
					
					// Caso especial para los puntos intermedios
					if(data.wpC != null)
					{
					
					    if(data.wpC[0] == '{')
							{
							  wp = JSON.parse(data.wpC);
							  nuevowp.push({'location': wp});		
							}
						else
						    {
								for(var i=0; i<data.wpC.length; i++)
								  {					
									  wp = JSON.parse(data.wpC[i]);
									  nuevowp.push({'location': wp});				  
								   }
							} 				
					}
					
					// Pintar la ruta
					directionsService.route
					({
						origin: inicio,
						destination: llegada,
						waypoints: nuevowp,
						travelMode: google.maps.DirectionsTravelMode.WALKING
					}, function(response, status) 
					   {
					  if (status === google.maps.DirectionsStatus.OK) 
						{
						   directionsDisplay.setDirections(response);
						} 
						else 
						{
						   window.alert('Directions request failed due to ' + status);
						}
						
						coord = directionsDisplay.directions.routes[0].legs[0];				 
						
						llee = {'lat': coord.end_location.lat(), 'lng':coord.end_location.lng()};
						console.log('PINTADO FINAL: '+llee.lat+' '+llee.lng);
											
						
					});		       
			}).
			error(function() 
			{
				console.log('Error al intentar realizar la peticion al servidor');
			});
	};

	
   
});