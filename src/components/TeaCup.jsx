import { useMemo, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ceramic = (color, opts = {}) =>
  new THREE.MeshStandardMaterial({
    color,
    metalness: 0.05,
    roughness: 0.35,
    ...opts,
  });

export default function TeaCup({ partsRef, onReady }) {
  const group = useRef();
  const cup = useRef();
  const liquid = useRef();
  const handle = useRef();

  const materials = useMemo(
    () => ({
      cup: ceramic("#f3ece0", { roughness: 0.4 }),
      cupInner: ceramic("#e4d9c6", { roughness: 0.5 }),
      saucer: ceramic("#f3ece0", { roughness: 0.4 }),
      gold: new THREE.MeshStandardMaterial({
        color: "#d8b46a",
        metalness: 0.85,
        roughness: 0.28,
      }),
      liquid: new THREE.MeshStandardMaterial({
        color: "#c97c3d",
        metalness: 0.15,
        roughness: 0.25,
        emissive: "#c97c3d",
        emissiveIntensity: 0.12,
      }),
    }),
    []
  );

  useEffect(() => {
    if (!partsRef) return;
    partsRef.current = {
      group: group.current,
      cup: cup.current,
      liquid: liquid.current,
      handle: handle.current,
      materials,
    };
    if (onReady) onReady();
  }, [partsRef, materials, onReady]);

  return (
    <group ref={group}>
      {/* Saucer */}
      <mesh position={[0, -0.42, 0]} material={materials.saucer} receiveShadow>
        <cylinderGeometry args={[0.85, 0.85, 0.05, 40]} />
      </mesh>
      {/* Gold rim on the saucer's edge */}
      <mesh position={[0, -0.395, 0]} material={materials.gold} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.012, 8, 56]} />
      </mesh>

      {/* Cup body */}
      <group ref={cup}>
        <mesh position={[0, -0.14, 0]} material={materials.cup} castShadow receiveShadow>
          <cylinderGeometry args={[0.44, 0.32, 0.56, 40, 1, true]} />
        </mesh>
        {/* interior wall, slightly recessed, gives the cup visible depth */}
        <mesh position={[0, -0.1, 0]} material={materials.cupInner}>
          <cylinderGeometry args={[0.4, 0.3, 0.5, 40, 1, true]} />
        </mesh>
        {/* base disc so the cup doesn't read as hollow from the side */}
        <mesh position={[0, -0.41, 0]} material={materials.cup}>
          <cylinderGeometry args={[0.32, 0.32, 0.02, 40]} />
        </mesh>
        {/* Gold rim trim at the lip — the one signature "premium" detail */}
        <mesh position={[0, 0.14, 0]} material={materials.gold} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.435, 0.01, 8, 48]} />
        </mesh>

        {/* Liquid surface — colour driven by the scroll timeline */}
        <mesh ref={liquid} position={[0, 0.1, 0]} material={materials.liquid}>
          <cylinderGeometry args={[0.39, 0.39, 0.03, 40]} />
        </mesh>

        {/* Handle */}
        <group ref={handle} position={[0.46, -0.14, 0]} rotation={[0, 0, 0]}>
          <mesh material={materials.cup} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.16, 0.045, 12, 28, Math.PI * 1.3]} />
          </mesh>
        </group>
      </group>

      <Steam />
    </group>
  );
}


function Steam() {
  const wisps = useRef([]);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#f3ece0",
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    []
  );

  const count = 5;
  const offsets = useMemo(
    () => Array.from({ length: count }, (_, i) => (i / count) * Math.PI * 2),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    wisps.current.forEach((m, i) => {
      if (!m) return;
      const speed = 0.5 + i * 0.05;
      const phase = (t * speed + offsets[i]) % (Math.PI * 2);
      const rise = phase / (Math.PI * 2);
      m.position.y = 0.16 + rise * 0.85;
      m.position.x = Math.sin(t * 0.8 + i * 2) * 0.08 * rise;
      m.scale.setScalar(0.14 + rise * 0.22);
      m.material.opacity = Math.sin(rise * Math.PI) * 0.22;
    });
  });

  return (
    <group>
      {offsets.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (wisps.current[i] = el)}
          material={material.clone()}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[1, 16]} />
        </mesh>
      ))}
    </group>
  );
}