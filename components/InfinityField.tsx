"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ScrollTrigger } from "./gsap";

// A flowing particle ribbon along a lemniscate (∞) – the brand mark, alive.
const vert = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform float uScale;
  uniform float uPR;
  uniform vec2 uMouse;
  attribute float aT;
  attribute float aSpeed;
  attribute float aSize;
  attribute float aHue;
  attribute vec3 aOff;
  varying float vHue;
  varying float vAlpha;

  vec3 lem(float t) {
    float s = sin(t), c = cos(t);
    float d = 1.0 + s * s;
    return vec3(c / d, s * c / d, 0.22 * sin(2.0 * t)) * uScale;
  }

  void main() {
    float t = aT + uTime * aSpeed;
    vec3 p = lem(t);
    vec3 tan = normalize(lem(t + 0.01) - p);
    vec3 n1 = normalize(cross(tan, vec3(0.0, 0.0, 1.0)));
    vec3 n2 = cross(tan, n1);
    // offsets spiral around the curve, tube breathes along its length
    float a = t * 3.0 + uTime * 0.4 + aOff.z * 6.283;
    float r = (0.18 + 0.12 * sin(t * 2.0 + uTime * 0.6)) * aOff.x * (1.0 + uScroll * 5.0);
    p += (n1 * cos(a) + n2 * sin(a)) * r * uScale * 0.35;
    p += vec3(aOff.y, aOff.x, aOff.z) * uScroll * 2.2;

    // pointer pushes particles away
    vec2 dm = p.xy - uMouse;
    float f = exp(-dot(dm, dm) * 2.2);
    p.xy += normalize(dm + 1e-4) * f * 0.16;
    p.z += f * 0.15;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPR * (26.0 / -mv.z) * (1.0 + f * 0.35);
    vHue = aHue;
    vAlpha = (0.55 + 0.45 * sin(uTime * 1.5 + aT * 12.0)) * (1.0 - uScroll * 0.9);
  }
`;

const frag = /* glsl */ `
  varying float vHue;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float g = smoothstep(0.5, 0.0, d);
    vec3 rose = vec3(0.78, 0.55, 0.57);
    vec3 gold = vec3(0.92, 0.74, 0.55);
    vec3 blush = vec3(0.98, 0.9, 0.88);
    vec3 col = mix(rose, gold, smoothstep(0.35, 0.8, vHue));
    col = mix(col, blush, smoothstep(0.85, 1.0, vHue));
    gl_FragColor = vec4(col, g * g * vAlpha * 0.62);
  }
`;

export default function InfinityField({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = innerWidth < 760;
    const COUNT = small ? 7000 : 16000;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    const pr = Math.min(devicePixelRatio, 2);
    renderer.setPixelRatio(pr);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.z = 10;

    const geo = new THREE.BufferGeometry();
    const aT = new Float32Array(COUNT);
    const aSpeed = new Float32Array(COUNT);
    const aSize = new Float32Array(COUNT);
    const aHue = new Float32Array(COUNT);
    const aOff = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      aT[i] = Math.random() * Math.PI * 2;
      aSpeed[i] = 0.05 + Math.random() * 0.08;
      aSize[i] = Math.random() < 0.04 ? 6 + Math.random() * 6 : 1.5 + Math.random() * 3;
      aHue[i] = Math.random();
      // bias toward the core so the ribbon reads as a solid stroke
      aOff[i * 3] = Math.pow(Math.random(), 1.8) * 2 - 0.2;
      aOff[i * 3 + 1] = Math.random() * 2 - 1;
      aOff[i * 3 + 2] = Math.random();
    }
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
    geo.setAttribute("aT", new THREE.BufferAttribute(aT, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(aSpeed, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(aSize, 1));
    geo.setAttribute("aHue", new THREE.BufferAttribute(aHue, 1));
    geo.setAttribute("aOff", new THREE.BufferAttribute(aOff, 3));

    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uScale: { value: 3 },
      uPR: { value: pr },
      uMouse: { value: new THREE.Vector2(99, 99) },
    };
    const mat = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // fit the ∞ to ~80% of the visible width, capped by height
      const visH = 2 * Math.tan((35 * Math.PI) / 360) * 10;
      const visW = visH * camera.aspect;
      uniforms.uScale.value = Math.min(visW * 0.4, visH * 0.44);
      group.position.y = w < 760 ? visH * 0.22 : visH * 0.13;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // pointer → world plane z=0
    const target = new THREE.Vector2(99, 99);
    const tilt = new THREE.Vector2();
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = -((e.clientY - r.top) / r.height) * 2 + 1;
      const visH = 2 * Math.tan((35 * Math.PI) / 360) * 10;
      target.set((nx * visH * camera.aspect) / 2, (ny * visH) / 2 - group.position.y);
      tilt.set(nx, ny);
    };
    const onLeave = () => target.set(99, 99);
    window.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => (uniforms.uScroll.value = self.progress),
    });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uMouse.value.lerp(target, 0.05);
      group.rotation.y += (tilt.x * 0.1 - group.rotation.y) * 0.03;
      group.rotation.x += (-tilt.y * 0.06 - group.rotation.x) * 0.03;
      renderer.render(scene, camera);
    };
    if (reduced) {
      uniforms.uTime.value = 4;
      renderer.render(scene, camera);
    } else loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      st.kill();
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={host} className={className} aria-hidden />;
}
