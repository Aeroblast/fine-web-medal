varying highp vec3 vTransformedNormal;
varying highp vec3 vPosition;
varying highp vec2 vTextureCoord;


uniform highp mat3 uNormalMatrix;
uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform samplerCube uCubeSampler;

// 法线，只给平面用的版本
 
void main() {
  highp vec3 viewPos = vec3(0,0,0);
  // highp vec3 normal= normalize(vTransformedNormal);
  highp vec3 subnormal = texture2D(uSampler2, vTextureCoord).xyz * 2.0 - 1.0;
  highp vec3 normal = uNormalMatrix * subnormal;
  highp vec3 eyeToSurfaceDir = normalize(vPosition - viewPos);

  highp vec3 direction = reflect(eyeToSurfaceDir, normal);
  direction = vec3(-direction.x,direction.y,-direction.z);

  highp vec4 env = textureCube(uCubeSampler, -direction);
  highp vec4 baseColor = texture2D(uSampler, vTextureCoord);

  gl_FragColor = env * 0.4 + baseColor * 0.6 ;
}