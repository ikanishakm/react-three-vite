import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export function Model(props) {
  const ref = useRef();
  const { nodes, materials } = useGLTF("/leaf.glb");
  const { nodes1, materials1 } = useGLTF("/11.glb");

  const dummy = new THREE.Object3D();
  const vals = nodes1?.Tree_1?.geometry?.attributes?.position?.array;

  useLayoutEffect(() => {
    console.log(vals);
    for (let i = 0; i < 3000; i += 3) {
      const x = vals[i * 10];
      const y = vals[i * 10 + 1];
      const z = vals[i * 10 + 2];
      dummy?.position?.set(x, y + 0.1 * 0.05, z);
      dummy?.updateMatrix();
      ref?.current?.setMatrixAt(i / 3, dummy.matrix);
    }
  }, [vals]);
  return (
    <group {...props} scale={0.125} position={[0, 3, 0]} rotation={[100, 150, 234]}>
      <instancedMesh ref={ref} args={[null, null, 1000]}>
        <mesh castShadow receiveShadow geometry={nodes?.Plane?.geometry}>
          <meshPhysicalMaterial side={THREE.DoubleSide} />
        </mesh>
      </instancedMesh>
    </group>
  );
}

useGLTF.preload("/leaf.glb");
useGLTF.preload("/11.glb");
