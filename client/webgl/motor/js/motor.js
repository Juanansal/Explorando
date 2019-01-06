console.log("Carga arbol.js");

var MOTOR= {};
root = null;
//var mvMatrix = mat4.create(); // La matriz Model-View
//var pMatrix = mat4.create(); // La matriz proyeccion 
//var modelVertexBuffer = null; //El vertex buffer para el modelo
//var modelIndexBuffer = null;

MOTOR.ancho = 800;
MOTOR.alto = 600;

MOTOR.modelView = null;

MOTOR.modelos = new Array();  //ARRAY FOR MODELS URLs
MOTOR.modelosUrl = new Array();  //ARRAY FOR MODELS FILES
MOTOR.programa = null;

MOTOR.getEscena = function() 
{
	return MOTOR.escena
}
	
	
MOTOR.crearShader = function(gl, id)
{
  var shaderScript = document.getElementById(id);

  // Didn't find an element with the specified ID; abort.

  if (!shaderScript) {
    return null;
  }

  // Walk through the source element's children, building the
  // shader source string.

  var theSource = "";
  var currentChild = shaderScript.firstChild;

  while(currentChild) {
    if (currentChild.nodeType == 3) {
      theSource += currentChild.textContent;
    }

    currentChild = currentChild.nextSibling;
  }

  // Now figure out what type of shader script we have,
  // based on its MIME type.

  var shader;

  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;  // Unknown shader type
  }

  // Send the source to the shader object

  gl.shaderSource(shader, theSource);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}	
	


MOTOR.crearEscena = function()
{ //THIS FUNCTION CREATES (IF NULL) AND RETURN THE ROOT ELEMENT

	var root = new MOTOR.Nodo();
	//var escena = new Escena();

	console.log("HOLA "+root.entidad);
	
    root.entidad = new MOTOR.Escena();
	MOTOR.escena = root;
	
	return root;
}

MOTOR.crearTransform = function()
{

	var trans = new MOTOR.Transform();
	return trans;

};

MOTOR.crearMesh = function()
{

	var mesh = new MOTOR.Mesh();
	return mesh;
};


MOTOR.Nodo = function () 
{ 	//NODE CLASS FOR EVERY NODE IN TREE

	this.hijo = new Array();
	return this;
};


MOTOR.Nodo.prototype = 
{

	constructor: MOTOR.Nodo,

	entidad: null, 
	padre: null,
	hijo: new Array(), 

	setEntidad: function(ent) 
	{  
		this.entidad = ent;
	},
	
	setPadre: function (pad) 
	{
		this.padre = pad;
	},
	
	addHijo: function (nodo) 
	{
		return this.hijo.push(nodo);
	},
	
	draw: function()
	{ 
		this.entidad.beginDraw(this.hijo);
		this.entidad.endDraw();
	}
	
}


MOTOR.Escena = function()
{  //ENTITY OF ROOT NODE
	return this;
}

MOTOR.Escena.prototype =  
{
	constructor: MOTOR.Escena,

	beginDraw : function(hijos)
	{
		console.log('1');
		for(var i=0; i<hijos.length; i++) {
			
			hijos[i].draw();
		}
		
	},
	endDraw : function(){

	}

}

MOTOR.Transform =function()
{ //TRANSFORMATION ENTITY CLASS
	this.rotado = new Array();
	this.transladado = null;
	this.escalado = null;
	return this;
}

