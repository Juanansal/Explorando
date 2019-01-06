
app.controller('ModificarRuta', function($scope, $http, $location) {
    $scope._id = $location.search().id;
    $scope.titulo = '';
    $scope.fecha = ''
	$scope.hora = '';
    $scope.descripcion = '';
	$scope.duracion = '';
	$scope.inicio = '';
	$scope.llegada = '';
	$scope.capacidad = '';
	$scope.apuntados = '';
	$scope.guia = '';
	$scope.precio = '';
	
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
				
				$scope.dibujarRuta($scope._id);
				

            }else{
                alert('Ruta no encontrada');
            }            
        }).
        error(function() {
            alert('Error al realizar la peticion.');
        });
    };
	
	
	
	$scope.dibujarRuta = function(id)
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
	
	
	$scope.pulsarModificarRuta = function()
	{
		if(directionsDisplay.getDirections()==null)
		  {
			  console.log("No se ha definido aun la ruta");
			  $scope.resultado = "No se ha definido aun la ruta";
		  }
		else
		  {
			     // Pillar punto de inicio
			  	 coord = directionsDisplay.directions.routes[0].legs[0];				 
				 inicio = {'lat': coord.start_location.lat(), 'lng':coord.start_location.lng()};
				 
				 // Pillar punto final
				 var tam = directionsDisplay.directions.routes[0].legs.length;		
				 
				 if(tam > 1)
				   {
					   llegada = directionsDisplay.directions.routes[0].legs[tam-1]
					   llegada = {'lat': directionsDisplay.directions.routes[0].legs[tam-1].end_location.lat(), 'lng':directionsDisplay.directions.routes[0].legs[tam-1].end_location.lng()};
				   }
				 else
				   {
					    llegada = {'lat': coord.end_location.lat(), 'lng':coord.end_location.lng()};
				   }				   				 


				// Pillar puntos intermedios   
				
				var wp = new Array();
				
				if(tam > 1)
				  {
					  for(var i=0; i<tam-1; i++)
					    {
							var aux = directionsDisplay.directions.routes[0].legs[i];
							console.log(aux);
							wp[i] = [aux.end_location.lat(),aux.end_location.lng()];							
						} 
				  }	
				 console.log(wp);
				  
				if(tam > 1)
				  {  
					 wp = coord.via_waypoints;
					 var aux;
					 
					 for(var i=0;i<tam-1;i++)
					  { 
					    aux = directionsDisplay.directions.routes[0].legs[i].end_location;
						intermedio[i] = {'lat': aux.lat(), 'lng': aux.lng()};
					  } 
				  }
				  

				 console.log(intermedio);
				  
			     inicio = JSON.stringify(inicio);
				 wp = JSON.stringify(wp);
				 llegada = JSON.stringify(llegada);
			  
			  
			  console.log("ID: "+$scope._id);
			  
			  $http({
				method: 'POST',
				url: '/rutas/modificarRuta',
				params: {
					titulo: $scope.titulo,
					descripcion: $scope.descripcion,
					fecha: $scope.fecha,
					hora: $scope.hora,
					duracion: $scope.duracion,
					inicio: $scope.inicio,
					llegada: $scope.llegada,
					capacidad: $scope.capacidad,
					apuntados: $scope.apuntados,
					guia: $scope.guia,
					precio: $scope.precio,
					inicioC: inicio,
					wpC: intermedio,
					llegadaC: llegada,
					_id: $scope._id
				}
				}).
				success(function(data) {
					if(data=='0')
					{
						$scope.resultado = "Ruta modificada correctamente";
  
					}
					else
					{
						$scope.resultado = "Error al crear la ruta";
						console.log('Error numero '+data+' al intentar guardar la ruta');						
					}
				}).
				error(function() {
					console.log('Error al intentar realizar la peticion al servidor');
					$scope.resultado = "Error al crear la ruta";
				});
				  }
		  
		  
	};
	
	
	
	
});