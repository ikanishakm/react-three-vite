import React, { useLayoutEffect, useRef } from "react";
import { vertex } from "../shaders/vertex";
import { fragment } from "../shaders/fragment";
import { useFrame } from "@react-three/fiber";
import { Model } from "./leaf";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import curlNoise from "../shaders/curlNoise";
import { fbm } from "../shaders/fbm";

function Leaves({ nodes, materials }) {
  const ref = useRef();
  const leaf = useGLTF("/leaf.glb");
  const dummy = new THREE.Object3D();
  const vals = nodes?.Tree_1?.geometry?.attributes?.position?.array;
  const count = 180000;

  useLayoutEffect(() => {
    if (vals?.length > 1) {
      console.log(vals[1]);
      for (let i = 0; i < count; i += 3) {
        const x = vals[i * 30];
        const y = vals[i * 30 + 1];
        const z = vals[i * 30 + 2];
        dummy?.position?.set(x, y, z);
        dummy?.scale?.set(0.08, 0.08, 0.08);
        dummy?.rotation.set(Math.random(), Math.random(), Math.random());
        dummy?.updateMatrix();
        ref?.current?.setMatrixAt(i / 3, dummy.matrix);
        ref.current.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        ref.current.instanceMatrix.needsUpdate = true;
      }
    }
  }, []);

  useFrame((state, delta) => {
    if (ref.current?.material?.userData?.shader) {
      ref.current.material.userData.shader.uniforms.uTime.value += delta;
    }
  });

  return (
    <>
      <group dispose={null}>
        <instancedMesh ref={ref} args={[null, null, count / 3]} position={[0, 0.28, 0]} geometry={leaf.nodes.Plane.geometry}>
          <meshPhysicalMaterial
            side={THREE.DoubleSide}
            color={"hotpink"}
            metalness={0.5}
            onBeforeCompile={shader => {
              ref.current.material.userData.shader = shader;
              shader.uniforms.uTime = { value: 0 };
              shader.vertexShader = shader.vertexShader.replace(
                "#include <common>",
                `#include <common>
                ${curlNoise}
                ${fbm}
                uniform float uTime; `
              );
              shader.vertexShader = shader.vertexShader.replace(
                "#include <project_vertex>",
                /*glsl*/ `
              vec4 mvPosition = vec4( transformed, 1.0 );
              
              #ifdef USE_INSTANCING
                
             float curlNoise = 2.*cnoise(vec3(uv.x ,uv.y ,0.) + 2.*vec3(abs(sin(0.25*uTime) + 0.125*abs(cos(0.75*uTime))))); 
             mat4 im = 20.*mat4(1.,1.5*curlNoise,1.5*curlNoise,0.,0.,1.,0.,0.,0.,0.,1.,0.,0.,0.,0.,1.);
             im = instanceMatrix*im;
             mvPosition =  im*mvPosition+ instanceMatrix * mvPosition;
              
              #endif
              mvPosition = modelViewMatrix * mvPosition;
              gl_Position = projectionMatrix * mvPosition;
                `
              );
              console.log(shader);
            }}
          />
        </instancedMesh>
      </group>
    </>
  );
}

export default Leaves;

useGLTF.preload("/leaf.glb");
