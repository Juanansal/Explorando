app.controller('Login', function($scope, $http, $location) 
{
    $scope.usuario = '';
	$scope.pass = '';
	$scope.resultado = '';
	
	
	$scope.pulsarLogin = function(){
		
		console.log('LOGIN PULSADO  '+$scope.usuario);
        $http({
            method: 'GET', 
			url: '/usuarios/login',
			params: { 
					  usuario: $scope.usuario,
					  pass: $scope.pass
					}
        }).
        success(function(data) 
		{
                console.log(data);
			    if(typeof(data) == 'object')
				  {
					  resultado = '';
					  
					  console.log(data);
					  
					  localStorage.clear();	  					  
					  localStorage.setItem("_id", data._id);
					  localStorage.setItem("usuario", data.usuario);
					  localStorage.setItem("nombre", data.nombre);			  
					  localStorage.setItem("esGuia", data.esGuia);
					  localStorage.setItem("esAdmin", data.esAdmin);
					  localStorage.setItem("esTwitter", false);
					  localStorage.setItem("url", data.urlFoto);
					  
					  if(data.urlFoto=='') localStorage.setItem("url", 'imagenes/defecto.png'); 
					  
					  window.location.href = '/principal.html';
					  
				  }
				else
				  {
					  if(data=='1') $scope.resultado = 'Error al acceder a la base de datos';
					  if(data=='2') $scope.resultado = 'Usuario no encontrado';
					  if(data=='3') $scope.resultado = 'Contraseña incorrecta';
					  				  
				  }	
            
        }).
        error(function() {
            console.log('Peticion para el login no enviada');
        });
			
    };

	
	
	
	
	
	
	
	
});