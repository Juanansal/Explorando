/**
 * QuartzJS light and basic WebGL 3D Motor 
 * @author Javier Sánchez Riquelme - http://javiersr.com 

 */

 //GLOBAL VARIABLES 

var QUARTZ = { REVISION: '1' };
var gl = null;

QUARTZ.textures = new Array(); //ARRAY FOR TEXTURES URLs
QUARTZ.textureFiles = new Array(); //ARRAY FOR TEXTURE FILES

QUARTZ.models = new Array();  //ARRAY FOR MODELS URLs
QUARTZ.modelFiles = new Array();  //ARRAY FOR MODELS FILES

QUARTZ.lightsArray = new Array(); //ARRAY OF LIGHTS

QUARTZ.modelView = null; //ModelView MATRIX

QUARTZ.root = null; //FIRST ELEMENT OF THE ELEMENTS TREE

QUARTZ.program = null; //THE GL_PROGRAM (ONLY ONE FOR NOW)

QUARTZ.getRoot = function(){ //THIS FUNCTION CREATES (IF NULL) AND RETURN THE ROOT ELEMENT

	if(QUARTZ.root == null){
		QUARTZ.root = new QUARTZ.Node();
		QUARTZ.root.entity = new QUARTZ.Scene();
	}

	return QUARTZ.root;

}

QUARTZ.pushMatrix = function(mv){ //ADD MATRIX TO ModelView ARRAY

	QUARTZ.modelView.push(mv);

}

QUARTZ.popMatrix = function(){  //DELETE LAST MATRIX ADDED TO ModelView ARRAY

	if(QUARTZ.modelView.length>0)
		QUARTZ.modelView.splice(QUARTZ.modelView.length-1,1);

}



QUARTZ.getMVMatrix = function(){ //RETURN LAST ModelView MATRIX
	
	if(QUARTZ.modelView.length>0)
		return QUARTZ.modelView[QUARTZ.modelView.length-1];
	else
		console.log("modelView stack is empty"); 
	return null;

}

QUARTZ.Node = function () { 	//NODE CLASS FOR EVERY NODE IN TREE

	this.children = new Array();
	return this;

};


QUARTZ.Node.prototype = {

	constructor: QUARTZ.Node,

	entity: null, 
	dad: null,
	children: new Array(), 

	setEntity: function ( value ) {   //SET ENTITY OF NODE (MESH, LIGHT, TRANSFORMATION...)
		if ( value instanceof QUARTZ.Entity ) {
			this.entity = value;
		}
		return true;
	},
	
	setDad: function ( value ) {   //SET DAD NODE
		if ( value instanceof QUARTZ.Node ) {
			this.dad = value;
		}
		return true;
	},
	
	addChild: function ( node ) {   //ADD A CHILD NODE
		if ( node instanceof QUARTZ.Node ) {
			return this.children.push(node);
		}
		return -1;
	},
	
	draw: function(){  //METHOD FOR NODE DRAWING IN SCENE
		this.entity.beginDraw(this.children);
		this.entity.endDraw();
	},
	
	remHijoByIndex: function(index) { //REMOVE A CHILD BY ITS INDEX
		this.children.splice(index,1);
	},
	
	remHijoByNode: function(node) {   //REMOVE A CHILD BY NODE
		for (var index in this.children){
			if(this.children[index]==node)
				{this.children.splice(index,1);}
		}
	}
};

QUARTZ.Scene = function(){  //ENTITY OF ROOT NODE
	return this;
}

QUARTZ.Scene.prototype =  {

	constructor: QUARTZ.Scene,

	beginDraw : function(children){
		for(var i=0;i<children.length;i++) {
			children[i].draw();
		}
		
	},
	endDraw : function(){

	}

}

QUARTZ.Color = function(r,g,b,a) { //CUSTOM COLOR CLASS
	return this;
}

QUARTZ.Color.prototype = {

	constructor: QUARTZ.Color,
	color: null,
	r:1,
	g:1,
	b:1,
	a:1,
	setColor: function(r,g,b,a){
		a = typeof a !== 'undefined' ? a : 1.0;
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
		color = vec4(r,g,b,a);
	}
}

