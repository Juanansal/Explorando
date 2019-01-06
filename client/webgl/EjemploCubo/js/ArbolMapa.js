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

function TEscena() //TEntidad
{
	this.beginDraw = function() { console.log("-- Escena empieza --"); }
	this.endDraw = function() { console.log("-- Escena Acaba --"); }
}

function TLuz(){
	this.intensidad; //Tcolor
	
	this.setIntensidad = function(Tcolor) { intensidad = Tcolor; }
	
	this.beginDraw = function(pasada) { 
	
		/*si (pasada == LUZ && luz activa) {
			obtener la posición de la luz de la matriz activa (MODELVIEW)
			activar la luz en la librería gráfica
			colocar la luz en la posición obtenida
			}
*/
	
		//glMatrixMode(GL_MODELVIEW);
		
		console.log("-- NLuz empieza --"); 
		
	}
	
	this.endDraw = function()  { console.log("-- NLuz acaba --"); }
}

TLuz.prototype = new TEscena();

function TTransform()
{
	//this.matriz;
	var mat4 = {};
	mat4.create
	console.log("matriz creada");
	
	mat4.identity;          //this.identidad = function() {}
	this.cargar = function() {}
	
	
	mat4.transpose;    //this.trasponer = function() {}
	
	mat4.rotate;   //this.rotar = function(float1, float2, float3, float4) {}
	
	this.beginDraw = function() {  }
	this.endDraw = function() {  }
	
}

TTransform.prototype = new TEscena();

function TTransfRotaLuz()
{
	//this.matriz;
	var mat4 = {};
	mat4.create
	console.log("matriz creada");
	
	mat4.identity;          //this.identidad = function() {}
	this.cargar = function() {}
	
	
	mat4.transpose;    //this.trasponer = function() {}
	
	mat4.rotate;   //this.rotar = function(float1, float2, float3, float4) {}
	
	this.beginDraw = function() { console.log("-- RotaLuz empieza --"); }
	this.endDraw = function() { console.log("-- RotaLuz acaba --"); }
	
}

TTransfRotaLuz.prototype = new TEscena();

function TTransfTraslaLuz()
{
	//this.matriz;
	var mat4 = {};
	mat4.create
	console.log("matriz creada");
	
	mat4.identity;          //this.identidad = function() {}
	this.cargar = function() {}
	
	
	mat4.transpose;    //this.trasponer = function() {}
	
	mat4.rotate;   //this.rotar = function(float1, float2, float3, float4) {}
	
	
	this.beginDraw = function() { console.log("-- TraslaLuz empieza --"); }
	this.endDraw = function() { console.log("-- TraslaLuz acaba --"); }
	
}

TTransfTraslaLuz.prototype = new TEscena();

function TTransfRotaCam()
{
	//this.matriz;
	var mat4 = {};
	mat4.create
	console.log("matriz creada");
	
	mat4.identity;          //this.identidad = function() {}
	this.cargar = function() {}
	
	
	mat4.transpose;    //this.trasponer = function() {}
	
	mat4.rotate;   //this.rotar = function(float1, float2, float3, float4) {}
	
	this.beginDraw = function() { console.log("-- RotaCam empieza --"); }
	this.endDraw = function() { console.log("-- RotaCam acaba --"); }
	
}

TTransfRotaCam.prototype = new TEscena();

function TTransfTraslaCam()
{
	//this.matriz;
	var mat4 = {};
	mat4.create
	console.log("matriz creada");
	
	mat4.identity;          //this.identidad = function() {}
	this.cargar = function() {}
	
	
	mat4.transpose;    //this.trasponer = function() {}
	
	mat4.rotate;   //this.rotar = function(float1, float2, float3, float4) {}
	
	
	this.beginDraw = function() { console.log("-- TraslaCam empieza --"); }
	this.endDraw = function() { console.log("-- TraslaCam acaba --"); }
	
}

TTransfTraslaCam.prototype = new TEscena();

function TTransfRotaMapa()
{
	//this.matriz;
	var mat4 = {};
	mat4.create
	console.log("matriz creada");
	
	mat4.identity;          //this.identidad = function() {}
	this.cargar = function() {}
	
	
	mat4.transpose;    //this.trasponer = function() {}
	
	mat4.rotate;   //this.rotar = function(float1, float2, float3, float4) {}
	
	this.beginDraw = function() { console.log("-- RotaMapa empieza --"); }
	this.endDraw = function() { console.log("-- RotaMapa acaba --"); }
	
}

TTransfRotaMapa.prototype = new TEscena();

