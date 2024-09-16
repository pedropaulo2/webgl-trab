var teximg = [];
var texSrc = ["gato.jpg", "cachorro.png"];
var loadTexs = 0;
var gl;
var prog;
var campos = [5, 5, 5];

var angle = 0;

// Variáveis para controle da rotação da câmera
var yaw = 0;   // Rotação horizontal
var pitch = 0; // Rotação vertical
var sensitivity = 0.1; // Sensibilidade do mouse
var lastX;  // Última posição X do mouse
var lastY; // Última posição Y do mouse
var firstMouse = true; // Verifica se o movimento do mouse é o primeiro

// Fim


// Matrizes

var projectionMatrixLocation, viewMatrixLocation, modelMatrixLocation;
var projectionMatrix, viewMatrix, modelMatrix;

var vertexBuffer;


var mazeVertices;
// Fim


// Captura do mouse
function handleMouseMove(event) {
    if (firstMouse) {
        lastX = event.clientX;
        lastY = event.clientY;
        firstMouse = false;
    }

    var xOffset = event.clientX - lastX;
    var yOffset = lastY - event.clientY; // O Y é invertido

    lastX = event.clientX;
    lastY = event.clientY;

    xOffset *= sensitivity;
    yOffset *= sensitivity;

    yaw += xOffset;
    pitch += yOffset;

    if (pitch > 89.0) pitch = 89.0;
    if (pitch < -89.0) pitch = -89.0;
}


// Fim


// Controle setas

var keys = {};

document.addEventListener('keydown', function(event) {
    keys[event.code] = true;
});

document.addEventListener('keyup', function(event) {
    keys[event.code] = false;
});


// Movimento da câmera

function handleKeyboard() {
    var speed = 0.1;  // Velocidade de movimento

    if (keys['KeyW']) {  // W para frente
        campos[0] -= speed * Math.sin(angle * Math.PI / 180.0);
        campos[2] -= speed * Math.cos(angle * Math.PI / 180.0);
    }
    if (keys['KeyS']) {  // S para trás
        campos[0] += speed * Math.sin(angle * Math.PI / 180.0);
        campos[2] += speed * Math.cos(angle * Math.PI / 180.0);
    }
    if (keys['KeyA']) {  // A para esquerda
        campos[0] -= speed * Math.cos(angle * Math.PI / 180.0);
        campos[2] += speed * Math.sin(angle * Math.PI / 180.0);
    }
    if (keys['KeyD']) {  // D para direita
        campos[0] += speed * Math.cos(angle * Math.PI / 180.0);
        campos[2] -= speed * Math.sin(angle * Math.PI / 180.0);
    }
}




function getGL(canvas)
{
    
    var gl = canvas.getContext("webgl");
    
    if(gl) return gl;
    
    gl = canvas.getContext("experimental-webgl");
    if(gl) return gl;
    
    alert("Contexto WebGL inexistente! Troque de navegador!");
    return false;
}

function createShader(gl, shaderType, shaderSrc)
{
	var shader = gl.createShader(shaderType);
	gl.shaderSource(shader, shaderSrc);
	gl.compileShader(shader);
	
	if(gl.getShaderParameter(shader, gl.COMPILE_STATUS))
		return shader;
	
	alert("Erro de compilaÃ§Ã£o: " + gl.getShaderInfoLog(shader));
	
	gl.deleteShader(shader);
}

function createProgram(gl, vtxShader, fragShader)
{
	var prog = gl.createProgram();
	gl.attachShader(prog, vtxShader);
	gl.attachShader(prog, fragShader);
	gl.linkProgram(prog);
	
	if(gl.getProgramParameter(prog, gl.LINK_STATUS))
		return prog;

    alert("Erro de linkagem: " + gl.getProgramInfoLog(prog));
	
	gl.deleteProgram(prog);	
}

function init()
{
    for(i = 0; i < texSrc.length; i++)
    {
        teximg[i] = new Image();
        teximg[i].src = texSrc[i];
        teximg[i].onload = function()
        {
            loadTexs++;
    	    loadTextures();
        }
    }
}

