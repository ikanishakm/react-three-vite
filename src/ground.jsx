import React, { useMemo } from "react";
import * as THREE from "three";
import { RigidBody, CuboidCollider, InstancedRigidBodies } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";

const COUNT = 100;
function Ground() {
  const leaf = useGLTF("/leaf.glb");
  const instances = useMemo(() => {
    const instances = [];

    for (let i = 0; i < COUNT; i++) {
      instances.push({
        key: "instance_" + Math.random(),
        position: [(0.5 - Math.random()) * 60, 35 + 5 * Math.random(), (0.5 - Math.random()) * 20],
        rotation: [Math.random(), Math.random(), Math.random()],
      });
    }

    return instances;
  }, []);
  return (
    <>
      <InstancedRigidBodies colliderNodes={[<CuboidCollider args={[0.5, 0.5, 0.5]} />]} instances={instances} colliders='cuboid'>
        <instancedMesh
          scale={0.08}
          geometry={leaf.nodes.Plane.geometry}
          args={[undefined, undefined, COUNT]}
          count={COUNT}
          material={new THREE.MeshStandardMaterial({ color: "hotpink" })}
        />

        <meshStandardMaterial color={"hotpink"} />
      </InstancedRigidBodies>
      <CuboidCollider position={[0, -1, 0]} args={[20, 0.5, 20]} />
      {/* <RigidBody colliders='hull' position={[1, 2.5, 0]}>
        <mesh geometry={leaf.nodes.Plane.geometry} scale={0.16}>
          <meshStandardMaterial side={THREE.DoubleSide} color={"hotpink"} />
        </mesh>
      </RigidBody> */}
    </>
  );
}

export default Ground;
useGLTF.preload("/leaf.glb");
