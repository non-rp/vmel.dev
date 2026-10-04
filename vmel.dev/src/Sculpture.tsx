'use client';

import { useEffect, useRef, useState } from 'react';

export default function Sculpture({ motion, wireframe = false }: { motion: boolean; wireframe?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const motionRef = useRef(motion);
  const wireRef = useRef(wireframe);
  const [ready, setReady] = useState(false);
  useEffect(() => { motionRef.current = motion; }, [motion]);
  useEffect(() => { wireRef.current = wireframe; }, [wireframe]);

  useEffect(() => {
    const element = host.current!;
    let disposed = false;
    let cleanup = () => {};
    async function initialize() {
      const THREE = await import('three');
      const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
      if (disposed) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      } catch { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      renderer.setClearColor(0x090909, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      element.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.z = 6.9;
      const pmrem = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      const environment = pmrem.fromScene(room, 0.04);
      scene.environment = environment.texture;
      room.dispose();
      pmrem.dispose();
      const geometry = new THREE.TorusKnotGeometry(1.05, 0.32, 220, 36, 2, 3);
      const material = new THREE.MeshPhysicalMaterial({
        color: '#b9afc6', metalness: 0.98, roughness: 0.23, clearcoat: 1, clearcoatRoughness: 0.14,
        envMapIntensity: 1.5,
      });
      const sculpture = new THREE.Mesh(geometry, material);
      sculpture.rotation.set(0.45, 0.2, -0.45);
      scene.add(sculpture);
      const violet = new THREE.PointLight('#af50ff', 35, 10);
      violet.position.set(2, -1, 2);
      scene.add(violet);
      const key = new THREE.DirectionalLight('#f7f9fa', 4);
      key.position.set(-3, 4, 3);
      scene.add(key);
      const rim = new THREE.PointLight('#e1bdff', 15, 10);
      rim.position.set(-2, 0, -1);
      scene.add(rim);
      let visible = true;
      let frame = 0;
      let dirty = true;
      let elapsed = 0;
      let previous = performance.now();
      const pointer = { x: 0, y: 0 };
      function move(event: PointerEvent) {
        const bounds = element.getBoundingClientRect();
        pointer.x = (event.clientX - bounds.left) / bounds.width - 0.5;
        pointer.y = (event.clientY - bounds.top) / bounds.height - 0.5;
      }
      function leave() { pointer.x = 0; pointer.y = 0; }
      function resize() {
        if (!element.clientWidth || !element.clientHeight) return;
        camera.aspect = element.clientWidth / element.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(element.clientWidth, element.clientHeight);
        dirty = true;
      }
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(element);
      const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
      visibilityObserver.observe(element);
      element.addEventListener('pointermove', move);
      element.addEventListener('pointerleave', leave);
      const contextLost = (event: Event) => { event.preventDefault(); setReady(false); };
      const contextRestored = () => { setReady(true); };
      renderer.domElement.addEventListener('webglcontextlost', contextLost);
      renderer.domElement.addEventListener('webglcontextrestored', contextRestored);
      resize();
      let lastRendered = 0;
      function animate(now: number) {
        if (disposed) return;
        frame = requestAnimationFrame(animate);
        const delta = Math.min((now - previous) / 1000, 0.05);
        previous = now;
        if (!visible || document.hidden || now - lastRendered < 32) return;
        lastRendered = now;
        if (material.wireframe !== wireRef.current) { material.wireframe = wireRef.current; dirty = true; }
        if (motionRef.current) {
          elapsed += delta;
          const x = 0.45 + pointer.y * 0.55;
          const y = elapsed * 0.13 + pointer.x * 0.7;
          sculpture.rotation.x += (x - sculpture.rotation.x) * 0.045;
          sculpture.rotation.y += (y - sculpture.rotation.y) * 0.045;
          sculpture.position.y = Math.sin(elapsed * 0.65) * 0.08;
          dirty = true;
        }
        if (!dirty) return;
        renderer.render(scene, camera);
        dirty = false;
      }
      renderer.render(scene, camera);
      setReady(true);
      frame = requestAnimationFrame(animate);
      cleanup = () => {
        cancelAnimationFrame(frame);
        resizeObserver.disconnect(); visibilityObserver.disconnect();
        element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', leave);
        renderer.domElement.removeEventListener('webglcontextlost', contextLost);
        renderer.domElement.removeEventListener('webglcontextrestored', contextRestored);
        geometry.dispose(); material.dispose(); environment.dispose(); renderer.dispose();
        renderer.domElement.remove();
      };
    }
    initialize().catch(() => { if (!disposed) setReady(false); });
    return () => { disposed = true; cleanup(); };
  }, []);

  return <div className={`sculpture ${ready ? 'sculpture-ready' : ''}`} ref={host} aria-hidden="true">
    <svg className="sculpture-fallback" viewBox="0 0 500 500"><defs><linearGradient id="sculpture-shine"><stop stopColor="#ebe7ef" /><stop offset=".4" stopColor="#514855" /><stop offset=".7" stopColor="#c6accf" /><stop offset="1" stopColor="#af50ff" /></linearGradient></defs><g fill="none" stroke="url(#sculpture-shine)" strokeWidth="34"><ellipse cx="250" cy="250" rx="150" ry="94" transform="rotate(-40 250 250)"/><ellipse cx="250" cy="250" rx="150" ry="94" transform="rotate(40 250 250)"/></g></svg>
  </div>;
}
