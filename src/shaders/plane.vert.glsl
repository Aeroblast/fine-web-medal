attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform highp float uInverseRadius;
varying highp vec3 vTransformedNormal;
varying highp vec2 vTextureCoord;
varying highp vec3 vPosition;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vPosition = (uModelViewMatrix * vec4(aVertexPosition, 1.0)).xyz;
    vTransformedNormal = normalize(uNormalMatrix * aVertexNormal);
    float x = aVertexPosition.x * uInverseRadius;
    float y = aVertexPosition.y * uInverseRadius;
    vTextureCoord = vec2(
        x * 0.5 + 0.5,
        y * 0.5 + 0.5
    );
}