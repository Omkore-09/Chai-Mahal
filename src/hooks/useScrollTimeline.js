import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { teas } from "../content";

gsap.registerPlugin(ScrollTrigger);

export default function useScrollTimeline({
  refs,
  partsRef,
  cameraRef,
  controlsRef,
  labelsRef,
  pageRef,
  groupRef,
  ready,
}) {
  useEffect(() => {
    if (!ready) return;
    const parts = partsRef.current;
    if (!parts || !parts.group || !groupRef.current) return;

    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const scrub = prefersReduced ? false : 1;

      // One continuous turn across the whole page.
      if (pageRef.current) {
        gsap.to(groupRef.current.rotation, {
          y: Math.PI * 2.2,
          ease: "none",
          scrollTrigger: {
            trigger: pageRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub,
          },
        });
      }

      // Gentle camera dolly through the tour, pulling back for the atlas.
      if (cameraRef.current && refs.atlas.current) {
        gsap.to(cameraRef.current.position, {
          z: 2.7,
          y: 0.4,
          scrollTrigger: {
            trigger: pageRef.current,
            start: "top top",
            end: "60% top",
            scrub,
          },
        });
        gsap.to(cameraRef.current.position, {
          z: 3.6,
          y: 0.6,
          scrollTrigger: {
            trigger: refs.atlas.current,
            start: "top bottom",
            end: "top center",
            scrub,
          },
        });
      }

      // Each tea section re-tints the liquid to its own colour.
      teas.forEach((tea) => {
        const el = refs[tea.id] && refs[tea.id].current;
        if (!el || !parts.materials.liquid) return;
        const target = new THREE.Color(tea.color);
        gsap.to(parts.materials.liquid.color, {
          r: target.r,
          g: target.g,
          b: target.b,
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "center center",
            scrub,
          },
        });
        gsap.to(parts.materials.liquid.emissive, {
          r: target.r,
          g: target.g,
          b: target.b,
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "center center",
            scrub,
          },
        });
      });

      // Atlas finale — reveal all labels, re-enable drag-to-rotate.
      if (refs.atlas.current) {
        ScrollTrigger.create({
          trigger: refs.atlas.current,
          start: "top 55%",
          end: "bottom top",
          onEnter: () => setLabelsVisible(labelsRef, true),
          onLeaveBack: () => setLabelsVisible(labelsRef, false),
          onToggle: (self) => {
            if (controlsRef.current) controlsRef.current.enabled = self.isActive;
          },
        });
      }

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [ready]);
}

function setLabelsVisible(labelsRef, visible) {
  const labels = labelsRef.current;
  if (!labels) return;
  Object.values(labels).forEach((el) => {
    if (el) el.style.opacity = visible ? "1" : "0";
  });
}
