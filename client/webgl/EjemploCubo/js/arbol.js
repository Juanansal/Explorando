console.log("Carga arbol.js");

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
  
function TTransform()
{
	this.matriz;
	
	this.identidad = function() {}
	this.cargar = function() {}
	this.transponer = function() {}
	this.transladar = function(float1, float2, float3) {}
	this.rotar = function(float1, float2, float3, float4) {}
	
	this.beginDraw = function() { console.log("-- Transform empieza --"); }
	this.endDraw = function() { console.log("-- Transform acaba --"); }
	
}

function TLuz()
{
	this.intensidad; //Tcolor
	
	this.setIntensidad = function(Tcolor) { intensidad = Tcolor; }
	
	this.beginDraw = function() { console.log("-- Luz empieza --"); }
	this.endDraw = function()  { console.log("-- Luz acaba --"); }
}

function TCamara()
{
	this.esPerspectiva;
	this.cercano;
	this.lejano;
	
	this.setPerspectiva = function(float1, float2) {};
	this.setParalela = function(float1, float2) {};
	
	this.beginDraw = function()  { console.log("-- Camara empieza --"); }
	this.endDraw = function() { console.log("-- Camara acaba --"); }
	
}

function TMalla()
{
	this.malla; //RecursoMalla
	
	this.cargarMalla = function(TFichero) {};
	
	this.beginDraw = function() {};
	this.endDraw = function() {};	
}



var escena = new TEscena();
var transform = new TTransform();
var luz = new TLuz();
var camara = new TCamara();



var nodoPadre = new Nodo("escena", escena);


var nodoHijo1_1 = new Nodo("luz", luz, nodoPadre);
nodoPadre.addHijo(nodoHijo1_1);
var nodoHijo1_2 = new Nodo("transform", transform, nodoPadre);
nodoPadre.addHijo(nodoHijo1_2);

var nodoHijo2 = new Nodo("camara", camara, nodoHijo1_1);
nodoHijo1_1.addHijo(nodoHijo2);

nodoPadre.draw();