app.controller('DatosUsuario', function($scope, $http, $location) 
{
	
    $scope.usuario = localStorage.getItem('usuario');
	$scope.esGuia = localStorage.getItem('esGuia');
	$scope.esAdmin = localStorage.getItem('esAdmin');
	$scope.nombre = localStorage.getItem('nombre');
	$scope._id = localStorage.getItem('_id');
	$scope.esTwitter = localStorage.getItem('esTwitter');
	
	
	
	$scope.apellidos = '';
    $scope.ciudad = '';
    $scope.telefono = '';
	$scope.email = '';
	$scope.urlFoto = '';
	$scope.saldo = '';
	$scope.puntuacion = '';
	$scope.numeroVotos = '';
	$scope.media = '';
	  
	$scope.cargarUsuario = function() 
	{
		if($scope.usuario!=null)
		{
		
			$http({
				method: 'GET',
				url: '/usuarios/recuperar_usuario_por_usuario',
				params: {
					usuario: $scope.usuario
				}
			}).
			success(function(data) {
				if(typeof(data) == 'object'){
					$scope._id = data._id;
					$scope.usuario = data.usuario;
					$scope.nombre = data.nombre;
					$scope.apellidos = data.apellidos;  
					$scope.email = data.email;
					$scope.telefono	= data.telefono;			
					$scope.ciudad = data.ciudad;
					$scope.esGuia = data.esGuia;
					$scope.urlFoto = data.urlFoto;
					
					if($scope.urlFoto=='') $scope.urlFoto = 'imagenes/defecto.png'
					
					$scope.saldo = data.saldo;
					$scope.puntuacion = data.puntuacion;
					$scope.numeroVotos = data.numeroVotos;
					
					if(data.puntuacion !=null && data.numeroVotos!=null)
					{
						$scope.puntuacion = parseInt($scope.puntuacion);
						$scope.numeroVotos = parseInt($scope.numeroVotos);					
						$scope.media = ($scope.puntuacion/$scope.numeroVotos)*2;
					}	
					
					
				}else{
					console.log('Error '+data+' al intentar recuperar el usuario.');
				}            
			}).
			error(function() {
				console.log('Error al intentar recuperar el usuario.');
			});
		}
		else
		{
			console.log("Usuario no logeado");
		}
    };
	
	
	$scope.iniciarTwitter = function() 
	{
		
			var url = $location.absUrl();
			var res = url.split("?twitter=")
			opcion = res[1];
			
			console.log('OPCION: '+opcion);
		
			if(opcion=='true')
			{
				$http({
				method: 'GET',
				url: '/twitter/recogetDatos',
				params: {
				}
			}).
			success(function(data) 
			{
				
				if(data != '1')
				{
					localStorage.setItem("usuario", data.username);
					
					$http({
						method: 'GET', 
						url: '/usuarios/login',
						params: { 
								  usuario: data.id
								}
					}).
					success(function(data) 
					{
							//console.log(data);
							if(typeof(data) == 'object')
							  {
								  resultado = '';
								  
								  localStorage.clear();	  					  
								  localStorage.setItem("_id", data._id);
								  localStorage.setItem("usuario", data.usuario);
								  localStorage.setItem("nombre", data.nombre);
								  localStorage.setItem("esGuia", data.esGuia);
								  localStorage.setItem("esAdmin", data.esAdmin);
								  localStorage.setItem("esTwitter", true);
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
				
				}
					       
			}).
			error(function() {
				console.log('Error al intentar recuperar el usuario.');
			});
			}			
    };
	
	
	
	// Control del cambio de foto de perfil
	
	$scope.subirFotoPerfil = function()
	{
		
		console.log('Pasa por subirFotoPerfil');
		
	}
	
	
	$scope.estaLogin = function()
	{
		if($scope.usuario==null)
			return false;
		else	
			return true;
	};
	
	
	
	
});


