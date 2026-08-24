import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const canvas = document.querySelector(".hero-three");
const hero = document.querySelector(".hero");
if (
  canvas &&
  hero &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 6);

  const amber = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.18, 5),
    new THREE.MeshPhysicalMaterial({
      color: 0xeaa83c,
      roughness: 0.19,
      metalness: 0.02,
      transmission: 0.16,
      thickness: 1.2,
      transparent: true,
      opacity: 0.82,
    }),
  );
  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.25, 2),
    new THREE.MeshBasicMaterial({
      color: 0xffdd7c,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    }),
  );
  amber.add(core, shell);
  scene.add(amber);

  const dustGeometry = new THREE.BufferGeometry();
  const dust = Array.from({ length: 260 }, () => [
    THREE.MathUtils.randFloatSpread(6),
    THREE.MathUtils.randFloatSpread(5),
    THREE.MathUtils.randFloatSpread(2),
  ]).flat();
  dustGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(dust, 3),
  );
  scene.add(
    new THREE.Points(
      dustGeometry,
      new THREE.PointsMaterial({
        color: 0xf4d782,
        size: 0.028,
        transparent: true,
        opacity: 0.72,
      }),
    ),
  );
  scene.add(new THREE.HemisphereLight(0xeaf6c2, 0x1c381e, 2));
  const light = new THREE.PointLight(0xffb33c, 13, 20);
  light.position.set(-2, 3, 4);
  scene.add(light);

  const mouse = new THREE.Vector2();
  hero.addEventListener(
    "pointermove",
    (event) => {
      const box = hero.getBoundingClientRect();
      mouse.x = ((event.clientX - box.left) / box.width - 0.5) * 2;
      mouse.y = ((event.clientY - box.top) / box.height - 0.5) * 2;
    },
    { passive: true },
  );
  function resize() {
    const { width, height } = canvas.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  function animate(time) {
    const t = time * 0.001;
    amber.rotation.y += (mouse.x * 0.34 - amber.rotation.y) * 0.025;
    amber.rotation.x += (-mouse.y * 0.2 - amber.rotation.x) * 0.025;
    amber.rotation.z = Math.sin(t * 0.5) * 0.08;
    amber.position.y = Math.sin(t * 0.8) * 0.13;
    shell.rotation.y = -t * 0.13;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}