QUARTZ.Light = function(amb, dif, spec, direction, position, intensity) { //LIGH ENTITY CLASS

	type: null;
	amb : null;
	dif: null;
	spec : null;
	position : null;
	direction : null;
	intensity: null;
	this.setLight(amb, dif, spec, direction, position, intensity);
	return this;

}

QUARTZ.Light.prototype = {

	constructor: QUARTZ.Light,	

	type: null,
	amb : null,
	dif: null,
	spec : null,
	position : null,
	direction : null,
	intensity: null,

	setAmbient : function(amb){
		this.amb=amb;
	},

	setDiffuse : function(dif){
		this.dif = dif;
	},

	setSpecular : function(spec){
		this.spec = spec;
	},

	setDirection : function(dir){
		this.direction = dir;
	},

	setPosition : function(pos){
		this.position = pos;
	},

	setIntensity : function(inten){
		this.intensity = inten;
	},

	setLight : function(amb, dif, spec, dir, pos, inten){		
		this.setAmbient(amb);
		this.setDiffuse(dif);
		this.setSpecular(spec);
		this.setDirection(dir);
		this.setPosition(pos);
		this.setIntensity(inten);
	},

	beginDraw : function(children){
		for(var i=0;i<children.length;i++) {
			children[i].draw();
		}
	},
	endDraw : function(){}
}


QUARTZ.Mesh = function() { 	//MESH ENTITY CLASS
	this.vertices = new Float32Array();
	this.normals =new Float32Array();
	this.uvt =new Float32Array();
	this.ind = new Array();
	this.fileURL = "";
	this.textureURL="";
	this.textureNum=null;
	this.texture=null;
	this.textureImg=null;
	this.color =[1,1,1,1];
	return this;
}

