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

MOTOR.init = function()
{
	MOTOR.inicializarWebGL();
	
	//MOTOR.inicializarVariables();
	
	document.addEventListener("keydown", doKey, false);
	draw();
	
	//MOTOR.dibujar();

    //initProgram();
    //loadModel('modelos/cone.json');
    //renderLoop();
	
	//MOTOR.draw();
}


MOTOR.inicializarWebGL = function()
{
	// Se coje el id del canvas donde pintamos los graficos
	
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

function renderLoop() {
    requestAnimFrame(renderLoop);
	console.log('FRAME');
    MOTOR.dibujar();
}

/****************************************************************/
/************ FUNCIONES DE AYUDA FUERA DEL ARBOL ****************/

function drawPrimitive( primitiveType, color, vertices ) {
     gl.enableVertexAttribArray(a_coords_loc);
     gl.bindBuffer(gl.ARRAY_BUFFER,a_coords_buffer);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);
     gl.uniform4fv(u_color, color);
     gl.vertexAttribPointer(a_coords_loc, 3, gl.FLOAT, false, 0, 0);
     gl.drawArrays(primitiveType, 0, vertices.length/3);
}

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

function draw() 
{ 
	console.log('PASA POR AQUI');

    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    /* Set the value of projection to represent the projection transformation */
    
    mat4.perspective(projection, Math.PI/5, 1, 4, 8);
    
    /* Set the value of modelview to represent the viewing transform. */

    mat4.lookAt(modelview, [2,2,6], [0,0,0], [0,1,0]);
    
    /* Apply the modeling tranformation to modelview. */
    
    mat4.rotateX(modelview, modelview, rotateX);
    mat4.rotateY(modelview, modelview, rotateY);
    mat4.rotateZ(modelview, modelview, rotateZ);
    
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

function doKey(evt) {
    var rotationChanged = true; 
    switch (evt.keyCode) {
        case 37: rotateY -= 0.05; break;        // left arrow
        case 39: rotateY +=  0.05; break;       // right arrow
        case 38: rotateX -= 0.05; break;        // up arrow
        case 40: rotateX += 0.05; break;        // down arrow
        case 33: rotateZ += 0.05; break;        // PageUp
        case 34: rotateZ -= 0.05; break;        // PageDown
        case 13:                                // return key
        case 36: rotateX = rotateY = rotateZ = 0; break;  // home key
        default: rotationChanged = false;
    }
    if (rotationChanged) {
              evt.preventDefault();
             draw();
    }
}