function loadTextures()
{
    if(loadTexs == texSrc.length)
    {
       initGL();
       configScene();
       draw();
    }
}
    
function initGL()
{

	var canvas = document.getElementById("glcanvas1");
	
	gl = getGL(canvas);
	if(gl)
	{
        //Inicializa shaders
 		var vtxShSrc = document.getElementById("vertex-shader").text;
		var fragShSrc = document.getElementById("frag-shader").text;

        var vtxShader = createShader(gl, gl.VERTEX_SHADER, vtxShSrc);
        var fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShSrc);
        prog = createProgram(gl, vtxShader, fragShader);	
        
        gl.useProgram(prog);

        //Inicializa Ã¡rea de desenho: viewport e cor de limpeza; limpa a tela
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.enable( gl.BLEND );
        gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
        gl.enable(gl.DEPTH_TEST);
        //gl.enable(gl.CULL_FACE);

    }

    // Adiciona evento do mouse
    lastX = gl.canvas.width / 2
    lastY = gl.canvas.height / 2;
    canvas.addEventListener('mousemove', handleMouseMove)
}    

// function configScene()
// {    
//         //Define coordenadas dos triÃ¢ngulos
//         var coordTriangles = new Float32Array([
//         					//Quad 1
//         					-0.5,  0.5, 0.0, 0.0, 0.0, 
//         					-0.5, -0.5, 0.0, 0.0, 1.0, 
//         					 0.5, -0.5, 0.0, 1.0, 1.0,
//         					 0.5,  0.5, 0.0, 1.0, 0.0, 
//         					-0.5,  0.5, 0.0, 0.0, 0.0,
        					
//         					//Quad 2
//         					-0.5, -0.5, 0.0, 1.0, 1.0, 
//         					-0.5,  0.5, 0.0, 1.0, 0.0, 
//         					-0.5,  0.5, 1.0, 0.0, 0.0,
//         					-0.5, -0.5, 1.0, 0.0, 1.0, 
//         					-0.5, -0.5, 0.0, 1.0, 1.0,
        					
//         					//Quad 3
//         					 0.5, -0.5, 1.0, 1.0, 1.0, 
//         					 0.5, -0.5, 0.0, 1.0, 0.0, 
//         					-0.5, -0.5, 0.0, 0.0, 0.0,
//         					-0.5, -0.5, 1.0, 0.0, 1.0, 
//         					 0.5, -0.5, 1.0, 1.0, 1.0
//         									 ]);
        									
//         //Cria buffer na GPU e copia coordenadas para ele
//         var bufPtr = gl.createBuffer();
//         gl.bindBuffer(gl.ARRAY_BUFFER, bufPtr);
//         gl.bufferData(gl.ARRAY_BUFFER, coordTriangles, gl.STATIC_DRAW);
        
//         //Pega ponteiro para o atributo "position" do vertex shader
//         var positionPtr = gl.getAttribLocation(prog, "position");
//         gl.enableVertexAttribArray(positionPtr);
//         //Especifica a cÃ³pia dos valores do buffer para o atributo
//         gl.vertexAttribPointer(positionPtr, 
//         					   3,        //quantidade de dados em cada processamento
//         					   gl.FLOAT, //tipo de cada dado (tamanho)
//         					   false,    //nÃ£o normalizar
//         					   5*4,      //tamanho do bloco de dados a processar em cada passo
//         					             //0 indica que o tamanho do bloco Ã© igual a tamanho
//         					             //lido (2 floats, ou seja, 2*4 bytes = 8 bytes)
//         					   0         //salto inicial (em bytes)
//         					  );
        
//         var texcoordPtr = gl.getAttribLocation(prog, "texCoord");
//         gl.enableVertexAttribArray(texcoordPtr);
//         //Especifica a cÃ³pia dos valores do buffer para o atributo
//         gl.vertexAttribPointer(texcoordPtr, 
//         					   2,        //quantidade de dados em cada processamento
//         					   gl.FLOAT, //tipo de cada dado (tamanho)
//         					   false,    //nÃ£o normalizar
//         					   5*4,      //tamanho do bloco de dados a processar em cada passo
//         					             //0 indica que o tamanho do bloco Ã© igual a tamanho
//         					             //lido (2 floats, ou seja, 2*4 bytes = 8 bytes)
//         					   3*4       //salto inicial (em bytes)
//         					  );
        					  
