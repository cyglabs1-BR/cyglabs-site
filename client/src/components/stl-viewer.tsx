import { useEffect, useRef } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface StlViewerProps {
  stlUrl: string;
  width?: number;
  height?: number;
}

export default function StlViewer({ stlUrl, width = 400, height = 400 }: StlViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef<OrbitControls>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 100);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Load STL file
    const loader = new STLLoader();
    loader.load(
      stlUrl,
      (geometry) => {
        const material = new THREE.MeshPhongMaterial({ 
          color: 0x606060,
          shininess: 100,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Center the model
        geometry.computeBoundingBox();
        const bbox = geometry.boundingBox;
        if (bbox) {
          const center = bbox.getCenter(new THREE.Vector3());
          geometry.translate(-center.x, -center.y, -center.z);

          // Scale to fit viewport
          const size = bbox.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 50 / maxDim;
          mesh.scale.setScalar(scale);
        }

        scene.add(mesh);
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total) * 100 + '%');
      },
      (error) => {
        console.error('Error loading STL:', error);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [stlUrl, width, height]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full flex items-center justify-center border rounded-lg"
      data-testid="stl-viewer"
    />
  );
}
