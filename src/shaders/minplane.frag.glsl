varying highp vec2 vTextureCoord;
varying highp float amb;
uniform sampler2D uSampler;

void main(void) {
    highp vec4 baseColor = texture2D(uSampler, vTextureCoord);
    gl_FragColor = baseColor * (0.5 + 0.5 * amb);
}
