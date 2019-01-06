

/* VARIABLES QUE SE USAN YA DECLARADAS

directionsDisplay.getDirections()   --> Objeto con todas las coordenadas de la ruta

*/

app.controller('CrearRuta', function($scope, $http) 
{
	
$scope.fecha = '';
$scope.descripcion = '';
$scope.duracion = '';
$scope.inicio = '';
$scope.llegada = '';
$scope.hora = '';
$scope.capacidad = '';
$scope.apuntados = '';
$scope.guia = localStorage.getItem('usuario');
$scope.precio = '';
$scope.resultado = '';
	
	
	$scope.pulsarCrearRuta = function()
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
			  
			  if($scope.titulo!='' &&  $scope.descripcion!='' && $scope.hora!='' && $scope.duracion != '' && $scope.inicio!='' && $scope.llegada!='' && $scope.precio!='' && $scope.capacidad!='' 
			     && !isNaN($scope.capacidad) && !isNaN($scope.precio))
			  {
				  $http({
				method: 'POST',
				url: '/rutas/crearRuta',
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
					llegadaC: llegada
				}
				}).
				success(function(data) {
					if(data=='0')
					{
						$scope.resultado = "Ruta creada correctamente";
  
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
			 else
			  {
				 if(isNaN($scope.capacidad))
				   {
					   $scope.resultado="Capacidad debe ser un numero";
				   } 
				 else
				   {
					   if(isNaN($scope.precio))
					     {
							  $scope.resultado="Precio debe ser un numero";
						 }
						else
						 {
							 $scope.resultado="Faltan datos por introducir";
						 }	
				   }
				 
			  }	 
			  
		  }
		  
		  
	};
	
});