// //IluminaÃ§Ã£o =================================================================
//         var normals = new Float32Array([
//         					//Quad 1
//         					0, 0, 1,
//         					0, 0, 1,
//         					0, 0, 1,
//         					0, 0, 1,
//         					0, 0, 1,
        					
//         					//Quad 2
//         					1, 0, 0,
//         					1, 0, 0,
//         					1, 0, 0,
//         					1, 0, 0,
//         					1, 0, 0,
        					
//         					//Quad 3
//         					0, 1, 0,
//         					0, 1, 0,
//         					0, 1, 0,
//         					0, 1, 0,
//         					0, 1, 0
//         									 ]);
        									
//         //Cria buffer na GPU e copia coordenadas para ele
//         var bufnormalPtr = gl.createBuffer();
//         gl.bindBuffer(gl.ARRAY_BUFFER, bufnormalPtr);
//         gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
        
//         //Pega ponteiro para o atributo "position" do vertex shader
//         var normalPtr = gl.getAttribLocation(prog, "normal");
//         gl.enableVertexAttribArray(normalPtr);
//         //Especifica a cÃ³pia dos valores do buffer para o atributo
//         gl.vertexAttribPointer(normalPtr, 
//         					   3,        //quantidade de dados em cada processamento
//         					   gl.FLOAT, //tipo de cada dado (tamanho)
//         					   false,    //nÃ£o normalizar
//         					   0,      //tamanho do bloco de dados a processar em cada passo
//         					             //0 indica que o tamanho do bloco Ã© igual a tamanho
//         					             //lido (2 floats, ou seja, 2*4 bytes = 8 bytes)
//         					   0         //salto inicial (em bytes)
//         					  );
        					  
//         var lightDirectionPtr = gl.getUniformLocation(prog, "lightDirection");
//         gl.uniform3fv(lightDirectionPtr, [0, 0, -1]/*[-0.2, -1, -0.7]*/);
        
//         var lightColorPtr = gl.getUniformLocation(prog, "lightColor");
//         gl.uniform3fv(lightColorPtr, [1, 1, 1]);
        
//         var lightposPtr = gl.getUniformLocation(prog, "lightpos");
//         gl.uniform3fv(lightposPtr, [0.25, 0.0, 0.5]);
        
//         var camposPtr = gl.getUniformLocation(prog, "campos");
//         gl.uniform3fv(camposPtr, campos);
// //============================================================================        					  
        					  
        					  
//         //submeter textura para gpu
//         var tex0 = gl.createTexture();
//         gl.activeTexture(gl.TEXTURE0);
//         gl.bindTexture(gl.TEXTURE_2D, tex0);
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);        
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
//         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, teximg[0]);
        
//         var tex1 = gl.createTexture();
//         gl.activeTexture(gl.TEXTURE1);
//         gl.bindTexture(gl.TEXTURE_2D, tex1);
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);        
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
//         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, teximg[1]);
        
// }  


// Novo configScene()

