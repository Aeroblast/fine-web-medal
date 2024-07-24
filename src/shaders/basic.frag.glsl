varying highp vec3 vColor;
varying highp vec3 vTransformedNormal;
varying highp vec3 vPosition;
void main(void) {
    highp vec3 specularColor = vec3(1.0, 1.0, 1.0);
    highp float shininess = 32.0;
          
    //gl_FragColor = texture2D(uSampler, vTextureCoord)
    highp vec3 lightDir = normalize(vPosition - vec3(0, 0, 2));
    highp vec3 viewDir = normalize(vec3(0.0, -0.0, -1));
    highp vec3 reflectDir = reflect(-lightDir, vTransformedNormal);
    highp float specular = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    specularColor = specular * specularColor;

    gl_FragColor = vec4(vColor + specularColor, 1.0);
    //gl_FragColor = vec4(vColor, 1.0); //for debug
   
}