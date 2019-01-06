
var map;
var directionsService;
var directionsDisplay;

var marcaClick;
var circuloClick;
var marcaMiPosicion;

function initMapPrincipal()
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
		
		// creacion del boton de centrado
		
		
		google.maps.event.addListener(map, 'click', function(event) {
		ponerMarca(event.latLng, map);
		});
		
		console.log("pruebas crear div");		
		botoncentrado = crearBotonCentrado(map);
		
		
		
  }
  
  
  
  
function dibujarRuta(id,inicio,llegada)
{
	console.log("Pasa por buscarRuta");
	console.log("Numero de id de la ruta: "+id);

	// AQUI DEBERIAMOS ACCEDER A LA BASES DE DATOS usando la id

	inicio = {lat: 41.85, lng: -87.65};
	llegada = {lat: 41.85, lng: -87.69};
	puntosControl = new Array();
	
	puntosControl.push({location: {lat: 41.85, lng: -87.66}});
	puntosControl.push({location: {lat: 41.85, lng: -87.67}});
	puntosControl.push({location: {lat: 41.75, lng: -87.67}});
	
	console.log(puntosControl);
	
	directionsService.route
			({
				origin: inicio,
				destination: llegada,
				waypoints: puntosControl,
				travelMode: google.maps.DirectionsTravelMode.WALKING
			}, function(response, status) 
			   {
			  if (status === google.maps.DirectionsStatus.OK) 
			    {
			       directionsDisplay.setDirections(response);
			    } 
			    else 
				{
			       window.alert('Directions request failed due to ' + status);
			    }
		  });
	
}

function crearBotonCentrado(map)
{
	var boton = document.createElement('div');
	boton.style.margin = '10px';
	boton.style.padding = '6px';
	boton.style.backgroundColor = '#EEF';
	boton.style.border = '1px solid black';
	boton.innerHTML = 'Ir a tu ubicacion';
//	
	
	return boton;
}


function ponerMarca(location, map) 
{

  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
    if(marcaClick == null)
	{
		marcaClick = new google.maps.Marker({
			position: location,
			map: map
		});
		
		circuloClick = new google.maps.Circle({
			strokeColor: '#3333FF',
			strokeOpacity: 0.8,
			strokeWeight: 2,
		    fillColor: '#BBBBFF',
			fillOpacity: 0.35,
		    map: map,
		    center: location,
		    radius: 5000
    });
	}	
	else
	{
		marcaClick.setPosition(location);
		circuloClick.setCenter(location);
	}

}