MOTOR.Transform.prototype = 
{
	constructor: MOTOR.Transform,
	trasladado : null,
	escalado : null,
	rotado: null,

	identity : function(mat) 
	{
		mat4.identity(mat);
	},
	load : function(origin,target) 
	{
		mat4.set(origin,target);
	},
	transpose : function(mat) 
	{
		mat4.transpose(mat);
	},
	setTraslation : function(x,y,z) 
	{
		this.trasladado = [x,y,z];
	},
	traslate : function(mat) {
		if(this.trasladado!=null)
			mat4.translate(mat,this.trasladado);
	},
	scale : function(mat) 
	{
		if(this.escalado!=null)
			mat4.scale(mat,this.escalado);
	},
	addRotation : function(ang,axis)
	{
		if(this.rotado == null)
		{
			this.rotado =  new Array(2);
			this.rotado.push([ang,axis]);
		}
		else this.rotado.push([ang,axis]);
	},
	rotate : function(mat) {
		var matrix = mat4.create();
		for(var i=0;i<this.rotado.length;i++)
		{
			var ang = this.rotado[i][0];
			var axis = this.rotado[i][1];
			matrix = mat;
			mat4.rotate(matrix,(ang*Math.PI/180),axis);
		}
		matrix = mat;
		return matrix;
		
	},
	setScale : function(x, y, z) 
	{
		if(typeof y !== 'undefined')
		{
		  this.escalado = [x,y,z];
	    }
	    else 
		{ 
	      this.escalado = [x,x,x]; 
		}
	},

	beginDraw : function(hijos) {

		console.log('2');
		mv = new Float32Array(MOTOR.getMVMatrix());

		this.traslate(mv);
		mv=this.rotate(mv);
		this.scale(mv);
		MOTOR.pushMatrix(mv);
		

		for(var i=0;i<hijos.length;i++) {
			hijos[i].draw();
		}
	},
	endDraw   : function() {
		MOTOR.popMatrix();
	}
}

MOTOR.addTransform = function(transf, padre)
{


	var nodo = new MOTOR.Nodo();
	nodo.entidad = transf;
	padre.addHijo(nodo);

	return nodo;
}



MOTOR.Mesh = function() 
{ 	//MESH ENTITY CLASS
	this.urlFichero = null;
	this.vertices = new Float32Array();
	this.normales =new Float32Array();
	this.texturas =new Float32Array();
	this.indices = new Array();
	this.malla = new Array();
	this.listo = false;
	
	return this;
}

