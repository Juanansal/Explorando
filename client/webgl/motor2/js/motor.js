"use strict";

var MOTOR= {};

var gl;   // The webgl context.

var a_coords_loc;          //   Localizacion variable del atributo a_coords en el shader program
var a_coords_buffer;       // Buffer to hold the values for a_coords.
var u_color;               // Location of the uniform specifying a color for the primitive.
var u_modelviewProjection; // Location of the uniform matrix representing the combined transformation.

var projection = mat4.create();  // projection matrix
var modelview = mat4.create();   // modelview matrix
var modelviewProjection = mat4.create();  // combined matrix

var rotateX = 0;   // rotation of cube about the x-axis; these three rotations are the modeling transformation
var rotateY = 0;   // rotation of cube about the y-axis
var rotateZ = 0;   // rotation of cube about the z-axis

var root = null;

// Inicializar Webcl, el canvas y los vinculos con el shader
function initGL() 
{
	var canvas = document.getElementById("webglcanvas");
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	
    var prog = createProgram(gl,"vshader-source","fshader-source");
    gl.useProgram(prog);
    a_coords_loc =  gl.getAttribLocation(prog, "a_coords");
    u_modelviewProjection = gl.getUniformLocation(prog, "modelviewProjection");
    u_color =  gl.getUniformLocation(prog, "color");
    a_coords_buffer = gl.createBuffer();
    gl.enable(gl.DEPTH_TEST);
}

