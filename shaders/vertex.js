export const vertex = /*glsl*/ `
uniform float uTime; 
varying vec2 vUv;
void main() {
    vUv = uv;
    vec3 mvPosition =  vec3(position.x + 0.025*sin(uTime) ,position.y ,position.z +0.025*sin(uTime)) ;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(mvPosition, 1.0);
}
`;
