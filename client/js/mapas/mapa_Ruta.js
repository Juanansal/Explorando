
var map;
var directionsService;
var directionsDisplay;

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