
var map;
var directionsService;
var directionsDisplay;

var marcaMiPosicion;

function initMapMisRutas()
 {    
		directionsService = new google.maps.DirectionsService;
		directionsDisplay = new google.maps.DirectionsRenderer
		  ({
			draggable: true,
			map: map
		  });
		
        map = new google.maps.Map(document.getElementById('map'), 
        {
            center: { lat: 40.425438, lng: -3.691940 },
            zoom: 6
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
			  
			  marcaMiPosicion = new google.maps.Marker({
			  position: pos,
			  map: map,
			  title: 'Tu ubicación'
			  });
			  	  
			  console.log(marcaMiPosicion.getPosition());
			  ubicacion = pos;
			  console.log("Ubicacion: "+ubicacion);
			});
			
			
			
			
		  }
		else
		  {
			  console.log("El navegador no soporta geolocalizacion");
		  }
  }