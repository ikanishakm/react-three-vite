import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box, Environment, OrbitControls, Sparkles, Stars } from "@react-three/drei";
import { EffectComposer, N8AO, TiltShift2 } from "@react-three/postprocessing";
import { useControls } from "leva";
import Tree from "./Tree";

const Scene = () => {
  const boxRef = useRef();
  const { radius, dist, intensity, aoSamples, denoiseRadius, denoiseSamples } = useControls({
    radius: { value: 10, min: 0, max: 50, step: 1 },
    aoSamples: { value: 16, min: 0, max: 50, step: 1 },
    dist: { value: 1.5, min: 0, max: 20, step: 0.05 },
    intensity: { value: 5, min: 0, max: 50, step: 1 },
    denoiseRadius: { value: 12, min: 0, max: 50, step: 1 },
    denoiseSamples: { value: 8, min: 0, max: 50, step: 1 },
  });
  return (
    <>
      <EffectComposer multisampling={8}>
        <N8AO
          aoRadius={radius}
          distanceFalloff={dist}
          intensity={intensity}
          screenSpaceRadius
          quality='medium'
          aoSamples={aoSamples}
          denoiseRadius={denoiseRadius}
          denoiseSamples={denoiseSamples}
          renderMode={0}
          color={"lightpink"}
        />
      </EffectComposer>
      <Tree />
    </>
  );
};

const App = () => {
  return (
    <Canvas camera={{ fov: 70, position: [0, 0, 3] }}>
      <OrbitControls />
      <Environment preset='sunset' />
      <Sparkles position={[0, -0.5, 0]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <directionalLight intensity={0.25} position={[1, 1, 1]} />
      <Scene />
    </Canvas>
  );
};

export default App;
