import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";

// Custom shader
const WaveShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color("#0db8ef"),
  },
  // vertex shader
  glsl`
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 pos = position;
      float wave = sin(pos.x * 4.0 + uTime) * 0.1;
      wave += sin(pos.y * 6.0 + uTime * 1.5) * 0.1;
      pos.z += wave;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // fragment shader
  glsl`
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      float alpha = 1.0 - vUv.y * 0.8;
      gl_FragColor = vec4(uColor, alpha);
    }
  `
);

extend({ WaveShaderMaterial });

const Waves = () => {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.uTime = clock.getElapsedTime();
  });

  return (
    <mesh rotation-x={-Math.PI / 2}>
      <planeGeometry args={[20, 20, 128, 128]} />
      <waveShaderMaterial ref={ref} side={THREE.DoubleSide} />
    </mesh>
  );
};

const HeroBackground = () => {
  return (
    <Canvas
      camera={{ position: [0, 2, 3], fov: 75 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 3,
        width: "100%",
        height: "100vh",
      }}
    >
      <ambientLight intensity={1.2} />
      <Waves />
    </Canvas>
  );
};

export default HeroBackground;