function configScene() {
    // Defina as coordenadas dos triângulos para o labirinto
    mazeVertices = new Float32Array([
        // Faces do labirinto
        // (Você deve substituir isto pelos vértices reais do seu labirinto)
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,
        1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,

        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0,  1.0, -1.0,
        -1.0,  1.0, -1.0,
        // Continue adicionando os vértices necessários para o labirinto
    ]);

    // Cria o buffer e carrega os dados dos vértices
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mazeVertices, gl.STATIC_DRAW);

    // Obtém os ponteiros para os atributos e uniformes
    const positionLocation = gl.getAttribLocation(prog, 'position');
    const texCoordLocation = gl.getAttribLocation(prog, 'texCoord');
    const normalLocation = gl.getAttribLocation(prog, 'normal');

    // Configura o atributo 'position'
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 5 * 4, 0);

    // Configura o atributo 'texCoord'
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 5 * 4, 3 * 4);

    // Configura o atributo 'normal'
    gl.enableVertexAttribArray(normalLocation);
    gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

    // Compila e linka os shaders
    const vertShader = createShader(gl, gl.VERTEX_SHADER, document.getElementById('vertex-shader').text);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, document.getElementById('frag-shader').text);
    prog = createProgram(gl, vertShader, fragShader);
    gl.useProgram(prog);

    // Obtém os locais dos uniformes
    projectionMatrixLocation = gl.getUniformLocation(prog, 'transfproj');
    viewMatrixLocation = gl.getUniformLocation(prog, 'transf');
    modelMatrixLocation = gl.getUniformLocation(prog, 'modelMatrix');

    // Define os valores iniciais para os uniformes
    projectionMatrix = createPerspective(20, gl.canvas.width / gl.canvas.height, 1, 50);
    viewMatrix = createCamera(campos, [0, 0, 0], [0, 1, 0]);
    modelMatrix = math.identity(4)._data.flat();
}


function createPerspective(fovy, aspect, near, far)
{
    fovy = fovy*Math.PI/180.0;

    var fy = 1/math.tan(fovy/2.0);
    var fx = fy/aspect;
    var B = -2*far*near/(far-near);
    var A = -(far+near)/(far-near);

	var proj = math.matrix(
							[[ fx, 0.0,  0.0, 0.0],
							 [0.0,  fy,  0.0, 0.0],
							 [0.0, 0.0,    A,   B],
							 [0.0, 0.0, -1.0, 0.0]]
							);
							
	return proj;
}


// function createCamera(pos, target, up)
// {  
//   var zc = math.subtract(pos, target);
//   zc = math.divide(zc, math.norm(zc));
  
//   var yt = math.subtract(up, pos);
//   yt = math.divide(yt, math.norm(yt));
  
//   var xc = math.cross(yt, zc);
//   xc = math.divide(xc, math.norm(xc));
  
//   var yc = math.cross(zc, xc);
//   yc = math.divide(yc,math.norm(yc));
  
//   var mt = math.inv(math.transpose(math.matrix([xc,yc,zc])));
  
//   mt = math.resize(mt, [4,4], 0);
//   mt._data[3][3] = 1;
  
//   var mov = math.matrix([[1, 0, 0, -pos[0]], 
//                          [0, 1, 0, -pos[1]],
//                          [0, 0, 1, -pos[2]],
//                          [0, 0, 0, 1]]);
  
//   var cam = math.multiply(mt, mov);
  
//   return cam;
// }  

// Novo createCamera()

function createCamera(pos, target, up) {
    var zc = math.subtract(pos, target);
    zc = math.divide(zc, math.norm(zc));
    
    var xc = math.cross(up, zc);
    xc = math.divide(xc, math.norm(xc));
    
    var yc = math.cross(zc, xc);
    yc = math.divide(yc, math.norm(yc));
    
    var mt = math.matrix([
        [xc[0], xc[1], xc[2], 0],
        [yc[0], yc[1], yc[2], 0],
        [zc[0], zc[1], zc[2], 0],
        [0, 0, 0, 1]
    ]);
    
    mt = math.inv(math.transpose(mt));
    
    var mov = math.matrix([
        [1, 0, 0, -pos[0]],
        [0, 1, 0, -pos[1]],
        [0, 0, 1, -pos[2]],
        [0, 0, 0, 1]
    ]);
    
    return math.multiply(mt, mov);
}



// function draw()
// {

//         // Atualização da câmera
//         handleKeyboard(); // Atualiza a posição da câmera com base na entrada

//         // Fim da modificação


// 		var mproj = createPerspective(20, gl.canvas.width/gl.canvas.height, 1, 50);
// 		//var cam = createCamera([5, 5, 5], [0, 0, 0], [5, 6, 5]);
// 		// var cam = createCamera(campos, [0, 0, 0], [5, 6, 5]);

//         // Novo createCamera()
//         var cam = createCamera(campos, [0,0,0], [0,1,0])
		
