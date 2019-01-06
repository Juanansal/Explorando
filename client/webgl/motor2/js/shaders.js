    var vertexShaderSource =

        "    attribute vec3 vertexPos;\n" +
        "    uniform mat4 modelViewMatrix;\n" +
        "    uniform mat4 projectionMatrix;\n" +
        "    void main(void) {\n" +
        "        // Return the transformed and projected vertex value\n" +
        "        gl_Position = projectionMatrix * modelViewMatrix * \n" +
        "            vec4(vertexPos, 1.0);\n" +
        "    }\n";

    var fragmentShaderSource =
        "    void main(void) {\n" +
        "    // Return the pixel color: always output white\n" +
        "    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n" +
        "}\n";