MOTOR.Mesh.prototype = 
{
	constructor: MOTOR.Escena,
	urlFichero: null,
	vertices : null,
	normales : null,
	texturas : null,
	malla: null,
	indices : null,
	listo: false,

	beginDraw : function(hijos)
	{
		console.log('3');	
		
		console.log(this.malla);
		console.log(this.urlFichero);
		
		// Si la carga del fichero se ha realizado, empieza
		if(this.listo == true)
		  {
			  OBJ.initMeshBuffers(gl, this.malla);
			  
			  // Carga del programa y los shaders
			  if(MOTOR.programa == null)
			  {
				 var fragmentShader = MOTOR.crearShader(gl, "shader-fs");
				 var vertexShader = MOTOR.crearShader(gl, "shader-vs");
				 
				  
		         programa = gl.createProgram();
				 gl.attachShader(programa, vertexShader);
				 gl.attachShader(programa, fragmentShader);
				 gl.linkProgram(programa);
				 gl.useProgram(programa);
				  console.log(programa);
				 
				 MOTOR.programa = programa;
			   }
			  else
			   {
			      programa = MOTOR.programa;
			   }
			   
			  // AQUI EMPIEZA LO QUE HAY QUE TOCAR
			  
			  // Inicializar Matrices (esto esta bien)
			  
			    // Matriz ModelView
				var mv = MOTOR.getMVMatrix(); // Se coje la matriz con la transformacion hecha		

				// Matriz Perspectiva
				var persp = mat4.create();
				mat4.perspective(persp, 45, 800 / 600, 1, 10000);	

				// Matriz normal
				var normalMatrix = mat4.create();
				mat4.set(mv, normalMatrix);
				mat4.inverse(normalMatrix);
				mat4.transpose(normalMatrix);	 

				
			  
			  // Punteros a los shaders
			  
			     programa.shaderProjectionMatrixUniform = gl.getUniformLocation(programa, "uPMatrix");
				 programa.shaderModelViewMatrixUniform = gl.getUniformLocation(programa, "uMVMatrix");
				 programa.shaderNormalMatrixUniform = gl.getUniformLocation(programa, "uNormalMatrix");
				 
				 gl.uniformMatrix4fv(programa.shaderProjectionMatrixUniform, false, persp);	 			 
				 gl.uniformMatrix4fv(programa.shaderModelViewMatrixUniform, false, mv);
				 gl.uniformMatrix4fv(programa.shaderNormalMatrixUniform, false, normalMatrix);
				 

			     programa.vertexPositionAttribute = gl.getAttribLocation(programa, "aVertexPosition");
				 programa.textureCoordAttribute = gl.getAttribLocation(programa, "aTextureCoord");
				 programa.vertexNormalAttribute = gl.getAttribLocation(programa, "aVertexNormal");
				 
				 gl.enableVertexAttribArray(programa.vertexPositionAttribute);
				 gl.enableVertexAttribArray(programa.textureCoordAttribute);				
				 gl.enableVertexAttribArray(programa.vertexNormalAttribute);
	
				// Meter datos en gl
				
				console.log(this.vertices.length);
				console.log(this.normales.length);
				console.log(this.indices.length);
				
				var bufferVertex = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertex);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices) ,gl.STATIC_DRAW);
				gl.vertexAttribPointer(programa.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
/*
				var bufferNormal = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, bufferNormal);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normales) ,gl.STATIC_DRAW);
				gl.vertexAttribPointer(programa.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
				
				var bufferIndices = gl.createBuffer();
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferIndices);
				gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(this.indices) ,gl.STATIC_DRAW);
			*/	
				
				gl.drawElements(gl.TRIANGLES, 0, gl.UNSIGNED_SHORT, 0);

				
				// Pintado
				//gl.drawElements(gl.TRIANGLES, this.malla.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
				//gl.drawElements(gl.TRIANGLES, obj.nIndices, gl.UNSIGNED_SHORT, 0);
				//gl.drawElements(gl.TRIANGLES, this.ind.length, gl.UNSIGNED_SHORT,0);
				//gl.deleteBuffer(bVertex);
				//gl.deleteBuffer(bIndexes);
			  
			  /***************** HASTA AQUI *********************************/
			  /**************************************************************/
			  /***************************************************************/
			 /************************************************************************/
 	  }
	
		
		
		// Inicializar valores, para ponerlos en un formato que los lea gl
		//OBJ.initMeshBuffers(gl, this.malla);
	},
	endDraw : function()
	{

	},
	
	inicializarMalla: function(data, x)
	{
		// https://github.com/frenchtoast747/webgl-obj-loader
		
		data.datos.vertices = data.malla.vertices;
		data.datos.normales = data.malla.vertexNormals;
		data.datos.texturas = data.malla.textures;
		data.datos.indices = data.malla.indices;
		data.datos.malla = data.malla;
		
		data.datos.listo = true;
		console.log(data.malla);
		console.log(data.malla.vertices);
		console.log(data.malla.vertexNormals);
		console.log(data.malla.textures);
		console.log(data.malla.indices);
		
		
		console.log(data.malla);
		console.log(data.datos);
		
	},
	
	cargarFichero: function(url)
	{
		this.urlFichero = url;
		console.log(this);
		OBJ.downloadMeshes(
		  {
           'malla': this.urlFichero
          }, this.inicializarMalla,{ 'datos': this });
	}
	
	

}

MOTOR.addMesh = function(mesh,padre)
{

	var nodo = new MOTOR.Nodo();
	nodo.entidad = mesh;
	padre.addHijo(nodo);

	return nodo;

}





/************* FUNCIONES PARA OPERAR MATRICES ***************/

MOTOR.pushMatrix = function(mv){ //ADD MATRIX TO ModelView ARRAY

	MOTOR.modelView.push(mv);

}

MOTOR.popMatrix = function(){  //DELETE LAST MATRIX ADDED TO ModelView ARRAY

	if(MOTOR.modelView.length>0)
		MOTOR.modelView.splice(MOTOR.modelView.length-1,1);

}



MOTOR.getMVMatrix = function(){ //RETURN LAST ModelView MATRIX
	
	if(MOTOR.modelView.length>0)
		return MOTOR.modelView[MOTOR.modelView.length-1];
	else
		console.log("modelView stack is empty"); 
	return null;

}



/**************** INICIALIZACIONES DE WEB GL  ****************/