MOTOR.draw = function()
{
	if(root!=null)
	{	

		
		gl.clearColor(0,0,0,1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		mat4.perspective(projection, Math.PI/2, 1, 4, 8);

		/* Set the value of modelview to represent the viewing transform. */
		mat4.lookAt(modelview, [2,2,6], [0,0,0], [0,0,1]);

	   root.draw();
	}
	else
	{
		console.log('Escena no creada!!');
	}
}

MOTOR.crearEscena = function()
{ //THIS FUNCTION CREATES (IF NULL) AND RETURN THE ROOT ELEMENT

	root = new MOTOR.Nodo();
	//var escena = new Escena();
	
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
	this.rotadox = null;
	this.rotadoY = null;
	this.rotadoZ = null;
	this.transladado = null;
	this.escalado = null;
	
	return this;
}

MOTOR.Transform.prototype = 
{
	constructor: MOTOR.Transform,
	trasladado : null,
	escalado : null,
	rotadoX: null,
	rotadoY: null,
	rotadoZ: null,

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
	setTranslacion : function(x,y,z) 
	{
		this.trasladado = [x,y,z];
	},
	traslate : function(mat) {
		mat4.translate(mat, mat, this.trasladado);
	},
	scale : function(mat) 
	{
	   mat4.scale(mat, mat,this.escalado);
	},
	setRotacion : function(x,y,z)
	{
		this.rotadoX = x;
		this.rotadoY = y;
		this.rotadoZ = z;
			
	},
	rotate : function(mat) 
	{
		if(this.rotadoX!=null && this.rotadoY!=null && this.rotadoZ!=null)
		  {		
			 mat4.rotateX(modelview, modelview, this.rotadoX);
			 mat4.rotateY(modelview, modelview, this.rotadoY);
			 mat4.rotateZ(modelview, modelview, this.rotadoZ);
		  }
		
	},
	setEscalado : function(x, y, z) 
	{
		this.escalado = [x,y,z];
	},

	beginDraw : function(hijos) {

		console.log('2');

		this.traslate(modelview);
		this.rotate(modelview);
		this.scale(modelview);

		//console.log(modelview+'   '+this.rotadoX+', '+this.rotadoY+', '+this.rotadoZ)
		
		for(var i=0;i<hijos.length;i++) 
		{
			hijos[i].draw();
		}
	},
	endDraw   : function() 
	{
		modelview = mat4.create();
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
    
	console.log(modelview);
	mat4.scale(modelview,modelview, [1,1,1]);
	console.log(modelview);
	

    /* Multiply the projection matrix times the modelview matrix to give the
       combined transformation matrix, and send that to the shader program. */

    mat4.multiply( modelviewProjection, projection, modelview );
    gl.uniformMatrix4fv(u_modelviewProjection, false, modelviewProjection );
    
    /* Draw the six faces of a cube, with different colors. */
    
    drawPrimitive( gl.TRIANGLE_FAN, [1,0,0,1], [ -1,-1,1, 1,-1,1, 1,1,1, -1,1,1 ]);
    drawPrimitive( gl.TRIANGLE_FAN, [0,1,0,1], [ -1,-1,-1, -1,1,-1, 1,1,-1, 1,-1,-1 ]);
    drawPrimitive( gl.TRIANGLE_FAN, [0,0,1,1], [ -1,1,-1, -1,1,1, 1,1,1, 1,1,-1 ]);
    drawPrimitive( gl.TRIANGLE_FAN, [1,1,0,1], [ -1,-1,-1, 1,-1,-1, 1,-1,1, -1,-1,1 ]);
    drawPrimitive( gl.TRIANGLE_FAN, [1,0,1,1], [ 1,-1,-1, 1,1,-1, 1,1,1, 1,-1,1 ]);
    drawPrimitive( gl.TRIANGLE_FAN, [0,1,1,1], [ -1,-1,-1, -1,-1,1, -1,1,1, -1,1,-1 ]);
    
    /* Draw coordinate axes as thick colored lines that extend through the cube. */
    
    gl.lineWidth(4);
    drawPrimitive( gl.LINES, [1,0,0,1], [ -2,0,0, 2,0,0] );
    drawPrimitive( gl.LINES, [0,1,0,1], [ 0,-2,0, 0,2,0] );
    drawPrimitive( gl.LINES, [0,0,1,1], [ 0,0,-2, 0,0,2] );
    gl.lineWidth(1);
		
		
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




/*******************************************************************/
/*******************************************************************/
/******************* DE AQUI A ABAJO NO SIRVE BORRAR *****************/


/* Draws a WebGL primitive.  The first parameter must be one of the constants
 * that specifiy primitives:  gl.POINTS, gl.LINES, gl.LINE_LOOP, gl.LINE_STRIP,
 * gl.TRIANGLES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN.  The second parameter must
 * be an array of 4 numbers in the range 0.0 to 1.0, giving the RGBA color of
 * the color of the primitive.  The third parameter must be an array of numbers.
 * The length of the array must be amultiple of 3.  Each triple of numbers provides
 * xyz-coords for one vertex for the primitive.  This assumes that u_color is the
 * location of a color uniform in the shader program, a_coords_loc is the location of
 * the coords attribute, and a_coords_buffer is a VBO for the coords attribute.
 */
function drawPrimitive( primitiveType, color, vertices ) {
     gl.enableVertexAttribArray(a_coords_loc);
     gl.bindBuffer(gl.ARRAY_BUFFER,a_coords_buffer);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);
     gl.uniform4fv(u_color, color);
     gl.vertexAttribPointer(a_coords_loc, 3, gl.FLOAT, false, 0, 0);
     gl.drawArrays(primitiveType, 0, vertices.length/3);
}


/* Draws a colored cube, along with a set of coordinate axes.
 * (Note that the use of the above drawPrimitive function is not an efficient
 * way to draw with WebGL.  Here, the geometry is so simple that it doesn't matter.)
 */
function draw() { 
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    /* Set the value of projection to represent the projection transformation */
    
    mat4.perspective(projection, Math.PI/4, 1, 4, 8);
	

    
    /* Set the value of modelview to represent the viewing transform. */
    mat4.lookAt(modelview, [2,2,6], [0,0,0], [0,0,1]);
    
    /* Apply the modeling tranformation to modelview. */
    
	
	console.log(modelview+'   '+rotateX+', '+rotateY+', '+rotateZ);
    mat4.rotateX(modelview, modelview, rotateX);
    mat4.rotateY(modelview, modelview, rotateY);
    mat4.rotateZ(modelview, modelview, rotateZ);
	
	
	
	console.log(modelview+'   '+rotateX+', '+rotateY+', '+rotateZ);
    
    /* Multiply the projection matrix times the modelview matrix to give the
       combined transformation matrix, and send that to the shader program. */
       
    mat4.multiply( modelviewProjection, projection, modelview );
    gl.uniformMatrix4fv(u_modelviewProjection, false, modelviewProjection );
    
    /* Draw the six faces of a cube, with different colors. */
    
    drawPrimitive( gl.TRIANGLE_FAN, [1,0,0,1], [ -1,-1,1, 1,-1,1, 1,1,1, -1,1,1 ]);
    drawPrimitive( gl.TRIANGLE_FAN, [0,1,0,1], [ -1,-1,-1, -1,1,-1, 1,1,-1, 1,-1,-1 ]);
    drawPrimitive( gl.TRIANGLE_FAN, [0,0,1,1], [ -1,1,-1, -1,1,1, 1,1,1, 1,1,-1 ]);
    drawPrimitive( gl.TRIANGLE_FAN, [1,1,0,1], [ -1,-1,-1, 1,-1,-1, 1,-1,1, -1,-1,1 ]);
    drawPrimitive( gl.TRIANGLE_FAN, [1,0,1,1], [ 1,-1,-1, 1,1,-1, 1,1,1, 1,-1,1 ]);
    drawPrimitive( gl.TRIANGLE_FAN, [0,1,1,1], [ -1,-1,-1, -1,-1,1, -1,1,1, -1,1,-1 ]);
    
    /* Draw coordinate axes as thick colored lines that extend through the cube. */
    
    gl.lineWidth(4);
    drawPrimitive( gl.LINES, [1,0,0,1], [ -2,0,0, 2,0,0] );
    drawPrimitive( gl.LINES, [0,1,0,1], [ 0,-2,0, 0,2,0] );
    drawPrimitive( gl.LINES, [0,0,1,1], [ 0,0,-2, 0,0,2] );
    gl.lineWidth(1);
}

/* Creates a program for use in the WebGL context gl, and returns the
 * identifier for that program.  If an error occurs while compiling or
 * linking the program, an exception of type String is thrown.  The error
 * string contains the compilation or linking error.  If no error occurs,
 * the program identifier is the return value of the function.
 *    The second and third parameters are the id attributes for <script>
 * elementst that contain the source code for the vertex and fragment
 * shaders.
 */
function createProgram(gl, vertexShaderID, fragmentShaderID) {
    function getTextContent( elementID ) {
            // This nested function retrieves the text content of an
            // element on the web page.  It is used here to get the shader
            // source code from the script elements that contain it.
        var element = document.getElementById(elementID);
        var node = element.firstChild;
        var str = "";
        while (node) {
            if (node.nodeType == 3) // this is a text node
                str += node.textContent;
            node = node.nextSibling;
        }
        return str;
    }
    try {
        var vertexShaderSource = getTextContent( vertexShaderID );
        var fragmentShaderSource = getTextContent( fragmentShaderID );
    }
    catch (e) {
        throw "Error: Could not get shader source code from script elements.";
    }
    var vsh = gl.createShader( gl.VERTEX_SHADER );
    gl.shaderSource(vsh,vertexShaderSource);
    gl.compileShader(vsh);
    if ( ! gl.getShaderParameter(vsh, gl.COMPILE_STATUS) ) {
        throw "Error in vertex shader:  " + gl.getShaderInfoLog(vsh);
     }
    var fsh = gl.createShader( gl.FRAGMENT_SHADER );
    gl.shaderSource(fsh, fragmentShaderSource);
    gl.compileShader(fsh);
    if ( ! gl.getShaderParameter(fsh, gl.COMPILE_STATUS) ) {
       throw "Error in fragment shader:  " + gl.getShaderInfoLog(fsh);
    }
    var prog = gl.createProgram();
    gl.attachShader(prog,vsh);
    gl.attachShader(prog, fsh);
    gl.linkProgram(prog);
    if ( ! gl.getProgramParameter( prog, gl.LINK_STATUS) ) {
       throw "Link error in program:  " + gl.getProgramInfoLog(prog);
    }
    return prog;
}


/**
 *  An event listener for the keydown event.  It is installed by the init() function.
 *  The arrow keys, PageUp, and PageDown will rotate the cube by modifying the
 *  modeling transformation.  Home and Return key resets the modeling transform
 *  to the identity.
 */
function doKey(evt) {
    var rotationChanged = true; 
    switch (evt.keyCode) {
        case 37: rotateY -= 0.5; break;        // left arrow
        case 39: rotateY +=  0.5; break;       // right arrow
        case 38: rotateX -= 0.5; break;        // up arrow
        case 40: rotateX += 0.5; break;        // down arrow
        case 33: rotateZ += 0.5; break;        // PageUp
        case 34: rotateZ -= 0.5; break;        // PageDown
        case 13:                                // return key
        case 36: rotateX = rotateY = rotateZ = 0; break;  // home key
        default: rotationChanged = false;
    }
    if (rotationChanged) {
             evt.preventDefault();
             MOTOR.draw();
    }
}


