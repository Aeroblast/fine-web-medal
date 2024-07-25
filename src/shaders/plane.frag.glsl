varying highp vec2 vTextureCoord;
varying highp vec3 vTransformedNormal;
varying highp vec3 vPosition;
uniform sampler2D uSampler;

void main(void) {
    highp vec4 baseColor = texture2D(uSampler, vTextureCoord);

    highp vec3 specularColor = vec3(1.0, 1.0, 1.0);
    highp float shininess = 32.0;
          
    highp vec3 lightDir = normalize(vPosition - vec3(3, 0, 4));
    highp vec3 viewDir = normalize(vec3(0.0, -0.0, -1));
    highp vec3 reflectDir = reflect(-lightDir, vTransformedNormal);
    highp float specular = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    specularColor = specular * specularColor;
    gl_FragColor = baseColor + vec4(specularColor, 1.0);

}
