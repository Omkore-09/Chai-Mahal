import { useCallback, useEffect, useRef, useState } from "react";
import Scene from "./components/Scene";
import useScrollTimeline from "./hooks/useScrollTimeline";
import { teas, atlas, hero } from "./content";

function useWebglSupport() {
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      setSupported(!!gl);
    } catch (e) {
      setSupported(false);
    }
  }, []);
  return supported;
}

export default function App() {
  const webglOk = useWebglSupport();

  const pageRef = useRef(null);
  const groupRef = useRef(null);
  const partsRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const labelsRef = useRef({});
  const plateRef = useRef(null);
  const spicesRef = useRef(null);
  const sugarRef = useRef(null);
  const leavesRef = useRef(null);
  const petalsRef = useRef(null);


  const sectionRefs = useRef(
    Object.fromEntries(
      [...teas.map((t) => t.id), "atlas"].map((id) => [id, { current: null }])
    )
  ).current;

  const [modelReady, setModelReady] = useState(false);
  const handleModelReady = useCallback(() => setModelReady(true), []);

  useScrollTimeline({
    refs: sectionRefs,
    partsRef,
    cameraRef,
    controlsRef,
    labelsRef,
    pageRef,
    groupRef,
    ready: modelReady,
    plateRef,
    spicesRef,
    sugarRef,
    leavesRef,
    petalsRef,
  });

  return (
    <>
      {webglOk ? (
        <div className="canvas-stage">
          <Scene
            partsRef={partsRef}
            labelsRef={labelsRef}
            sceneRootRef={groupRef}
            cameraRef={cameraRef}
            controlsRef={controlsRef}
            onReady={handleModelReady}
            plateRef={plateRef}
            spicesRef={spicesRef}
            sugarRef={sugarRef}
            leavesRef={leavesRef}
            petalsRef={petalsRef}
          />
        </div>
      ) : (
        <div className="no-webgl-fallback">
          <span>3D preview unavailable on this device — WebGL not supported.</span>
        </div>
      )}
      <div className="canvas-vignette" />
      <div className="grain" />

      <div className="mark">
        <span className="leaf" />
        Chai Mahal
        <span className="mark-note">today's pour</span>
      </div>

      <div className="content" ref={pageRef}>
        <section className="section section--left">
          <div className="hero panel">
            <h1>
              Six teas.
              <br />
              One cup, poured <em>six ways</em>.
            </h1>
            <p>{hero.body}</p>
            <div className="scroll-cue">
              <span className="line" />
              scroll to steep through them
            </div>
          </div>
        </section>

        {teas.map((t) => (
          <section
            key={t.id}
            ref={(el) => (sectionRefs[t.id].current = el)}
            className={`section section--${t.align}`}
          >
            <div className="panel">
              <span className="origin-tag">{t.origin}</span>
              <h2>{t.name}</h2>
              <p>{t.body}</p>
              <dl className="specs">
                {t.specs.map((sp) => (
                  <div className="spec" key={sp.label}>
                    <dt>{sp.label}</dt>
                    <dd>{sp.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        ))}

        <section
          ref={(el) => (sectionRefs.atlas.current = el)}
          className="section section--center"
          style={{ minHeight: "150vh" }}
        >
          <div className="panel">
            <span className="origin-tag">the atlas</span>
            <h2>{atlas.title}</h2>
            <p>{atlas.body}</p>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-copy">
            <h2>Steep something you haven't tried.</h2>
            <p>
              Chai Mahal is a concept demo — not a tea shop — built to show
              what a real one could feel like: one interactive cup, six
              stories, no page reloads.
            </p>
            <button className="cta-btn">Explore the full atlas</button>
          </div>
          <div className="meta">Concept demo · built with React Three Fiber &amp; GSAP</div>
        </footer>
      </div>
    </>
  );
}