QUARTZ.Mesh.prototype = {

	constructor: QUARTZ.Mesh,

	vertices : null,
	normals : null,
	uvt : null,
	ind : null,
	fileURL : null,
	color : QUARTZ.Color("1","1","1"),


	setVertices : function(ver){
		this.vertices = ver;
	},

	initTextures : function(gl, mesh) {
		if(QUARTZ.textures.indexOf(this.textureURL)<0){
		this.texture = gl.createTexture();
		this.textureImg = new Image();
		this.textureImg.src = this.textureURL;
		this.textureImg.onload = function() {  mesh.handleTextureLoaded(mesh.textureImg, mesh.texture); }
		}


	},

	handleTextureLoaded : function(image, texture){

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
		var cadenas = image.src.split("/");
		if(QUARTZ.textures.indexOf(cadenas[cadenas.length-1])<0){
			QUARTZ.textures.push(cadenas[cadenas.length-1]);
			QUARTZ.textureFiles.push([image,texture,cadenas[cadenas.length-1]]);
		}
			this.textureNum = QUARTZ.textures.indexOf(this.textureImg.src);

	},

	setNormals : function(norm){
		this.normals = norm;
	},

	setUvt : function(uvt){
		this.uvt = uvt;
	},

	setIndexes : function(index){
		this.ind = index;
	},

	initArrays  : function(m, mesh){
		var model = null;
		var existing = false;

		if(mesh.fileURL.search(".obj")>-1){
			if(QUARTZ.models.indexOf(mesh.fileURL)<0){
				QUARTZ.models.push(mesh.fileURL);
				model = K3D.parse.fromOBJ(m);
		}

		else{
			existing=true;
			var index = QUARTZ.models.indexOf(mesh.fileURL);
			var mdata =QUARTZ.modelFiles[index];
			mesh.vertices = mdata[0];
			mesh.normals = mdata[1];
			mesh.uvt = mdata[2];
			mesh.ind = mdata[3];
		}

		}
			


		if(model != null && !existing){
			mesh.vertices = new Float32Array(K3D.edit.unwrap(model.i_verts, model.c_verts, 3));
			mesh.normals = new Float32Array(K3D.edit.unwrap(model.i_norms, model.c_norms, 3));
			mesh.uvt = new Float32Array(K3D.edit.unwrap(model.i_uvt, model.c_uvt, 2));
			var indicess = new Array();
			for(var i=0; i<model.i_verts.length; i++){ indicess.push(i);}
				mesh.ind = new Int16Array(indicess);QUARTZ.modelFiles.push([mesh.vertices,mesh.normals,mesh.uvt,mesh.ind]);
			
		}
},

	loadModel   : function(fURL) {
	this.fileURL = fURL; 
	K3D.load(this.fileURL,this.initArrays, this);},

	loadTexture : function(tURL) {
		this.textureURL = tURL;
	},

	beginDraw   : function(	) { //MAIN DRAW FUNCTION IN QUARTZ

		var prog;

		if(QUARTZ.program == null){
		prog = gl.createProgram();
		var addshader = function(type, source) {
			var s = gl.createShader((type == 'vertex') ?
				gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
			gl.shaderSource(s, source);
			gl.compileShader(s);
			if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
				throw "Could not compile "+type+
				" shader:\n\n"+gl.getShaderInfoLog(s);
			}
			gl.attachShader(prog, s);
		};


		addshader('vertex', QUARTZ.getVertexShader());
		addshader('fragment', QUARTZ.getFragmentShader()); 
		
		QUARTZ.program = prog;
		gl.linkProgram(prog);
		gl.useProgram(prog);
		}

		else{
			prog = QUARTZ.program;
		}

		

		var persp = mat4.create();
		mat4.perspective(45, QUARTZ.cwidth/QUARTZ.cheight, 0.1, 10000, persp);
		var mv = QUARTZ.getMVMatrix();
		//console.log(mv);

		prog.aVertexPosition  = gl.getAttribLocation(prog, "aVertexPosition");
		prog.aVertexNormal    = gl.getAttribLocation(prog, "aVertexNormal");
		prog.aTextureCoord    = gl.getAttribLocation(prog, "aTextureCoord");



		prog.uPMatrix         = gl.getUniformLocation(prog, "uPMatrix");
		prog.uMVMatrix        = gl.getUniformLocation(prog, "uMVMatrix");
		prog.uNMatrix         = gl.getUniformLocation(prog, "uNMatrix");
		prog.uModelColor      = gl.getUniformLocation(prog, "uModelColor");

		var normalMatrix = mat4.create();
		mat4.set(mv, normalMatrix);
		mat4.inverse(normalMatrix);
		mat4.transpose(normalMatrix);	    

		if(QUARTZ.lightsArray.length>0){

			prog.uAmbientColor = gl.getUniformLocation(prog, "uAmbientColor");

			var ambient = new Array();
			for(var i=0;i<QUARTZ.lightsArray.length;i++){
				ambient.push(QUARTZ.lightsArray[i].amb[0],QUARTZ.lightsArray[i].amb[1],QUARTZ.lightsArray[i].amb[2]);
			}

			gl.uniform3fv(prog.uAmbientColor, new Float32Array(ambient));




			prog.uPointLightingColor     = gl.getUniformLocation(prog, "uPointLightingColor");

			var diffuse = new Array();


			for(var i=0;i<QUARTZ.lightsArray.length;i++){
				diffuse.push(QUARTZ.lightsArray[i].dif[0],QUARTZ.lightsArray[i].dif[1],QUARTZ.lightsArray[i].dif[2]);
			}

			gl.uniform3fv(prog.uPointLightingColor, new Float32Array(diffuse));


			prog.uPointLightingLocation   = gl.getUniformLocation(prog, "uPointLightingLocation");

			var location = new Array();
			for(var i=0;i<QUARTZ.lightsArray.length;i++){
				location.push(QUARTZ.lightsArray[i].position[0],QUARTZ.lightsArray[i].position[1],QUARTZ.lightsArray[i].position[2]);
			}

			gl.uniform3fv(prog.uPointLightingLocation, new Float32Array(location));




			prog.uPointLightingIntensity = gl.getUniformLocation(prog, "uPointLightingIntensity");

			var intensity = new Array();
			for(var i=0;i<QUARTZ.lightsArray.length;i++){
				intensity.push(QUARTZ.lightsArray[i].intensity);
			}

			gl.uniform1fv(prog.uPointLightingIntensity, intensity);

			prog.uSpecularFactor = gl.getUniformLocation(prog, "uSpecularFactor");

			var specular = new Array();
			for(var i=0;i<QUARTZ.lightsArray.length;i++){
				specular.push(QUARTZ.lightsArray[i].spec);
			}

			gl.uniform1fv(prog.uSpecularFactor, specular);

		}
		
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		if(this.textureURL!=""){
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.uniform1i(gl.getUniformLocation(prog, "uSampler"), 0);
			gl.uniform1i(gl.getUniformLocation(prog, "uUseTextures"), 1);
			this.initTextures(gl, this);
		}

		else{
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.uniform1i(gl.getUniformLocation(prog, "uUseTextures"), 0);
		}
		
		gl.enableVertexAttribArray(prog.aVertexPosition);	
		gl.enableVertexAttribArray(prog.aVertexNormal);
		gl.enableVertexAttribArray(prog.aTextureCoord);
		
		gl.uniform4fv(prog.uModelColor, new Float32Array(this.color));
		gl.uniformMatrix4fv(prog.uMVMatrix, false, mv);
		gl.uniformMatrix4fv(prog.uPMatrix, false, persp);
		gl.uniformMatrix4fv(prog.uNMatrix, false, normalMatrix);
		
		if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
			throw "Could not link the shader program!";
		}

		var bNormals = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, bNormals);
		gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
		gl.vertexAttribPointer(prog.aVertexNormal, 3, gl.FLOAT, false, 0, 0);
	
		var bUvt = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, bUvt);
		gl.bufferData(gl.ARRAY_BUFFER, this.uvt, gl.STATIC_DRAW);
		gl.vertexAttribPointer(prog.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
	
		var bVertex = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, bVertex);
		gl.bufferData(gl.ARRAY_BUFFER, this.vertices ,gl.STATIC_DRAW);
		gl.vertexAttribPointer(prog.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

		var bIndexes = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bIndexes);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.ind.lenght,gl.STATIC_DRAW);
		
		gl.drawElements(gl.TRIANGLES, this.ind.length, gl.UNSIGNED_SHORT,0);
		gl.deleteBuffer(bNormals);
		gl.deleteBuffer(bUvt);
		gl.deleteBuffer(bVertex);
		gl.deleteBuffer(bIndexes);
	},

	endDraw     : function() {}
}

