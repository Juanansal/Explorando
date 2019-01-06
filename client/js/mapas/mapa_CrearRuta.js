 
 /****************************Mapa de la página de CrearRuta *******************************/ 
   
var map;
var directionsService;
var directionsDisplay;
var ubicacion;   
   
var inicio;
var llegada;
var intermedio = new Array();   

var pintar = 0;

// Variables de las marcas del mapa
var puntoInicio = null;
var puntoLlegada = null;
var puntosIntermedios = new Array();   


  
function initMapCrearRuta()
 {    
	   directionsService = new google.maps.DirectionsService;
	   //directionsDisplay = new google.maps.DirectionsRenderer;
	   
	   directionsDisplay = new google.maps.DirectionsRenderer({
		draggable: true,
		map: map
	  });
	  
	  console.log(directionsDisplay);
	   
		
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
		
		// Creación de la interfaz
		
		interfaz = crearInterfazMapa(map);
		map.controls[google.maps.ControlPosition.TOP_CENTER].push(interfaz);
		
		// Listeners	
		
		 map.addListener('click', function(event) 
		 {
			 //console.log(directionsDisplay.getDirections());
			 
			// Pinta el boton de inicio 
			if(pintar==1) 
			{
				modificarInicio(event.latLng);
			}
			
			//
			if(pintar==2) 
			{
				pintarIntermedio(event.latLng);
			}
			
			if(pintar==3) 
			{
				modificarLlegada(event.latLng);
			}
			
		 });
		
  }

  
function modificarInicio(location) 
{
	
  if(puntoInicio == null)
    {
		puntoInicio = new google.maps.Marker({
		position: location,
		map: map
        });
		inicio = location;
		
	}
   else
    {
		puntoInicio.setPosition(location);
		inicio = location;
	}   
  pintar = 0;	
  dibujarRuta();
}

function pintarIntermedio(loc) 
{
		var punto = new google.maps.Marker({
		position: loc,
		map: map
        });
		
		puntosIntermedios.push(punto);
		intermedio.push({location: loc})
		dibujarRuta();
		pintar = 0;
}

function modificarLlegada(location) 
{
	
  if(puntoLlegada == null)
    {
		puntoLlegada = new google.maps.Marker({
		position: location,
		map: map
        });
		
		llegada = location;
		
	}
   else
    {
		puntoLlegada.setPosition(location);
		llegada = location;
	}  
	
  pintar = 0;	
  dibujarRuta();	
}

  
function crearInterfazMapa(map)
{
	var div = document.createElement('div');
	div.style.margin = '10px';
	div.style.padding = '6px';
	div.style.backgroundColor = '#EEF';
	div.style.border = '1px solid black';
	div.style.textAlign = 'center';
	
	var h5 = document.createElement('h5');
	h5.innerHTML = 'Manejadores del mapa';
	h5.setAttribute("class","top-margin-2");
	div.appendChild(h5);
	
	var boton1 = document.createElement('button');
	boton1.setAttribute("class","botonMapa");
	boton1.value = 'Marcar Inicio';
	boton1.innerHTML = 'Marcar Inicio';
	div.appendChild(boton1);
	
	var boton2 = document.createElement('button');
	boton2.setAttribute("class","botonMapa");
	boton2.value = 'Marcar Punto Intemedio';
	boton2.innerHTML = 'Marcar Punto Intemedio';
	div.appendChild(boton2);
	
	var boton3 = document.createElement('button');
	boton3.setAttribute("class","botonMapa");
	boton3.value = 'Marcar Final';
	boton3.innerHTML = 'Marcar Final';
	div.appendChild(boton3);

    // Listeners	
	
	boton1.addEventListener('click', pulsaBoton1);
	boton2.addEventListener('click', pulsaBoton2);
	boton3.addEventListener('click', pulsaBoton3);
	
	return div;
}  

// Pintara y modificara el punto de inicio
function pulsaBoton1()
{
	pintar = 1;
	console.log("Cambiado a modo Pintar Inicio");
}

function pulsaBoton2()
{
	pintar = 2;
	console.log("Cambiado a modo Pintar Puntos de Control");
}

function pulsaBoton3()
{
	pintar = 3;
	console.log("Cambiado a modo Pintar Final");
}
 

function ocultarBotones()
{
	puntoInicio.setMap(null);
	puntoLlegada.setMap(null);
	
	
	if(puntosIntermedios.length!=0)
    {		
		for(var i=0; i<puntosIntermedios.length;i++)
		  {
			  console.log('Inicio: '+puntoInicio);
			  console.log('Intermedio: '+puntosIntermedios[0]);
			  console.log('Final: '+puntoLlegada);
			  puntosIntermedios[i].setMap(null);
		  }
	}
	
	
}

function mostrarBotones()
{
	puntoInicio.setMap(map);
	puntoLlegada.setMap(map);
}
 
  
function dibujarRuta()
{
	
	if(puntoInicio!=null && puntoLlegada!= null)
	  {
		 ocultarBotones();	 
		 
		 directionsService.route
			({
				origin: inicio,
				destination: llegada,
				waypoints: intermedio,
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
	
	//puntosControl = new Array();
	
	//puntosControl.push({location: {lat: 41.85, lng: -87.66}});
	//puntosControl.push({location: {lat: 41.85, lng: -87.67}});
	//puntosControl.push({location: {lat: 41.75, lng: -87.67}});

	
	
	
	
	
} 
  

/****************************************************************************************/