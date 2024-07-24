attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform highp vec3 uBaseColor;
varying highp vec3 vColor;
varying highp vec3 vTransformedNormal;
varying highp vec3 vPosition;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vPosition = (uModelViewMatrix * vec4(aVertexPosition, 1.0)).xyz;
    vTransformedNormal = normalize(uNormalMatrix * aVertexNormal);
    highp vec3 viewDir = vec3(0, 0, -1);
    highp float amb = max(-dot(vTransformedNormal, viewDir), 0.0);
    vColor = uBaseColor * (0.5 + 0.5 * amb);
}