
console.log("mapas.js CARGADO");

var map;
var directionsService;
var directionsDisplay;


// MAPA DE LA PAGINA INDEX.HTML
function initMap()
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
		
  }
  
  
// MAPA DE LA PAGINA DE RUTA
function initMapRuta()
 {    
	   directionsService = new google.maps.DirectionsService;
	   directionsDisplay = new google.maps.DirectionsRenderer;
       map = new google.maps.Map(document.getElementById('map'), 
        {
            center: { lat: 40.425438, lng: -3.691940 },
            zoom: 12,
            draggable: false,
            scrollwheel: false,
            disableDoubleClickZoom: true
        });
		directionsDisplay.setMap(map);
		
  }
