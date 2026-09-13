import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

/* A simple almond/leaf silhouette, built once and reused for every leaf
   and petal mesh (tea leaves and chamomile petals are the same shape,
   just recoloured and rearranged). */
const leafShape = new THREE.Shape();
leafShape.moveTo(0, 0);
leafShape.quadraticCurveTo(0.035, 0.05, 0.11, 0);
leafShape.quadraticCurveTo(0.035, -0.05, 0, 0);
const leafGeometry = new THREE.ShapeGeometry(leafShape);

const ceramicGold = () =>
  new THREE.MeshStandardMaterial({
    color: "#d8b46a",
    metalness: 0.75,
    roughness: 0.3,
  });

/**
 * The plate the cup and saucer sit on. Scale is driven by the scroll
 * timeline as an entrance flourish right at the top of the page.
 */
export function Plate({ partsRef }) {
  const ref = useRef();
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#eee4d2",
        roughness: 0.45,
        transparent: true,
        opacity: 1,
      }),
    []
  );

  useEffect(() => {
    if (partsRef) partsRef.current = { group: ref.current, material };
  }, [partsRef, material]);

  return (
    <mesh ref={ref} position={[0, -0.47, 0]} material={material} receiveShadow>
      <cylinderGeometry args={[1.35, 1.35, 0.035, 56]} />
    </mesh>
  );
}

export function SpiceCluster({ partsRef }) {
  const group = useRef();
  const materials = useMemo(
    () => ({
      cinnamon: new THREE.MeshStandardMaterial({ color: "#9a6a3c", roughness: 0.7 }),
      anise: new THREE.MeshStandardMaterial({ color: "#5a3a24", roughness: 0.6 }),
      cardamom: new THREE.MeshStandardMaterial({ color: "#cdd9a3", roughness: 0.55 }),
      clove: new THREE.MeshStandardMaterial({ color: "#3b2a20", roughness: 0.5 }),
    }),
    []
  );

  useEffect(() => {
    if (partsRef) partsRef.current = { group: group.current, materials };
  }, [partsRef, materials]);

  return (
    <group ref={group} position={[0.72, -0.43, 0.22]} scale={0}>
      {/* cinnamon stick */}
      <mesh material={materials.cinnamon} rotation={[Math.PI / 2, 0, 0.5]} position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.018, 0.022, 0.26, 10]} />
      </mesh>
      {/* star anise, two flattened hexagonal discs */}
      <mesh material={materials.anise} position={[0.16, 0.012, 0.08]} rotation={[Math.PI / 2, 0, 0.3]}>
        <cylinderGeometry args={[0.06, 0.06, 0.018, 6]} />
      </mesh>
      <mesh material={materials.anise} position={[-0.1, 0.012, 0.18]} rotation={[Math.PI / 2, 0, 1.1]}>
        <cylinderGeometry args={[0.05, 0.05, 0.016, 6]} />
      </mesh>
      {/* cardamom pods */}
      <mesh material={materials.cardamom} position={[0.05, 0.03, -0.1]} scale={[1, 1, 1.7]}>
        <sphereGeometry args={[0.032, 10, 8]} />
      </mesh>
      <mesh material={materials.cardamom} position={[-0.06, 0.03, -0.04]} scale={[1, 1, 1.6]} rotation={[0, 0, 0.4]}>
        <sphereGeometry args={[0.03, 10, 8]} />
      </mesh>
      {/* cloves */}
      {[[0.1, -0.07], [0.02, -0.13], [-0.13, -0.08]].map(([x, z], i) => (
        <mesh key={i} material={materials.clove} position={[x, 0.02, z]} rotation={[Math.PI, 0.3 * i, 0]}>
          <coneGeometry args={[0.012, 0.045, 7]} />
        </mesh>
      ))}
    </group>
  );
}

export function SugarCubes({ partsRef }) {
  const group = useRef();
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#faf5e8", roughness: 0.5 }),
    []
  );

  useEffect(() => {
    if (partsRef) partsRef.current = { group: group.current, material };
  }, [partsRef, material]);

  const cubes = [
    [0, 0, 0, 0.09],
    [0.075, 0, 0.03, 0.08],
    [0.02, 0.075, 0.06, 0.075],
  ];

  return (
    <group ref={group} position={[-0.78, -0.43, -0.18]} scale={0}>
      {cubes.map(([x, y, z, s], i) => (
        <mesh key={i} material={material} position={[x, y + s / 2, z]} rotation={[0, i * 0.6, 0]}>
          <boxGeometry args={[s, s, s]} />
        </mesh>
      ))}
    </group>
  );
}


export function ScatterLeaves({ partsRef, color, layout }) {
  const group = useRef();
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.55,
        side: THREE.DoubleSide,
        transparent: true,
      }),
    [color]
  );

  useEffect(() => {
    if (partsRef) partsRef.current = { group: group.current, material };
  }, [partsRef, material]);

  return (
    <group ref={group} scale={0}>
      {layout.map(([x, z, rot, scale], i) => (
        <mesh
          key={i}
          geometry={leafGeometry}
          material={material}
          position={[x, -0.44, z]}
          rotation={[-Math.PI / 2, 0, rot]}
          scale={scale}
        />
      ))}
    </group>
  );
}

export const teaLeafLayout = [
  [0.55, 0.5, 0.4, 1.1],
  [0.68, 0.32, 1.6, 0.9],
  [0.5, 0.66, -0.6, 1],
  [-0.6, 0.55, 2.1, 0.95],
  [-0.72, 0.38, 0.2, 1.05],
];

export const petalLayout = (() => {
  const petals = [];
  const n = 7;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    petals.push([Math.cos(a) * 0.62, 0.5 + Math.sin(a) * 0.62 * 0.4, a, 0.85]);
  }
  return petals;
})();

export { ceramicGold };