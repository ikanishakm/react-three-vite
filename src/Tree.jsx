import React, { useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import Leaves from "./leaves";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import Ground from "./ground";

export default function Tree(props) {
  const textureMap = useTexture("/bsc.jpg");
  const textureNormal = useTexture("/bnormal.jpg");
  const rockMap = useTexture("/rb.jpg");
  const rockNormal = useTexture("/rbNormal.jpg");

  const { nodes, materials } = useGLTF("/11.glb");
  return (
    <group {...props} dispose={null} position={[0, -1.25, 0]} scale={0.5}>
      <Leaves nodes={nodes} materials={materials} />
      <mesh castShadow receiveShadow geometry={nodes.Tree_2.geometry}>
        <meshPhysicalMaterial normalMap={textureNormal} map={textureMap} bumpMap={textureNormal} color={"lightbrown"} metalness={0.5} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Rocks.geometry}
        material={materials.Rock}
        position={[-1.1, -0.05, 1.43]}
        rotation={[2.28, 0.53, 1.64]}
        scale={0.2}
      >
        <meshStandardMaterial map={rockMap} normalMap={rockNormal} />
      </mesh>
      <Physics gravity={[0.15, -0.25, 0]}>
        <Ground />
        <RigidBody colliders='hull' type={"fixed"} scale={1}>
          <mesh castShadow receiveShadow geometry={nodes.Ground.geometry} material={materials.Ground} />
        </RigidBody>
      </Physics>
    </group>
  );
}
useGLTF.preload("/11.glb");
