
app.controller('AdminRutas', function($scope, $http) {
    $scope._id = null;
    $scope.titulo = '';
    $scope.fecha = ''
    $scope.descripcion = '';
	$scope.duracion = '';
	$scope.inicio = '';
	$scope.llegada = '';
	$scope.capacidad = '';
	$scope.apuntados = '';
	$scope.guia = '';
	$scope.precio = '';
    $scope.rutas = [];
	
    $scope.cargarRutas = function(){
        $http({
            method: 'GET', 
			url: '/rutas/listar'
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
	
	
    $scope.guardarRuta = function() {
		
		// AQUI SE TENDRA QUE TRATAR LA FECHA DEL FORMULARIO QUE ESCRIBE EL USUARIO
		
		$scope.fecha = new Date();
		
        $http({
            method: 'POST',
            url: '/rutas/guardar',
            params: {
                titulo: $scope.titulo,
                descripcion: $scope.descripcion,
                fecha: $scope.fecha,
				duracion: $scope.duracion,
				inicio: $scope.inicio,
				llegada: $scope.llegada,
				capacidad: $scope.capacidad,
				apuntados: $scope.apuntados,
				guia: $scope.guia,
				precio: $scope.precio,
                _id: $scope._id
            }
        }).
        success(function(data) {
            if(data=='0'){
                $scope.limpiarDatos();
                $scope.cargarRutas();    
            }else{
                console.log('Error numero '+data+' al intentar guardar la ruta');
            }
        }).
        error(function() {
            console.log('Error al intentar realizar la peticion al servidor');
        });
    }
	
	
	
    $scope.recuperarCliente = function(indice) {
        $http({
            method: 'GET',
            url: '/rutas/recuperar_ruta_por_id',
            params: {
                _id: indice
            }
        }).
        success(function(data) 
		{
             if(typeof(data) == 'object')
			 {
                $scope._id = data._id;
                $scope.titulo = data.titulo;
                $scope.descripcion = data.descripcion;
                $scope.fecha = data.fecha;
				$scope.duracion = data.duracion;
				$scope.inicio = data.inicio;
				$scope.llegada = data.llegada;
				$scope.capacidad = data.capacidad;
				$scope.apuntados = data.apuntados;
				$scope.guia = data.guia;
				$scope.precio = data.precio;

            }
			else
			{
                console.log('Error numero '+data+' al intentar recuperar la ruta por id');
            }            
        }).
        error(function() 
		{
            console.log('Error al intentar realizar la peticion al servidor');
        });
    };
	

    $scope.eliminarCliente = function(indice) {
        $http({
            method: 'POST',
            url: '/rutas/eliminar',
            params: {
                _id: indice
            }
        }).
        success(function(data) {
            if(data == '0')
			{
                $scope.limpiarDatos();
                $scope.cargarRutas();
            }
			else
			{
                console.log('Error numero '+data+' al intentar eliminar la ruta');
            }            
        }).
        error(function()
		{
            console.log('Error al intentar realizar la peticion al servidor');
        });
    };
    $scope.limpiarDatos = function() {
        $scope._id = null;
        $scope.titulo = '';
        $scope.descripcion = '';
        $scope.fecha = '';
		$scope.duracion = '';
		$scope.inicio = '';
		$scope.llegada = '';
		$scope.capacidad = '';
		$scope.apuntados = '';
		$scope.guia = '';
		$scope.precio = '';
    };
});