QUARTZ.Transf =function() { //TRANSFORMATION ENTITY CLASS
	this.rot = new Array();
	this.tras = null;
	return this;

}

QUARTZ.Transf.prototype = {

	constructor: QUARTZ.Transf,
	tras : null,
	sca : null,

	identity : function(mat) {
		mat4.identity(mat);
	},
	load : function(origin,target) {
		mat4.set(origin,target);
	},
	transpose : function(mat) {
		mat4.transpose(mat);
	},
	setTraslation : function(x,y,z) {
		this.tras = [x,y,z];
	},
	traslate : function(mat) {
		if(this.tras!=null)
			mat4.translate(mat,this.tras);
	},
	scale : function(mat) {
		if(this.sca!=null)
			mat4.scale(mat,this.sca);
	},
	addRotation : function(ang,axis){
		if(this.rot == null){
			this.rot =  new Array(2);
			this.rot.push([ang,axis]);
		}
		else this.rot.push([ang,axis]);
	},
	rotate : function(mat) {
		var matrix = mat4.create();
		for(var i=0;i<this.rot.length;i++){
			var ang = this.rot[i][0];
			var axis = this.rot[i][1];
			matrix = mat;
			mat4.rotate(matrix,(ang*Math.PI/180),axis);
		}
		matrix = mat;
		return matrix;
		
	},
	setScale : function(x, y, z) {
		if(typeof y !== 'undefined'){
		this.sca = [x,y,z];
	}
	else { this.sca = [x,x,x]; }
	},

	beginDraw : function(children) {

		mv = new Float32Array(QUARTZ.getMVMatrix());

		this.traslate(mv);
		mv=this.rotate(mv);
		this.scale(mv);
		QUARTZ.pushMatrix(mv);
		

		for(var i=0;i<children.length;i++) {
			children[i].draw();
		}
	},
	endDraw   : function() {
		QUARTZ.popMatrix();
	}

}


//INITIALIZE CLASSES

QUARTZ.createMesh = function(){

	var mesh = new QUARTZ.Mesh();
	return mesh;

};


QUARTZ.createLight = function(){

	var light = new QUARTZ.Light();
	return light;

};

QUARTZ.createTransform = function(){

	var transf = new QUARTZ.Transf();
	return transf;

};

//ADD NODE FUNCTIONS (PREVENT ERRORS FROM BAD CHILDING)

