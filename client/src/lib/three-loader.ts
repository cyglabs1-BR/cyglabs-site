import * as THREE from "three";

// Utility functions for Three.js setup and STL loading
export const createScene = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5f5);
  return scene;
};

export const createCamera = (width: number, height: number) => {
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0, 0, 100);
  return camera;
};

export const createRenderer = (width: number, height: number) => {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  return renderer;
};

export const createLighting = (scene: THREE.Scene) => {
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(100, 100, 50);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
};

export const centerAndScaleGeometry = (geometry: THREE.BufferGeometry, targetSize: number = 50) => {
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox;
  
  if (bbox) {
    const center = bbox.getCenter(new THREE.Vector3());
    geometry.translate(-center.x, -center.y, -center.z);

    const size = bbox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = targetSize / maxDim;
    
    return scale;
  }
  
  return 1;
};
