var fineMedal;(()=>{"use strict";var e={d:(r,n)=>{for(var t in n)e.o(n,t)&&!e.o(r,t)&&Object.defineProperty(r,t,{enumerable:!0,get:n[t]})},o:(e,r)=>Object.prototype.hasOwnProperty.call(e,r),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},r={};e.r(r),e.d(r,{getPreviews:()=>K,init:()=>$});var n="undefined"!=typeof Float32Array?Float32Array:Array;function t(){var e=new n(16);return n!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0),e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}Math.random,Math.PI,Math.hypot||(Math.hypot=function(){for(var e=0,r=arguments.length;r--;)e+=arguments[r]*arguments[r];return Math.sqrt(e)});var o=function(e,r,n,t,o){var a,i=1/Math.tan(r/2);return e[0]=i/n,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=i,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,null!=o&&o!==1/0?(a=1/(t-o),e[10]=(o+t)*a,e[14]=2*o*t*a):(e[10]=-1,e[14]=-2*t),e};function a(e,r){var n=r[0],t=r[1],o=r[2],a=r[3],i=r[4],c=r[5],u=r[6],l=r[7],s=r[8],m=r[9],f=r[10],v=r[11],d=r[12],h=r[13],g=r[14],x=r[15],p=n*c-t*i,M=n*u-o*i,_=n*l-a*i,y=t*u-o*c,w=t*l-a*c,P=o*l-a*u,b=s*h-m*d,T=s*g-f*d,E=s*x-v*d,N=m*g-f*h,C=m*x-v*h,R=f*x-v*g,A=p*R-M*C+_*N+y*E-w*T+P*b;return A?(A=1/A,e[0]=(c*R-u*C+l*N)*A,e[1]=(u*E-i*R-l*T)*A,e[2]=(i*C-c*E+l*b)*A,e[3]=(o*C-t*R-a*N)*A,e[4]=(n*R-o*E+a*T)*A,e[5]=(t*E-n*C-a*b)*A,e[6]=(h*P-g*w+x*y)*A,e[7]=(g*_-d*P-x*M)*A,e[8]=(d*w-h*_+x*p)*A,e):null}function i(e,r,n){const t=e.createShader(r);return e.shaderSource(t,n),e.compileShader(t),e.getShaderParameter(t,e.COMPILE_STATUS)?t:(alert("An error occurred compiling the shaders: "+e.getShaderInfoLog(t)),e.deleteShader(t),null)}function c(e,r,n){const t=i(e,e.VERTEX_SHADER,r),o=i(e,e.FRAGMENT_SHADER,n),a=e.createProgram();return e.attachShader(a,t),e.attachShader(a,o),e.linkProgram(a),e.getProgramParameter(a,e.LINK_STATUS)?a:(alert("Unable to initialize the shader program: "+e.getProgramInfoLog(a)),null)}function u(e,r,n,t,o=""){n=n.split(" "),t=t.split(" "),o=o.split(" ");const a={program:r,attribLocations:{},uniformLocations:{},uniformLocations_ext:{}};return n.forEach((n=>a.attribLocations[n]=e.getAttribLocation(r,n))),t.forEach((n=>a.uniformLocations[n]=e.getUniformLocation(r,n))),o.forEach((n=>a.uniformLocations_ext[n]=e.getUniformLocation(r,n))),a}function l(e,r){r.vertexBuffer=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,r.vertexBuffer),e.bufferData(e.ARRAY_BUFFER,r.vertex,e.STATIC_DRAW),r.normalBuffer=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,r.normalBuffer),e.bufferData(e.ARRAY_BUFFER,r.normal,e.STATIC_DRAW),r.indexBuffer=e.createBuffer(),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,r.indexBuffer),e.bufferData(e.ELEMENT_ARRAY_BUFFER,r.indices,e.STATIC_DRAW)}function s(e){const r=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);return[e[0]/r,e[1]/r,e[2]/r]}function m(e,r,n=0){const t=[];for(let o=0;o<e;o++){const a=2*Math.PI*o/e,i=r*Math.cos(a),c=r*Math.sin(a);t.push([i,c,n])}return t}function f(e,r,n=0){const t=m(e,r,n),o=e+1,a=new Float32Array(3*o),i=new Float32Array(3*o);let c=0,u=[0,0,1];t.forEach((e=>{a.set(e,c),i.set(u,c),c+=3})),a.set([0,0,n],c),i.set(u,c);const l=[],s=o-1;for(let r=0;r<e;r++)l.push(r,(r+1)%e,s);return{vertex:a,normal:i,indices:new Uint16Array(l)}}const v={seg_cirle:64,seg_edge:32,radius:1,edge_count:Math.floor(128/3),radius_inner:.93,radius_edge:1-.93};const d="varying highp vec3 vColor;\nvarying highp vec3 vTransformedNormal;\nvarying highp vec3 vPosition;\nvoid main(void) {\n    highp vec3 specularColor = vec3(1.0, 1.0, 1.0);\n    highp float shininess = 32.0;\n          \n    //gl_FragColor = texture2D(uSampler, vTextureCoord)\n    highp vec3 lightDir = normalize(vPosition - vec3(3, 0, 4));\n    highp vec3 viewDir = normalize(vec3(0.0, -0.0, -1));\n    highp vec3 reflectDir = reflect(-lightDir, vTransformedNormal);\n    highp float specular = pow(max(dot(viewDir, reflectDir), 0.0), shininess);\n    specularColor = specular * specularColor;\n\n    gl_FragColor = vec4(vColor + specularColor, 1.0);\n    //gl_FragColor = vec4(vColor, 1.0); //for debug\n   \n}",h="attribute vec3 aVertexPosition;\nattribute vec3 aVertexNormal;\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform mat3 uNormalMatrix;\nuniform highp vec3 uBaseColor;\nvarying highp vec3 vColor;\nvarying highp vec3 vTransformedNormal;\nvarying highp vec3 vPosition;\n\nvoid main(void) {\n    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);\n    vPosition = (uModelViewMatrix * vec4(aVertexPosition, 1.0)).xyz;\n    vTransformedNormal = normalize(uNormalMatrix * aVertexNormal);\n    highp vec3 viewDir = vec3(0, 0, -1);\n    highp float amb = max(-dot(vTransformedNormal, viewDir), 0.0);\n    vColor = uBaseColor * (0.5 + 0.5 * amb);\n}",g="varying highp vec2 vTextureCoord;\nvarying highp vec3 vTransformedNormal;\nvarying highp vec3 vPosition;\nuniform sampler2D uSampler;\n\nvoid main(void) {\n    highp vec4 baseColor = texture2D(uSampler, vTextureCoord);\n\n    highp vec3 specularColor = vec3(1.0, 1.0, 1.0);\n    highp float shininess = 32.0;\n          \n    highp vec3 lightDir = normalize(vPosition - vec3(3, 0, 4));\n    highp vec3 viewDir = normalize(vec3(0.0, -0.0, -1));\n    highp vec3 reflectDir = reflect(-lightDir, vTransformedNormal);\n    highp float specular = pow(max(dot(viewDir, reflectDir), 0.0), shininess);\n    specularColor = specular * specularColor;\n    gl_FragColor = baseColor + vec4(specularColor, 1.0);\n\n}\n",x="attribute vec3 aVertexPosition;\nattribute vec3 aVertexNormal;\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform mat3 uNormalMatrix;\nuniform highp float uInverseRadius;\nvarying highp vec3 vTransformedNormal;\nvarying highp vec2 vTextureCoord;\nvarying highp vec3 vPosition;\n\nvoid main(void) {\n    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);\n    vPosition = (uModelViewMatrix * vec4(aVertexPosition, 1.0)).xyz;\n    vTransformedNormal = normalize(uNormalMatrix * aVertexNormal);\n    float x = aVertexPosition.x * uInverseRadius;\n    float y = aVertexPosition.y * uInverseRadius;\n    vTextureCoord = vec2(\n        x * 0.5 + 0.5,\n        y * 0.5 + 0.5\n    );\n}",p="varying highp vec3 vColor;\nvoid main(void) {\n    gl_FragColor = vec4(vColor, 1.0);\n}",M="attribute vec3 aVertexPosition;\nattribute vec3 aVertexNormal;\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform mat3 uNormalMatrix;\nuniform highp vec3 uBaseColor;\nvarying highp vec3 vColor;\n\nvoid main(void) {\n    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);\n\n    highp vec3 transformedNormal = normalize(uNormalMatrix * aVertexNormal);\n    highp vec3 viewDir = vec3(0, 0, -1);\n    highp float amb = max(-dot(transformedNormal, viewDir), 0.0);\n    vColor = uBaseColor * (0.5 + 0.5 * amb);\n}",_="varying highp vec2 vTextureCoord;\nvarying highp float amb;\nuniform sampler2D uSampler;\n\nvoid main(void) {\n    highp vec4 baseColor = texture2D(uSampler, vTextureCoord);\n    gl_FragColor = baseColor * (0.5 + 0.5 * amb);\n}\n",y="attribute vec3 aVertexPosition;\nattribute vec3 aVertexNormal;\nuniform mat4 uModelViewMatrix;\nuniform mat4 uProjectionMatrix;\nuniform mat3 uNormalMatrix;\nuniform highp float uInverseRadius;\n\nvarying highp vec2 vTextureCoord;\nvarying highp float amb;\n\nvoid main(void) {\n    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);\n    highp vec3 transformedNormal = normalize(uNormalMatrix * aVertexNormal);\n    \n    highp vec3 viewDir = vec3(0, 0, -1);\n    amb = max(-dot(transformedNormal, viewDir), 0.0);\n    \n    float x = aVertexPosition.x * uInverseRadius;\n    float y = aVertexPosition.y * uInverseRadius;\n    vTextureCoord = vec2(\n        x * 0.5 + 0.5,\n        y * 0.5 + 0.5\n    );\n}";function w(e,r){const n=e.getBoundingClientRect();return{x:r.clientX-n.left,y:r.clientY-n.top,w:n.width,h:n.height}}let P=null;function b(e,r,n,t,o){if(P)return;P=e,e.className="fine-medal_hide";const a=e.getBoundingClientRect(),i=window.innerWidth,c=(window.innerHeight,a.left+a.width/2);a.top,a.height,r.className="fine-medal_show_trans";const u=`\n    ${n}.fine-medal_show_trans {\n        opacity: 0;\n        transform: translate(-50%, 0) scale(0);\n        top: 40px;\n        left: ${c}px;\n     }\n  \n    ${n}.fine-medal_show {\n        opacity: 1;\n        transform: translate(-50%, 0) scale(1);\n        top: 10px;\n        left: ${i/2}px;\n    }`;t.innerHTML=u,requestAnimationFrame((()=>{r.className="fine-medal_show",o()}))}const T=[-0,0,-2.7],E=t(),N=.1,C=100,R=2*Math.PI,A=5*Math.PI/180,L=.9,V=1e-4,I=2e-5;let B=0,F=0;function S(e,r){const{x:n,y:t,w:o,h:a}=e;let i=n-o/2,c=t-a/2;if(i*i+c*c>o*o/4*.9)return;r<500&&(r=30);let u=i*Math.min(r,800)*.001*.001;F+=u}let D,U,j,Y,q,z,O,H=!1;function G(e,r,o=!0,i=0){H=o;let c=0;B=0,F=0,requestAnimationFrame((function o(u){let l=u-c;switch(l>100&&(l=1e3/30),c=u,i){case 0:break;case 1:B+=9e-4*l;break;case 2:!function(e){B+=e*F,B>R&&(B-=R),B<0&&(B+=R),B<Math.PI?B<A?(F*=L,F+=(Math.random()-.5)*V):F-=I*(B-A)*e:R-B<A?(F*=L,F+=(Math.random()-.5)*V):F+=I*(R-B-A)*e}(l)}const s=t();var m,f,v,d,h,g,x,p,M,_,y,w,P,b,N,C,S,D;m=s,f=s,C=(v=T)[0],S=v[1],D=v[2],f===m?(m[12]=f[0]*C+f[4]*S+f[8]*D+f[12],m[13]=f[1]*C+f[5]*S+f[9]*D+f[13],m[14]=f[2]*C+f[6]*S+f[10]*D+f[14],m[15]=f[3]*C+f[7]*S+f[11]*D+f[15]):(d=f[0],h=f[1],g=f[2],x=f[3],p=f[4],M=f[5],_=f[6],y=f[7],w=f[8],P=f[9],b=f[10],N=f[11],m[0]=d,m[1]=h,m[2]=g,m[3]=x,m[4]=p,m[5]=M,m[6]=_,m[7]=y,m[8]=w,m[9]=P,m[10]=b,m[11]=N,m[12]=d*C+p*S+w*D+f[12],m[13]=h*C+M*S+P*D+f[13],m[14]=g*C+_*S+b*D+f[14],m[15]=x*C+y*S+N*D+f[15]),function(e,r,n){var t=Math.sin(n),o=Math.cos(n),a=r[0],i=r[1],c=r[2],u=r[3],l=r[8],s=r[9],m=r[10],f=r[11];r!==e&&(e[4]=r[4],e[5]=r[5],e[6]=r[6],e[7]=r[7],e[12]=r[12],e[13]=r[13],e[14]=r[14],e[15]=r[15]),e[0]=a*o-l*t,e[1]=i*o-s*t,e[2]=c*o-m*t,e[3]=u*o-f*t,e[8]=a*t+l*o,e[9]=i*t+s*o,e[10]=c*t+m*o,e[11]=u*t+f*o}(s,s,B),r.view=s,function(e,r,t,o){e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT);for(const o of t)for(const t of o.parts){e.useProgram(t.programInfo.program),e.bindBuffer(e.ARRAY_BUFFER,t.geomertry.vertexBuffer),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.geomertry.indexBuffer),e.enableVertexAttribArray(t.programInfo.attribLocations.aVertexPosition),e.vertexAttribPointer(t.programInfo.attribLocations.aVertexPosition,3,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,t.geomertry.normalBuffer),e.enableVertexAttribArray(t.programInfo.attribLocations.aVertexNormal),e.vertexAttribPointer(t.programInfo.attribLocations.aVertexNormal,3,e.FLOAT,!1,0,0),e.uniformMatrix4fv(t.programInfo.uniformLocations.uProjectionMatrix,!1,r),e.uniformMatrix4fv(t.programInfo.uniformLocations.uModelViewMatrix,!1,o.view);const c=(i=void 0,i=new n(9),n!=Float32Array&&(i[1]=0,i[2]=0,i[3]=0,i[5]=0,i[6]=0,i[7]=0),i[0]=1,i[4]=1,i[8]=1,i);a(c,o.view),e.uniformMatrix3fv(t.programInfo.uniformLocations.uNormalMatrix,!1,c);for(const r in t.programInfo.uniformLocations_ext){const n=t.programInfo.uniformLocations_ext[r],o=t[r];e[o.func](n,o.v)}void 0!==t.programInfo.uniformLocations.uSampler&&(e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.texture),e.uniform1i(t.programInfo.uniformLocations.uSampler,0));const u=t.geomertry.indices.length,l=0;e.drawElements(e.TRIANGLES,u,e.UNSIGNED_SHORT,l)}var i}(e,E,[r]),H&&requestAnimationFrame(o)}))}const W={},X={};let k;async function $(e){if(O=e,D=document.querySelector(O.dialog_selector),U=document.querySelector(O.canvas_selector),j=document.querySelector(O.style_selector),Y=document.querySelector(O.name_selector),q=document.querySelector(O.desc_selector),z=function(e){const r=e.getContext("webgl2");return r?(r.clearColor(0,0,0,0),r.clearDepth(1),r.enable(r.DEPTH_TEST),r.depthFunc(r.LEQUAL),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!0),r):(alert("Unable to initialize WebGL. Your browser may not support it."),null)}(U),!z)return;const r=c(z,h,d),n=u(z,r,"aVertexPosition aVertexNormal","uModelViewMatrix uProjectionMatrix uNormalMatrix","uBaseColor"),a=c(z,x,g),i=u(z,a,"aVertexPosition aVertexNormal","uSampler uModelViewMatrix uProjectionMatrix uNormalMatrix","uInverseRadius"),b=c(z,M,p),T=u(z,b,"aVertexPosition aVertexNormal","uModelViewMatrix uProjectionMatrix uNormalMatrix","uBaseColor"),R=c(z,y,_),A=u(z,R,"aVertexPosition aVertexNormal","uSampler uModelViewMatrix uProjectionMatrix uNormalMatrix","uInverseRadius"),L=function(){const{seg_cirle:e,seg_edge:r,radius:n,edge_count:t,radius_inner:o,radius_edge:a}=v,i=[];for(let n=0;n<=t;n++){const t=Math.PI*n/r,c=-a*Math.cos(t),u=a*Math.sin(t);i.push(m(e,o+u,c))}const c=i.length*e+1,u=new Float32Array(3*c),l=new Float32Array(3*c);let f=0;i.forEach((e=>{e.forEach((e=>{u.set(e,f);const r=function(e,r){const n=e[0],t=e[1],o=e[2],a=s([n,t,0]).map((e=>e*r));return s([n-a[0],t-a[1],o-a[2]])}(e,o);l.set(r,f),f+=3}))})),u.set([0,0,-a],f),l.set([0,0,-1],f);const d=[];for(let r=0;r<i.length-1;r++){const n=r*e;for(let r=0;r<e;r++)d.push(n+r,n+(r+1)%e,n+r+e),d.push(n+(r+1)%e,n+(r+1)%e+e,n+r+e)}const h=c-1;for(let r=0;r<e;r++)d.push((r+1)%e,r,h);return{vertex:u,normal:l,indices:new Uint16Array(d)}}(),V=function(){const{seg_cirle:e,seg_edge:r,radius:n,edge_count:t,radius_inner:o,radius_edge:a}=v,i=Math.PI*t/r,c=-a*Math.cos(i);return f(e,o+a*Math.sin(i),c)}(),I=f(64,1,0),B=f(64,.94,1e-4);l(z,L),l(z,V),l(z,I),l(z,B),k=async function(e){let r,o;switch(e.texture&&(r=await async function(e){const r=W[e];if(r)return r;const n=await async function(e){return new Promise(((r,n)=>{let t=new Image;t.onload=()=>r(t),t.onerror=n,t.src=e}))}(O.texturePath+e+O.textureExt),t=z.createTexture();z.bindTexture(z.TEXTURE_2D,t);const o=z.RGB,a=z.RGB,i=z.UNSIGNED_BYTE;return z.texImage2D(z.TEXTURE_2D,0,o,a,i,n),z.generateMipmap(z.TEXTURE_2D),z.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,!0),W[e]=t,t}(e.texture)),e.type){case"basic":o=function(e,r){return{view:t(),parts:[{programInfo:n,geomertry:L,uBaseColor:{func:"uniform3fv",v:r}},{programInfo:i,geomertry:V,texture:e,uInverseRadius:{func:"uniform1f",v:1/V.vertex[0]}}]}}(r,e.baseColor);break;case"min":o=function(e,r){return{view:t(),parts:[{programInfo:T,geomertry:I,uBaseColor:{func:"uniform3fv",v:r}},{programInfo:A,geomertry:B,texture:e,uInverseRadius:{func:"uniform1f",v:1/B.vertex[0]}}]}}(r,e.baseColor)}return o.name=e.name,o.desc=e.desc,o},function(e,r){!function(e,r){let n=0,t=null,o=!1,a=!1;function i(){const e=performance.now();a&&(r(t,e-n),a=!1)}e.addEventListener("mousedown",(function(e){o||(n=performance.now(),a=!0)})),e.addEventListener("touchstart",(function(r){o=!0,t=w(e,r.touches[0]),n=performance.now(),a=!0})),e.addEventListener("mouseup",(function(r){o||(t=w(e,r),i())})),e.addEventListener("touchend",(function(e){i(),o=!1})),e.addEventListener("mouseout",(function(e){a=!1})),e.addEventListener("touchcancel",(function(e){a=!1,o=!1})),e.addEventListener("focusout",(function(e){a=!1,o=!1}))}(e,S);const n=45*Math.PI/180,t=r.canvas.clientWidth/r.canvas.clientHeight;o(E,n,t,N,C)}(U,z),D.className="fine-medal_idle",D.querySelector("button").onclick=()=>function(e){e.className="fine-medal_show_trans",P.className="",P=null,H=!1,setTimeout((()=>{e.className="fine-medal_idle"}),500)}(D)}async function K(e,r){D.className="fine-medal_init",await J();const n=document.querySelector(e);n.innerHTML="";const t=await Promise.all(r.map((async e=>{let r=X[e];return r||(X[e]=await k(O.medals[e]),r=X[e],r.id=e),r})));for(const e of t){let r=e.preview;r||(G(z,e,!1,0),await J(),e.preview=await Q(U),r=e.preview);const t=document.createElement("div");t.setAttribute("data-id",e.id),t.title=e.name;let o=new Image;o.src=r,t.appendChild(o),t.addEventListener("click",(()=>{b(t,D,O.dialog_selector,j,(()=>{G(z,e,!0,2),Y.innerHTML=e.name,q.innerHTML=e.desc}))})),n.appendChild(t)}D.className="fine-medal_idle"}async function Q(e){return new Promise(((r,n)=>{e.toBlob((e=>{if(e){const n=URL.createObjectURL(e);r(n)}else n(new Error("Canvas toBlob failed."))}))}))}async function J(){return new Promise((e=>{requestAnimationFrame(e)}))}fineMedal=r})();