QUARTZ.addMesh = function(mesh,parent){

	if(parent instanceof QUARTZ.Node){ 

		if(mesh instanceof QUARTZ.Mesh){

			var nodo = new QUARTZ.Node();
			nodo.entity = mesh;
			parent.addChild(nodo);

			return nodo;

		}

		else 
			alert("There was a problem when adding mesh. It's not a Mesh.");

	}

	else 
		alert("There was a problem when adding mesh. Parent is not a Node.");

}

QUARTZ.addTransform = function(transf,parent){

	if(parent instanceof QUARTZ.Node){ 

		if(transf instanceof QUARTZ.Transf){

			var nodo = new QUARTZ.Node();
			nodo.entity = transf;
			parent.addChild(nodo);

			return nodo;

		}

		else 
			alert("There was a problem when adding a tranformation. It's not a Transformation.");

	}

	else 
		alert("There was a problem when adding transformation. Parent is not a Node.");

}

QUARTZ.addLight = function(light, parent){
	if(parent instanceof QUARTZ.Node){ 

		if(light instanceof QUARTZ.Light){
			
			QUARTZ.lightsArray.push(light);
			var nodo = new QUARTZ.Node();
			nodo.entity = light;

			return nodo;

		}

		else 
			alert("There was a problem when adding light "+(QUARTZ.lightsArray.length+1)+". It's not a light.");

	}

	else 
		alert("There was a problem when adding light "+(QUARTZ.lightsArray.length+1)+". Parent is not a Node.");

};


// VERTEX SHADER STRING GENERATOR
QUARTZ.getVertexShader = function(){

	var vshader = "";
	
	if(QUARTZ.lightsArray.length>0)
		vshader+="const int numLights = "+QUARTZ.lightsArray.length+";";
	else
		vshader+="const int numLights = 1;";

	vshader+="attribute vec3 aVertexNormal;";
	vshader+="attribute vec3 aVertexPosition;";
	vshader+="attribute vec2 aTextureCoord;";
	vshader+="attribute vec3 aVertexColor;";


	vshader+="uniform highp mat4 uMVMatrix;";
	vshader+="uniform highp mat4 uPMatrix;";
	vshader+="uniform highp mat4 uNMatrix;";
	vshader+="uniform mediump vec4 uModelColor;";
	vshader+="uniform mediump vec3 uAmbientColor[numLights];";
	vshader+="uniform mediump vec3 uPointLightingLocation[numLights];";
	vshader+="uniform mediump vec3 uPointLightingColor[numLights];";
	vshader+="uniform mediump float uniformPointLightingIntensity[numLights];";
	vshader+="uniform mediump float uSpecularFactor[numLights];";
	vshader+="uniform sampler2D uSampler;";

	vshader+="varying vec3 vColor;";
	vshader+="varying vec4 mvPosition;";
	vshader+="varying mediump vec4 transformedNormal;";
	vshader+="varying vec2 vTextureCoord;"; 

	vshader+="void main(void) {";
	vshader+="	  mvPosition = uMVMatrix * vec4(aVertexPosition,1.0);"
	vshader+="	  gl_Position = uPMatrix * mvPosition;";
	vshader+="    transformedNormal =  normalize(uNMatrix * vec4(aVertexNormal, 1.0));";
	vshader+="	  vTextureCoord = aTextureCoord;";
	vshader+="    vColor = vec3(1,1,1);";

 vshader+="}";

 return vshader;

}

