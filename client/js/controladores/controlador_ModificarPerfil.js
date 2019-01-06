app.controller('ModificarPerfil', function($scope, $http) 
{
    $scope.usuario = localStorage.getItem('usuario');
	$scope.esguia = localStorage.getItem('esguia');

	$scope._id = null;
	$scope.pass = '';
    $scope.nombre = '';
	$scope.apellidos = '';
    $scope.ciudad = '';
    $scope.telefono = '';
	$scope.email = '';
	$scope.esguia = 'false';
	$scope.foto = null;
	
	$scope.mensaje = '';
  
	$scope.cargarUsuario = function() 
	{
		if($scope.usuario!='')
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
					$scope.pass = data.pass;
					$scope.nombre = data.nombre;
					$scope.apellidos = data.apellidos;  
					$scope.email = data.email;
					$scope.telefono	= data.telefono;			
					$scope.ciudad = data.ciudad;
					$scope.esguia = data.esguia;
					
					localStorage.setItem("url", data.urlFoto);
					
				}else{
					console.log('Usuario no devuelto por la base de datos');
				}            
			}).
			error(function() {
				console.log("Error en la petición a la base de datos");
			});
		}
		else
		{
			console.log("Usuario no logeado");
		}
    };
	
	
	$scope.cargarFoto = function()
	{
		console.log('Pasa por cargar fotos');
	};
	
	
	
	$scope.modificarPerfil = function()
	{
		
		
		// LECTURA DE LA IMAGEN DEL PERFIL
				
			var f = document.getElementById('inputFotoPerfil').files[0];
			
	/*		
		    var r = new FileReader();
			var foto = null;					 
				 
			if(f)
			{		 
		      console.log('PASA POR AQUI: '+f);
		      r.onloadend = function(e)
		       {
				 foto = e.target.result;
				 
				 fd = new FormData;
				 
				fd.append("userfile", f);
				 
				 console.log('FD: '+fd);
	*/			 
	      var file = $scope.foto;
		  console.log('FOTO: '+$scope.foto);
	
 
				 $http({
					method: 'POST',
					headers: 
					{
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
					url: '/usuarios/modificarPerfil',
					params: {
						usuario: $scope.usuario,
						pass: $scope.pass,
						nombre: $scope.nombre,
						apellidos: $scope.apellidos,
						email: $scope.email,
						telefono: $scope.telefono,      
						ciudad: $scope.ciudad,
						esguia: $scope.esguia,				
						_id: $scope._id,
						foto: f
					}
				}).
				success(function(data) {
					if(data=='0'){
						console.log("Datos modificados con exito");
						localStorage.setItem("nombre", $scope.nombre);
						$scope.mensaje = "Datos modificados con exito";
						
						
						var fd = new FormData();
						fd.append('file', $scope.foto);
						
						console.log('fd: '+fd)
						/*
						$http('/usuarios/subirFotoPerfil', fd, 
						{
							transformRequest: angular.identity,
							headers: {'Content-Type': undefined}
						})
						*/
						
						/*
						var formData = new FormData();
						formData.append('file', $scope.foto);
						
						$http({
							method: 'POST',
							url: '/usuarios/subirFotoPerfil',
							headers: {
								'Content-Type': 'undefined'
							},
							data: {
								upload: formData
							},
							 transformRequest: angular.identity
						
						
						})
						.success(function (data) {

						})
						.error(function (data, status) {

						});
						*/			
						
						
						
						
					}else{
						console.log("Error numero "+data+" al modificar los datos del usuario");				
						$scope.mensaje = "Error al modificar los datos del usuario";
					}
				}).
				error(function() {
					console.log("Error al conectar con la base de datos");
					$scope.mensaje = "Error al conectar con la base de datos";
				});
		
		
        
	}
	
	
});