MOTOR.init = function(canvasid)
{
	MOTOR.inicializarWebGL();
	
	MOTOR.inicializarVariables();
	
	MOTOR.dibujar();

    //initProgram();
    //loadModel('modelos/cone.json');
    renderLoop();
	
	//MOTOR.draw();
}


MOTOR.inicializarWebGL = function()
{
	// Se coje el id del canvas donde pintamos los graficos
	gl = utils.getGLContext('webGL');
	
}

MOTOR.inicializarVariables = function()
{
	if (gl) 
	{
		gl.clearColor(0, 0, 0, 1.0);                      // Set clear color to black, fully opaque
		gl.enable(gl.DEPTH_TEST); 
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);                              // Enable depth testing
		gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT); // Clear the color as well as the depth buffer.

		// Ancho + Alto
		gl.viewport(0, 0, 800, 600);
    }
}

MOTOR.dibujar = function()
{
	gl.clearColor(0,0,0.5, 1.0); // Set clear color to black, fully opaque
    gl.enable(gl.DEPTH_TEST); 
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);     // Enable depth testing
    gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	
	var mv = mat4.create();
	mat4.identity(mv);
	MOTOR.modelView = new Array();
	MOTOR.modelView.push(mv);
	
	escena.draw();
	
}






function initProgram() {
    var fgShader = utils.getShader(gl, 'shader-fs');
    var vxShader = utils.getShader(gl, 'shader-vs');

    prg = gl.createProgram();
    gl.attachShader(prg, vxShader);
    gl.attachShader(prg, fgShader);
    gl.linkProgram(prg);

    if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
        alert('Could not initialise shaders');
    }

    gl.useProgram(prg);

    prg.vertexPositionAttribute = gl.getAttribLocation(prg, 'aVertexPosition');
    prg.pMatrixUniform = gl.getUniformLocation(prg, 'uPMatrix');
    prg.mvMatrixUniform = gl.getUniformLocation(prg, 'uMVMatrix');
    prg.modelColor = gl.getUniformLocation(prg, 'modelColor');
}	



function loadModel(filename){
    var request = new XMLHttpRequest();
    var resource = "http://"+document.domain+ filename
    request.open("GET",filename);
    request.onreadystatechange = function() {
        console.info(request.readyState +' - '+request.status); 
      if (request.readyState == 4) {
	    if(request.status == 200) { //si carga el .json en el servidor
			handleLoadedModel(filename,JSON.parse(request.responseText));
		 }
		else if (document.domain.length == 0 && request.status == 0){ //si carga el .json en local
            handleLoadedModel(filename,JSON.parse(request.responseText));
        }
        else{
            alert ('Ha habido un problema cargando el fichero :' + filename);
            alert ('HTML codigo de error: ' + request.status);
		}
	  }
    }
    request.send();
}

/**Creamos los buffers que contiene la geometria del modelo
* 
*/
function handleLoadedModel(filename,payload) {
    
    model = payload; //    guarda nuestro modelo en una variable global que la devuelve en drawScene

   // alert(filename + ' ha sido cargado del servidor');

    modelVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
    
    
    modelIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);
    
    gl.uniform3f(prg.modelColor,model.color[0], model.color[1],model.color[2]);
    
    modelLoaded = true;
}

function renderLoop() {
    requestAnimFrame(renderLoop);
	console.log('FRAME');
    MOTOR.dibujar();
}

function drawScene(){

    gl.clearColor(0.5, 0.5, 0.5, 0.5);                      // Set clear color to black, fully opaque
    gl.enable(gl.DEPTH_TEST); 
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);                              // Enable depth testing
    gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT); // Clear the color as well as the depth buffer.

    mat4.perspective(45, c_width / c_height, 0.1, 10000.0, pMatrix);
    mat4.identity(mvMatrix);	
    mat4.translate(mvMatrix, [0.0, 0.0, -5.0]);

    gl.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);
    
    gl.enableVertexAttribArray(prg.vertexPositionAttribute);

   // if (!modelLoaded) return;
    //console.log('k');
    gl.bindBuffer(gl.ARRAY_BUFFER, modelVertexBuffer);
    gl.vertexAttribPointer(prg.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, modelIndexBuffer);
	//console.log(model);
    gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT,0);
	
}	



