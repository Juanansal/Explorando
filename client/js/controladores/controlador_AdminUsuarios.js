
app.controller('AdminUsuarios', function($scope, $http) {
    $scope._id = null;
	$scope.id = '';
	$scope.usuario = '';
	$scope.pass = '';
    $scope.nombre = '';
	$scope.apellidos = '';
    $scope.ciudad = '';
    $scope.telefono = '';
	$scope.email = '';
	$scope.esGuia = 'false';
    $scope.rutas = [];
	

    $scope.cargarClientes = function(){
        $http({
            method: 'GET', url: '/usuarios/listar'
        }).
        success(function(data) {
            if(typeof(data) == 'object'){
                $scope.rutas = data;
            }else{
                alert('Error al intentar recuperar los clientes.');
            }
        }).
        error(function() {
            alert('Error al intentar recuperar los clientes.');
        });
    };
	
	
	/*
    $scope.comprobarUsuario = function(user){
		
		user = "Pedro54";
		
        $http({
            method: 'GET', 
			url: '/usuarios/comprobar_usuario',
			params: { usuario: user }
        }).
        success(function(data) 
		{
                console.log(data+"    "+user);
            
        }).
        error(function() {
            alert('Error al comprobar usuarios (MAL TODO)');
        });
    };
	*/
	
    $scope.guardarUsuario = function() {
		
		console.log("scope de apellidos: "+$scope.apellidos);	
		
        $http({
            method: 'POST',
            url: '/usuarios/guardar',
            params: {
				usuario: $scope.usuario,
				pass: $scope.pass,
                nombre: $scope.nombre,
				apellidos: $scope.apellidos,
				email: $scope.email,
				telefono: $scope.telefono,      
				ciudad: $scope.ciudad,
				esGuia: $scope.esGuia,				
                _id: $scope._id
            }
        }).
        success(function(data) {
            if(data == '0'){
                $scope.limpiarDatos();
                $scope.cargarClientes();    
            }else{
                console.log('Error numero '+data+' al intentar guardar el cliente.');
            }
        }).
        error(function() {
            console.log('Error al realizar la peticion a la base de datos');
        });
    }
	
	
    $scope.recuperarCliente = function(indice) {
        $http({
            method: 'GET',
            url: '/usuarios/recuperar_usuario_por_id',
            params: {
                _id: indice
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
				$scope.esGuia = data.esGuia;
				
            }else{
                alert('Error al intentar recuperar el cliente.');
            }            
        }).
        error(function() {
            alert('Error al intentar recuperar el cliente.');
        });
    };
	
    $scope.eliminarCliente = function(indice) {
        $http({
            method: 'POST',
            url: '/usuarios/eliminar',
            params: {
                _id: indice
            }
        }).
        success(function(data) {
            if(data == '0'){
                $scope.limpiarDatos();
                $scope.cargarClientes();
            }else{
                console.log('Error al intentar eliminar el usuario');
            }            
        }).
        error(function() {
            console.log('Peticion a la base de datos no realizada al eliminar el usuario');
        });
    };
    $scope.limpiarDatos = function() {
        $scope._id = null;
		$scope.usuario = '';
		$scope.pass = '';
        $scope.nombre = '';
		$scope.apellidos = '';
        $scope.email = '';
        $scope.telefono = '';
        $scope.ciudad = '';
		$scope.esGuia= 'false';
    };
	
});