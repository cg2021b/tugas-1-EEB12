var vertexShaderText = `
    precision mediump float;

    attribute vec2 vertPosition;
    attribute vec3 vertColor;
    varying vec3 fragColor;
    
    uniform mat4 uTranslate;

    void main() {
        fragColor = vertColor;
        gl_Position = uTranslate * vec4(vertPosition, 0.0, 1.0);
    }
`;

var fragmentShaderText = `
    precision mediump float;
    
    varying vec3 fragColor;
    void main() {
        gl_FragColor = vec4(fragColor, 1.0);
    }
`;

function main() {
    //
    //  Initial
    //
    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");

  
    if (!gl) {
        console.log("WebGL not supporte, falling back on experimental");
        gl = canvas.getContext("experimental-webgl");
    }
    if (!gl) {
        alert("Your browser does not support WebGL");
    }
    
   
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);
    
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling fragment shader!", gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling fragment shader!", gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("ERROR validating program!", gl.getProgramInfoLog(program));
        return;
    }

  
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error("ERROR validating program!", gl.getProgramInfoLog(program));
        return;
    }

    // 
    //  Create buffer
    //
    var triangleVertices_kanan = 
    [ // X, Y,      R, G, B
     
        //atas oren
        0.11,0.299,  1 , 0.6, 0,
        0.997,-0.238,  1 , 0.6, 0,
        0.002,-0.2167,  1 , 0.6, 0,

        0.11,0.299,  1 , 0.6, 0,
        0.997,-0.238,  1 , 0.6, 0,
        0.872,0.299,    1 , 0.6, 0,

        // bawah abu abu
        0.997,-0.238,  0.55, 0.55, 0.55,
        0.002,-0.2167,  0.55, 0.55, 0.55,
        0.9746,-0.2976,  0.55, 0.55, 0.55,

        0.002,-0.2167,  0.55, 0.55, 0.55,
        0.9746,-0.2976,  0.55, 0.55, 0.55,
        0.024,-0.279,   0.55, 0.55, 0.55,


      

        
    ];

    var triangleVertices_kiri = 
    [   // X, Y,      R, G, B
        

         // atas oren
            -0.09,-0.22,      1 , 0.6, 0,
            -0.005,0.21,      1 , 0.6, 0,
            -0.995,-0.04,    1 , 0.6, 0,
        

            -0.69,0.296,      1 , 0.6, 0,
            -0.005,0.21,      1 , 0.6, 0,
            -0.995,-0.04,    1 , 0.6, 0,

        //  bawah abu abu
            -0.995,-0.04,       0.55, 0.55, 0.55,
            -0.955,-0.135,      0.55, 0.55, 0.55,
            -0.11,-0.3,          0.55, 0.55, 0.55,

            -0.1,-0.219,           0.55, 0.55, 0.55,
            -0.995,-0.04,       0.55, 0.55, 0.55,
            -0.11,-0.3,          0.55, 0.55, 0.55,

            
            -0.005,0.21,       0.55, 0.55, 0.55,
            -0.012,0.129,      0.55, 0.55, 0.55,
            -0.042,0,      0.55, 0.55, 0.55,

            -0.005,0.21,       0.55, 0.55, 0.55,
            -0.045,0.0001,      0.55, 0.55, 0.55,
            -0.042,0,      0.55, 0.55, 0.55,
        
     

    ];

    var triangleVertices = [...triangleVertices_kiri, ...triangleVertices_kanan];

    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, 
        2, 
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, 
        0 
    );
    gl.vertexAttribPointer(
        colorAttribLocation, 
        3, 
        gl.FLOAT, 
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, 
        2 * Float32Array.BYTES_PER_ELEMENT 
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    //
    //  Main render loop
    //
    const uTranslate = gl.getUniformLocation(program, 'uTranslate');
    var speed = 0.0121;
    var dy = 0;

    function render() {
        if (dy >= 0.7 || dy <= -0.7) {
            speed = -speed;
        }
		
        dy += speed;
        
		const kiri = [
			1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			0.0, 0.0, 0.0, 1.0,
		];
		
		const kanan = [
			1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			0.0, dy, 0.0, 1.0,
		];

        //  clear color
        gl.clearColor(0.8, 0.8, 0.8, 1.0); // warna background
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(program);
        gl.uniformMatrix4fv(uTranslate, false, kiri);
        gl.drawArrays(gl.TRIANGLES, 0, triangleVertices_kiri.length/5);

		gl.uniformMatrix4fv(uTranslate, false, kanan);
        gl.drawArrays(gl.TRIANGLES, triangleVertices_kiri.length/5, triangleVertices_kanan.length/5);
            
        requestAnimationFrame(render);
    }
    render();
}
