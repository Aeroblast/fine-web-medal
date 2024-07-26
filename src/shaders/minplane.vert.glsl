attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform highp float uInverseRadius;

varying highp vec2 vTextureCoord;
varying highp float amb;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
    highp vec3 transformedNormal = normalize(uNormalMatrix * aVertexNormal);
    
    highp vec3 viewDir = vec3(0, 0, -1);
    amb = max(-dot(transformedNormal, viewDir), 0.0);
    
    float x = aVertexPosition.x * uInverseRadius;
    float y = aVertexPosition.y * uInverseRadius;
    vTextureCoord = vec2(
        x * 0.5 + 0.5,
        y * 0.5 + 0.5
    );
}