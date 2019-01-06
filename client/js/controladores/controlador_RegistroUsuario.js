
app.controller('RegistroUsuario', function($scope, $q, $http) 
{
	$scope.usuario = '';
	$scope.pass1 = '';
	$scope.pass2 = '';
	$scope.email = '';
	$scope.nombre = '';
	$scope.apellidos = '';
	$scope.ciudad = '';
	$scope.resultado= '';
	
	$scope.validado = false;
	$scope.v_usuario = false;
	$scope.v_pass = false;


	// v_usuario = true si esta el usuario en la base de datos
	// v_usuario = false si el usuario no esta en la base de datos
	
	$scope.validar = function()
	{	
	
		//console.log('USUARIO: '+$scope.v_usuario+"        PASS: "+$scope.v_pass);
	
	
		if($scope.v_usuario==true && $scope.v_pass==true)
		  {
			  $scope.validado = true;
		  }
		else
		  {
			  $scope.validado = false;
		  }
		  
		 console.log("validado GENERAL: "+$scope.validado);
		 console.log("validado usuario: "+$scope.v_usuario);
		 console.log("validado pass: "+$scope.v_pass);
	     console.log("----------------------------------");
	 	 console.log("                                  "); 
		  
	};

	
	
	
	$scope.validarUsuario = function()
	{	
	
        $http({
            method: 'GET', 
			url: '/usuarios/comprobar_usuario',
			params: { usuario: $scope.usuario }
        }).
        success(function(data) 
		{
			if(data=='1')
			{
                $scope.v_usuario = true;				
			}
			if(data=='0')	
			{
				$scope.v_usuario = false;
				$scope.resultado = "El usuario ya existe";
			}
			$scope.validar();
            
        }).
        error(function() {
            $scope.v_usuario = false;
			$scope.validar();
			console.log('Error en la petición de validarUsuario');
        });

		
	};
	
	
	// Si la contraseña valida correctamente v_pass = true si no v_pass = false
	$scope.validarPass = function()
	{
		if($scope.pass1 == $scope.pass2)
		
			  $scope.v_pass = true;
		else	
			  $scope.v_pass = false;
			  $scope.resultado = "Las contraseñas no coinciden";
		  
		$scope.validar();
		
	};
	
	$scope.enviarDatos = function()
	{
		//console.log('PASA POR AQUIIIIIIIIIIIIIII');
		
		
		if($scope.apellidos!='' && $scope.email!='' && $scope.nombre!='')
		{
			$http({
				method: 'POST',
				url: '/usuarios/registroUsuario',
				params: {
					usuario: $scope.usuario,
					pass: $scope.pass1,
					nombre: $scope.nombre,
					apellidos: $scope.apellidos,
					email: $scope.email,
					telefono: '',      
					ciudad: $scope.ciudad,
					esguia: 'false',				
					_id: null
				}
			}).
			success(function(data) {
				if(data=='0'){
					console.log('Usuario '+$scope.usuario+' registrado con exito'); 
					$scope.resultado = "Usuario registrado con exito";
				}else{
					console.log('Error numero '+data+' al guardar el usuario - NO GUARDADO');
				}
			}).
			error(function() {
				console.log('Error al intentar realizar la peticion de guardar usuario.');
			});
		}
		else
		{
			$scope.resultado = "Faltan datos por rellenar";
		}
	};
	

	$scope.registrarUsuario = function() 
	{
		$scope.validar();
		console.log('PASA POR REGISTRO USUARIO  '+$scope.validado);
		
		if($scope.validado==true)
		{
			$scope.enviarDatos();	
		}
		
	};
	
});