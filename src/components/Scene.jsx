import { Canvas } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import TeaCup from "./TeaCup";
import { teas } from "../content";

const labelPositions = teas.map((t, i) => {
  const angle = (i / teas.length) * Math.PI * 2;
  const r = 0.95;
  return [Math.cos(angle) * r, -0.05, Math.sin(angle) * r];
});

export default function Scene({ partsRef, labelsRef, sceneRootRef, cameraRef, controlsRef, onReady }) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.55, 3.1], fov: 32 }}
      onCreated={({ camera }) => {
        cameraRef.current = camera;
      }}
    >
      <color attach="background" args={["#12201a"]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[2.5, 3.5, 2]} intensity={1.5} color="#fff6e6" />
      <directionalLight position={[-3, -1, -2]} intensity={0.35} color="#7fae8a" />
      {/* manual fill lights stand in for an HDR map — no runtime CDN
          fetch that can fail and take the whole scene down with it */}
      <pointLight position={[-1.6, 1.2, 1.4]} intensity={0.45} color="#e8a33d" />

      <OrbitControls
        ref={controlsRef}
        enabled={false}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        target={[0, -0.05, 0]}
      />

      <group ref={sceneRootRef}>
        <TeaCup partsRef={partsRef} onReady={onReady} />

        {teas.map((t, i) => (
          <Html
            key={t.id}
            position={labelPositions[i]}
            center
            ref={(el) => labelsRef.current && (labelsRef.current[t.id] = el)}
            style={{ opacity: 0, transition: "opacity 0.4s" }}
          >
            <div className="tea-tag">
              <em>{t.name}</em> · {t.origin}
            </div>
          </Html>
        ))}
      </group>

      <ContactShadows position={[0, -0.46, 0]} opacity={0.45} scale={4} blur={2.2} far={1.4} />
    </Canvas>
  );
}
