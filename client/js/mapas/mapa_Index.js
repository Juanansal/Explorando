
var map;
var directionsService;
var directionsDisplay;


// MAPA DE LA PAGINA INDEX.HTML
function initMapIndex()
 {    
	   directionsService = new google.maps.DirectionsService;
	   directionsDisplay = new google.maps.DirectionsRenderer;
       map = new google.maps.Map(document.getElementById('map'), 
        {
            center: { lat: 8.385088, lng: -0.512985 },
            zoom: 12,
            draggable: false,
            scrollwheel: false,
            disableDoubleClickZoom: true
        });
		directionsDisplay.setMap(map);
		
		// localicacion centrada en el mapa (esto permanece a la espera de la confirmacion del usuario)
		if (navigator.geolocation) 
		  {
			navigator.geolocation.getCurrentPosition(function(position) 
			{
			  var pos = 
			  {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			  };
			  map.setCenter(pos);
			  map.setZoom(16);
			  
			  var marker = new google.maps.Marker({
			  position: pos,
			  map: map,
			  title: 'Tu ubicación'
			  
			  
			});
			  ubicacion = pos;
			  console.log("Ubicacion: "+ubicacion);
			});
		  }
		else
		  {
			  console.log("El navegador no soporta geolocalizacion");
		  }
		
  }