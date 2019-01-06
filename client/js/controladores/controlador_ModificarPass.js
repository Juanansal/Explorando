app.controller('ModificarPass', function($scope, $http) 
{
    $scope.usuario = localStorage.getItem('usuario');
	$scope.esguia = localStorage.getItem('esguia');

	$scope._id = null;
	$scope.pass = '';
	$scope.nuevapass1 = '';
	$scope.nuevapass2 = '';
	$scope.mensaje = '';
  
  
  $scope.modificarPass = function()
  {
	  if($scope.usuario != '')
	    {

		  if($scope.nuevapass1=='')
			{
				$scope.mensaje = 'La nueva contraseña no puede estar vacia';
			}
		  else if($scope.nuevapass1 == $scope.nuevapass2)
			{
				$http({
						method: 'POST',
						url: '/usuarios/modificar_pass',
						params: {
							usuario: $scope.usuario,
							pass1: $scope.nuevapass1,
							pass2: $scope.nuevapass2
						}
					}).
					success(function(data) 
					  {
						 if(data=='0')
						   {
							   $scope.mensaje = 'Contraseña modificada con exito';
						   }
						 else
						   {
							   $scope.mensaje = 'Contraseña no se ha modificado';
							   console.log('Error numero: '+data);
						   }         
						}).
						error(function() {
							console.log("Error en la petición a la base de datos");
							$scope.mensaje = 'Contraseña no se ha modificado';
						});
			}
		  else
			{
				console.log("Usuario no logeado");
			}
				
			
		}
	  else
	    {
		    console.log('Usuario no logeado');
        }
		  
	  
  };
	
	
});
