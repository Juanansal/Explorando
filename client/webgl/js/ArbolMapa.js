console.log("Carga ArbolMapa.js");

function Nodo(nom, entidad, padre)
  { 
    this.nombre = nom;
    this.entidad = entidad;
	this.hijos = new Array();
	this.padre;
	
	
	this.getEntidad = function() { return entidad; }
	this.removeEntidad = function() { entidad=null; }
	this.getPadre = function() { return padre; }
	this.addHijo = function(hijo) { this.hijos.push(hijo); }
	
	
    this.draw = function() 
	 {  
	   
		entidad.beginDraw();
		//console.log("COMIENZA "+ this.nombre);
		
		for(var i=0; i<this.hijos.length; i++)
		  {
			  this.hijos[i].draw();
		  }
		
		//console.log("ACABA "+ this.nombre);
		entidad.endDraw();		
		
	 }
	 
	 
  } 

function TEscena()
{
	this.beginDraw = function() { console.log("-- Escena empieza --"); }
	this.endDraw = function() { console.log("-- Escena Acaba --"); }
}

function TLuz(){
	this.intensidad; //Tcolor
	
	this.setIntensidad = function(Tcolor) { intensidad = Tcolor; }
	
	this.beginDraw = function() { console.log("-- NLuz empieza --"); }
	this.endDraw = function()  { console.log("-- NLuz acaba --"); }
}

function TTransfRotaLuz()
{
	this.matriz;
	
	this.identidad = function() {}
	this.cargar = function() {}
	this.trasponer = function() {}
	
	this.rotar = function(float1, float2, float3, float4) {}
	
	this.beginDraw = function() { console.log("-- RotaLuz empieza --"); }
	this.endDraw = function() { console.log("-- RotaLuz acaba --"); }
	
}

function TTransfTraslaLuz()
{
	this.matriz;
	
	this.identidad = function() {}
	this.cargar = function() {}
	this.trasponer = function() {}
	this.trasladar = function(float1, float2, float3) {}
	
	
	this.beginDraw = function() { console.log("-- TraslaLuz empieza --"); }
	this.endDraw = function() { console.log("-- TraslaLuz acaba --"); }
	
}

function TTransfRotaCam()
{
	this.matriz;
	
	this.identidad = function() {}
	this.cargar = function() {}
	this.trasponer = function() {}
	
	this.rotar = function(float1, float2, float3, float4) {}
	
	this.beginDraw = function() { console.log("-- RotaCam empieza --"); }
	this.endDraw = function() { console.log("-- RotaCam acaba --"); }
	
}

function TTransfTraslaCam()
{
	this.matriz;
	
	this.identidad = function() {}
	this.cargar = function() {}
	this.trasponer = function() {}
	this.trasladar = function(float1, float2, float3) {}
	
	
	this.beginDraw = function() { console.log("-- TraslaCam empieza --"); }
	this.endDraw = function() { console.log("-- TraslaCam acaba --"); }
	
}

function TTransfRotaMapa()
{
	this.matriz;
	
	this.identidad = function() {}
	this.cargar = function() {}
	this.trasponer = function() {}
	
	this.rotar = function(float1, float2, float3, float4) {}
	
	this.beginDraw = function() { console.log("-- RotaMapa empieza --"); }
	this.endDraw = function() { console.log("-- RotaMapa acaba --"); }
	
}

function TTransfTraslaMapa()
{
	this.matriz;
	
	this.identidad = function() {}
	this.cargar = function() {}
	this.trasponer = function() {}
	this.trasladar = function(float1, float2, float3) {}
	
	
	this.beginDraw = function() { console.log("-- TraslaMapa empieza --"); }
	this.endDraw = function() { console.log("-- TraslaMapa acaba --"); }
	
}

function TCamara()
{
	this.esPerspectiva;
	this.cercano;
	this.lejano;
	
	this.setPerspectiva = function(float1, float2) {};
	this.setParalela = function(float1, float2) {};
	
	this.beginDraw = function()  { console.log("-- NCam empieza --"); }
	this.endDraw = function() { console.log("-- NCam acaba --"); }
	
}


function TMalla()
{
	this.malla; //RecursoMalla
	
	this.cargarMalla = function(TFichero) {
	//Esta llamada se ejecuta en modo asíncrono, por lo que los datos leídos no están disponibles para el script que realiza la llamada a getJSON 
	//inmediatamente después de realizarla, sino algo más tarde.
	
		TFichero = $.getJSON( "cone.json", function() {
		  console.log( "Carga de archivo cone.json ejecutada correctamente de forma asíncrona" );
		})
		  .done(function() {
			console.log( "Segunda Carga de archivo cone.json ejecutada correctamente de forma asíncrona" );
		  })
		  .fail(function() {
			console.log( "error al Cargar el archivo cone.json de forma asíncrona" );
		  })
		  .always(function() {
			console.log( "carga del archivo cone.json completa con éxito o fallo" );
		  });
		 
		
		TFichero.complete(function() {
		  console.log( "segunda carga del archivo cone.json completa con éxito o fallo" );
		});
	
	};
	
	this.beginDraw = function() {};
	this.endDraw = function() {};	
	
	this.beginDraw = function()  { console.log("-- NMapa empieza --"); }
	this.endDraw = function() { console.log("-- NMapa acaba --"); }
}



var escena = new TEscena();
var TransfRotaLuz = new TTransfRotaLuz();
var TransfTraslaLuz = new TTransfTraslaLuz();
var EntLuz = new TLuz();

var TransfRotaCam = new TTransfRotaCam();
var TransfTraslaCam = new TTransfTraslaCam();
var EntCam = new TCamara();

var TransfRotaMapa = new TTransfRotaMapa();
var TransfTraslaMapa = new TTransfTraslaMapa();
var malla = new TMalla();


var nodoPadre = new Nodo("escena", escena);


var nodoHijo1_1 = new Nodo("RotaLuz", TransfRotaLuz, nodoPadre);
nodoPadre.addHijo(nodoHijo1_1);
var nodoHijo1_2 = new Nodo("TraslaLuz", TransfTraslaLuz, nodoPadre);
nodoHijo1_1.addHijo(nodoHijo1_2);
var nodoHijo1_3 = new Nodo("NLuz", EntLuz, nodoPadre);
nodoHijo1_2.addHijo(nodoHijo1_3);


var nodoHijo2_1 = new Nodo("RotaCam", TransfRotaCam, nodoPadre);
nodoPadre.addHijo(nodoHijo2_1);
var nodoHijo2_2 = new Nodo("TraslaCam", TransfTraslaCam, nodoPadre);
nodoHijo2_1.addHijo(nodoHijo2_2);
var nodoHijo2_3 = new Nodo("NCam", EntCam, nodoPadre);
nodoHijo2_2.addHijo(nodoHijo2_3);


var nodoHijo3_1 = new Nodo("RotaMapa", TransfRotaMapa, nodoPadre);
nodoPadre.addHijo(nodoHijo3_1);
var nodoHijo3_2 = new Nodo("TraslaMapa", TransfTraslaMapa, nodoPadre);
nodoHijo3_1.addHijo(nodoHijo3_2);
var nodoHijo3_3 = new Nodo("NMapa", malla, nodoPadre);
nodoHijo3_2.addHijo(nodoHijo3_3);

malla.cargarMalla();

nodoPadre.draw();