function TTransfTraslaMapa()
{
	//this.matriz;
	var mat4 = {};
	mat4.create
	console.log("matriz creada");
	
	mat4.identity;          //this.identidad = function() {}
	this.cargar = function() {}
	
	
	mat4.transpose;    //this.trasponer = function() {}
	
	mat4.rotate;   //this.rotar = function(float1, float2, float3, float4) {}
	
	
	this.beginDraw = function() { console.log("-- TraslaMapa empieza --"); }
	this.endDraw = function() { console.log("-- TraslaMapa acaba --"); }
	
}

TTransfTraslaMapa.prototype = new TEscena();

function TCamara()
{
	this.esPerspectiva;
	this.cercano;
	this.lejano;
	
	this.setPerspectiva = function(float1, float2) {};
	this.setParalela = function(float1, float2) {};
	
	this.beginDraw = function(pasada)  { 
	
	/*si (pasada == CAMARA && camara activa) {
		obtener la matriz de posición de la cámara (MODELVIEW)
		invertir esa matriz y devolverla para utilizarla en el dibujado
		}
*/
	
	console.log("-- NCam empieza --"); 
	
	}
	this.endDraw = function() { console.log("-- NCam acaba --"); }
	
}

TCamara.prototype = new TEscena();

function TRecurso(){
	this.nombre;
	this.getNombre=function(){};
	this.setNombre=function(character){};
}

function TGestorRecursos(){
	this.rec = new Array(5);
	
	rec[0]= null;
	rec[1]="cone.json";
	rec[2]="cube2.json";
	rec[3]= null;
	rec[4]="ejemplo.json";
	
	TRecurso.getRecurso = function(nombre) 
	 { 
		for(var j=0; j<rec.length; j++){
			if(rec[j]==null){
				rec[j]= new TRecurso();
				rec[j]= TMalla.cargarMalla(nombre);
			}
		}
		
		return rec;
	 }
	
}


function TMalla()
{
	this.vertices;
	this.normales;
	this.texturas;
	this.verTriangulos;
	this.normTriangulos;
	this.textTriangulos;
	this.nTriangulos;
	

	this.malla; //RecursoMalla
	
	this.cargarMalla = function(TFichero) {
	//Esta llamada se ejecuta en modo asíncrono, por lo que los datos leídos no están disponibles para el script que realiza la llamada a getJSON 
	//inmediatamente después de realizarla, sino algo más tarde.
	
	
	
		TFichero = $.getJSON( "cone.json", function(TFichero) {
		  console.log( "Carga de archivo cone.json ejecutada correctamente de forma asíncrona" );
		})
		  .done(function(TFichero) {
			console.log( "Segunda Carga de archivo cone.json ejecutada correctamente de forma asíncrona" );
		  })
		  .fail(function(TFichero) {
			console.log( "error al Cargar el archivo cone.json de forma asíncrona" );
		  })
		  .always(function(TFichero) {
			console.log( "carga del archivo cone.json completa con éxito o fallo" );
		  });
		 
		
		TFichero.complete(function(TFichero) {
		  console.log( "segunda carga del archivo cone.json completa con éxito o fallo" );
		});
		
	
	
	};
	
		
	
	this.beginDraw = function()  { console.log("-- NMapa empieza --"); }
	this.endDraw = function() { console.log("-- NMapa acaba --"); }
}

TMalla.prototype = new TEscena();


function TMotorTAG(){

	this.escena = new Nodo();
	this.gestor = new TGestorRecursos();
	this.ent = new TEscena();
	this.padre = new Nodo();
	
	this.crearNodo = function(padre, ent){
	
		this.n=new Nodo("n", ent, padre);
		padre.addHijo(n);
		return n;
		
	};
	
	this.crearTransform = function(){
		this.t=new TTransform();
		return t;
	};
	
	this.crearCamara = function(){
		this.c=new TLuz();
		return c;
	};
	
	this.crearLuz = function(){
		this.l=new TLuz();
		return l;
	};
	
	this.crearMalla = function(fich){
		this.m=new TMalla();
		m.cargarMalla(fich);
		return m;
	};
	
	this.draw = function(){
		/*…
		para cada nodoLuz activo del registro de luces {
		recorrer el árbol a la inversa desde nodoLuz hasta la raiz
		guardar el recorrido en una lista auxiliar de nodos de transformación
		invertir la lista auxiliar
		recorrer la lista auxiliar multiplicando las matrices en una matriz auxiliar
		obtener la posición de la luz a partir de la matriz auxiliar
		posicionar y activar la luz en la librería gráfica
		} …
*/


		/*…
		nodoCamara = getCamaraActiva ();
		recorrer el árbol a la inversa desde nodoCamara hasta la raiz
		guardar el recorrido en una lista auxiliar de nodos de transformación
		invertir la lista auxiliar
		recorrer la lista auxiliar multiplicando las matrices en una matriz auxiliar
		invertir la matriz auxiliar
		cargar la matriz auxiliar en la matriz MODELVIEW de la librería gráfica
		…
*/
		
		
	}

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
