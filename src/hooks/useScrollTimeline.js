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
  plateRef,
  spicesRef,
  sugarRef,
  leavesRef,
  petalsRef,
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

      if (plateRef && plateRef.current && sugarRef && sugarRef.current && pageRef.current) {
        gsap.set(plateRef.current.group.scale, { x: 0, y: 0, z: 0 });
        gsap.set(sugarRef.current.group.scale, { x: 0, y: 0, z: 0 });
        ScrollTrigger.create({
          trigger: pageRef.current,
          start: "top top",
          end: "4% top",
          onEnter: () => {
            toggleGroup(plateRef.current.group, true);
            gsap.delayedCall(0.25, () => toggleGroup(sugarRef.current.group, true));
          },
          onLeaveBack: () => {
            toggleGroup(plateRef.current.group, false);
            toggleGroup(sugarRef.current.group, false);
          },
        });
      }

      if (refs.masala && refs.masala.current && spicesRef && spicesRef.current) {
        ScrollTrigger.create({
          trigger: refs.masala.current,
          start: "top 65%",
          end: "bottom 35%",
          onEnter: () => toggleGroup(spicesRef.current.group, true),
          onLeave: () => toggleGroup(spicesRef.current.group, false),
          onEnterBack: () => toggleGroup(spicesRef.current.group, true),
          onLeaveBack: () => toggleGroup(spicesRef.current.group, false),
        });
      }

      if (
        refs.green &&
        refs.green.current &&
        refs.matcha &&
        refs.matcha.current &&
        leavesRef &&
        leavesRef.current
      ) {
        ScrollTrigger.create({
          trigger: refs.green.current,
          start: "top 70%",
          endTrigger: refs.matcha.current,
          end: "bottom 30%",
          onEnter: () => toggleGroup(leavesRef.current.group, true),
          onLeave: () => toggleGroup(leavesRef.current.group, false),
          onEnterBack: () => toggleGroup(leavesRef.current.group, true),
          onLeaveBack: () => toggleGroup(leavesRef.current.group, false),
        });
      }

      // Chamomile — dried flower petals.
      if (refs.chamomile && refs.chamomile.current && petalsRef && petalsRef.current) {
        ScrollTrigger.create({
          trigger: refs.chamomile.current,
          start: "top 65%",
          end: "bottom 35%",
          onEnter: () => toggleGroup(petalsRef.current.group, true),
          onLeave: () => toggleGroup(petalsRef.current.group, false),
          onEnterBack: () => toggleGroup(petalsRef.current.group, true),
          onLeaveBack: () => toggleGroup(petalsRef.current.group, false),
        });
      }

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [ready]);
}

function toggleGroup(object3d, visible) {
  if (!object3d) return;
  gsap.to(object3d.scale, {
    x: visible ? 1 : 0,
    y: visible ? 1 : 0,
    z: visible ? 1 : 0,
    duration: visible ? 0.7 : 0.4,
    ease: visible ? "back.out(1.7)" : "power2.in",
  });
}

function setLabelsVisible(labelsRef, visible) {
  const labels = labelsRef.current;
  if (!labels) return;
  Object.values(labels).forEach((el) => {
    if (el) el.style.opacity = visible ? "1" : "0";
  });
}