// 		var tz = math.matrix(
// 							[[1.0, 0.0,  0.0, 0.0],
// 							 [0.0, 1.0,  0.0, 0.0],
// 							 [0.0, 0.0,  1.0,-5.0],
// 							 [0.0, 0.0,  0.0, 1.0]]
// 							);

//         var matrotZ = math.matrix(
//                        [[Math.cos(angle*Math.PI/180.0), -Math.sin(angle*Math.PI/180.0), 0.0, 0.0], 
//                        [Math.sin(angle*Math.PI/180.0),  Math.cos(angle*Math.PI/180.0), 0.0, 0.0],
//                        [0.0,    0.0,   1.0, 0.0],
//                        [0.0,    0.0,   0.0, 1.0]]
//                        );
                      
//         var matrotY = math.matrix(
//                       [[Math.cos(angle*Math.PI/180.0), 0.0, -Math.sin(angle*Math.PI/180.0), 0.0], 
//                        [0.0, 1.0, 0.0, 0.0],
//                        [Math.sin(angle*Math.PI/180.0),  0.0, Math.cos(angle*Math.PI/180.0), 0.0],
//                        [0.0,    0.0,   0.0, 1.0]]
//                        );
                      
//         var matrotX = math.matrix(
//                      [[1.0, 0.0, 0.0, 0.0],
//         			  [0.0, Math.cos(angle*Math.PI/180.0), -Math.sin(angle*Math.PI/180.0), 0.0], 
//                       [0.0, Math.sin(angle*Math.PI/180.0),  Math.cos(angle*Math.PI/180.0), 0.0],
//                       [0.0,    0.0,   0.0 ,1.0]]
//                       );                               
                      
//         var transforma = math.multiply(matrotY, matrotX);
//         transforma = math.multiply(matrotZ, transforma);
        
//         var transformaproj = math.multiply(cam, transforma);
//         transformaproj = math.multiply(mproj, transformaproj);
        
//         transformaproj = math.flatten(math.transpose(transformaproj))._data;           
//         var transfprojPtr = gl.getUniformLocation(prog, "transfproj");
//         gl.uniformMatrix4fv(transfprojPtr, false, transformaproj);
        
//         transforma = math.flatten(math.transpose(transforma))._data;           
//         transfPtr = gl.getUniformLocation(prog, "transf");
//         gl.uniformMatrix4fv(transfPtr, false, transforma);
        
//         gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
        
//         //desenha triÃ¢ngulos - executa shaders
//         var texPtr = gl.getUniformLocation(prog, "tex");
//         gl.uniform1i(texPtr, 0);
//         gl.drawArrays(gl.TRIANGLES, 0, 3);
//         gl.drawArrays(gl.TRIANGLES, 2, 3);
        
//         gl.uniform1i(texPtr, 1);
//         gl.drawArrays(gl.TRIANGLES, 5, 3);
//         gl.drawArrays(gl.TRIANGLES, 7, 3);
        
//         gl.uniform1i(texPtr, 0);
//         gl.drawArrays(gl.TRIANGLES, 10, 3);
//         gl.uniform1i(texPtr, 1);
//         gl.drawArrays(gl.TRIANGLES, 12, 3);
        
        
        
//         angle++;

//         // Logs

//         console.log("cam", cam);
//         console.log("transforma", transforma);
//         console.log("transformaproj", transformaproj);
//         // Fim
	    
// 	    requestAnimationFrame(draw);
// }

// Atualize a função draw para desenhar o labirinto
function draw() {
    // Limpa o canvas e o buffer de profundidade
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Habilita o uso do buffer de profundidade
    gl.enable(gl.DEPTH_TEST);

    // Configura a matriz de projeção
    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);

    // Configura a matriz de visão
    gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);

    // Configura a matriz de modelo
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);

    // Desenha o labirinto
    drawMaze();
}

// Atualize a função drawMaze para desenhar o labirinto
function drawMaze() {
    // Limite a geometria do labirinto ao buffer de vértices
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.drawArrays(gl.TRIANGLES, 0, mazeVertices.length / 3);
}