// FRAGMENT SHADER STRING GENERATOR
QUARTZ.getFragmentShader = function(){

	var fshader = "";

	if(QUARTZ.lightsArray.length>0)
		fshader+="const int numLights = "+QUARTZ.lightsArray.length+";";
	else
		fshader+="const int numLights = 1;";

	
	fshader+="varying mediump vec3 vColor;";
	fshader+="mediump vec3 vLightWeighting;";
	fshader+="varying highp vec4 mvPosition;";
	fshader+="varying mediump vec4 transformedNormal;";
	fshader+="varying mediump vec2 vTextureCoord;"; 

	fshader+="uniform bool uUseTextures;";
	fshader+="uniform highp mat4 uMVMatrix;";
	fshader+="uniform highp mat4 uPMatrix;";
	fshader+="uniform highp mat4 uNMatrix;";
	fshader+="uniform mediump vec4 uModelColor;";
	fshader+="uniform mediump vec3 uAmbientColor[numLights];";
	fshader+="uniform mediump vec3 uPointLightingLocation[numLights];";
	fshader+="uniform mediump vec3 uPointLightingColor[numLights];";
	fshader+="uniform mediump float uPointLightingIntensity[numLights];";
	fshader+="uniform mediump float uSpecularFactor[numLights];";
	fshader+="uniform sampler2D uSampler;";
	fshader+="mediump vec4 fragmentColor;";




	fshader+="void main(void) {";
	if(QUARTZ.lightsArray.length>0){

		fshader+="for (int i = 0; i < numLights; i++) {";
		fshader+="    mediump vec3 lightDirection = normalize(mvPosition.xyz-uPointLightingLocation[i]);";
		fshader+="    mediump float lightDistance = length(uPointLightingLocation[i] - mvPosition.xyz);";
		fshader+="	  if(lightDistance < 0.0){lightDistance = lightDistance * - 1.0;}";
		fshader+="	  lightDistance = (1000.0-lightDistance) / 1000.0;"
		fshader+="    mediump float directionalLightWeighting = max(dot(transformedNormal.xyz, lightDirection), 0.0);";
		fshader+="    if(i==0){"
		fshader+="    	vLightWeighting  =  uAmbientColor[i] + uPointLightingColor[i] * lightDistance * directionalLightWeighting;";
		fshader+="    }"
		fshader+="	  else vLightWeighting = vLightWeighting + (uAmbientColor[i] + uPointLightingColor[i] * lightDistance * directionalLightWeighting);";
		
		//SPECULAR
		fshader+="	   mediump vec3 E = normalize(-mvPosition.xyz);";
		fshader+="	   mediump vec3 R = reflect(lightDirection, transformedNormal.xyz);";
		fshader+="	  mediump float specular = pow( max(dot(R, E), 0.0), uSpecularFactor[i]);"
		fshader+="    vLightWeighting = vLightWeighting + uPointLightingColor[i] * specular;";
		fshader+="	  }";
		fshader+="	  if (uUseTextures) {";
		fshader+="		fragmentColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));";
		fshader+="	  }";
		fshader+="	  else fragmentColor = vec4(uModelColor);"
		fshader+="    gl_FragColor = vec4(fragmentColor.rgb * vLightWeighting, fragmentColor.a);";
	}

	else{
		fshader+="	  if (uUseTextures) {";
		fshader+="		fragmentColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));";
		fshader+="	  }";
		fshader+="	  else{";
		fshader+="	  fragmentColor = vec4(uModelColor);}"
		fshader+="	  gl_FragColor = fragmentColor;"
	}

	fshader+="}";


	return fshader;
	
}


function initWebGL(canvas) { //START QUARTZ CANVAS
	gl = null;

	try {
    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
}
catch(e) {}

  // If we don't have a GL context, give up now
  if (!gl) {
  	alert("Unable to initialize WebGL. Your browser may not support it.");
  	gl = null;
  }
  
  return gl;
}

QUARTZ.start = function(canvasid) { 
	var canvas = document.getElementById(canvasid);

  gl = initWebGL(canvas);      // Initialize the GL context
  
  // Only continue if WebGL is available and working
  
  if (gl) {
    gl.clearColor(0, 0, 0, 1.0);                      // Set clear color to black, fully opaque
    gl.enable(gl.DEPTH_TEST); 
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);                              // Enable depth testing
    gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT); // Clear the color as well as the depth buffer.
    QUARTZ.cwidth = canvas.width;     
    QUARTZ.cheight = canvas.height;     

    gl.viewport(0, 0, canvas.width, canvas.height);

}


}

QUARTZ.draw = function(r,g,b){
	if(typeof r !== undefined)
	gl.clearColor(r,g,b, 1.0); // Set clear color to black, fully opaque
	else   gl.clearColor(0,0,0, 1.0);       
    gl.enable(gl.DEPTH_TEST); 
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);     // Enable depth testing
    gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	var mv = mat4.create();
	mat4.identity(mv);
	QUARTZ.modelView = new Array();
	QUARTZ.modelView.push(mv);
	QUARTZ.getRoot().draw();
}

QUARTZ.init = function(canvasid){
	QUARTZ.start(canvasid);
	QUARTZ.draw();
}

