import BuildingConfig from "@/types/BuildingConfig";
import Colors from "@/types/Colors";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createSimpleStaircase } from "./Scenes/StairCase";

interface BuildingSceneProps {
  config: BuildingConfig;
}

function createFloor(width: number, height: number, y: number, holes: THREE.Path[]) : THREE.Mesh {
  // Floor slab
  const floorMaterial = new THREE.MeshLambertMaterial({ color: 0xdddddd });

  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, -height / 2);
  shape.lineTo(width / 2, -height / 2);
  shape.lineTo(width / 2, height / 2);
  shape.lineTo(-width / 2, height / 2);
  shape.lineTo(-width / 2, -height / 2);

  shape.holes.push(...holes);


  const floorGeometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.3,
    bevelEnabled: false,
  });

  const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
  floorMesh.rotation.x = Math.PI / 2;
  floorMesh.position.set(0, y, 0);
  floorMesh.castShadow = true;
  floorMesh.receiveShadow = true;

  return floorMesh;
}


export function BuildingScene({ config }: BuildingSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    buildingGroup: THREE.Group;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(Colors.sky);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(30, 20, 30);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 25);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    // const groundMaterial = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/textures/concrete.jpg') });
    const groundMaterial = new THREE.MeshLambertMaterial({ color: Colors.grass });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Building group
    const buildingGroup = new THREE.Group();
    scene.add(buildingGroup);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      buildingGroup,
    };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !sceneRef.current) return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      sceneRef.current.camera.aspect = width / height;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Clear existing building
    sceneRef.current.buildingGroup.clear();

    // Create building based on config
    createBuilding(sceneRef.current.buildingGroup, config);
  }, [config]);

  return <div ref={mountRef} className="w-full h-full cursor-grab" />;
}

function createBuilding(group: THREE.Group, config: BuildingConfig) {
  const {
    floors,
    columns,
    width,
    height,
    floorHeight,
    floorSpacing,
    columnSpacing,

  stairCaseConfig
  } = config;

  // Materials
  const columnMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });

  // Create floors

  let previousStairCaseCut: THREE.Path | null = null;

  for (let floor = 0; floor < floors; floor++) {
    const y = 0.1 + floor * (floorHeight + floorSpacing);
    const stairCase = createSimpleStaircase({
      ...stairCaseConfig,
      floorHeight,
      floorOffset: y,
      direction: (floor % 2 == 0 ? 1 : -1)
    });

    const holes = [];
    if (previousStairCaseCut) {
      holes.push(previousStairCaseCut);
    }

    group.add(createFloor(width, height, y, holes));
    if (stairCase) {
      group.add(stairCase.stairCase);
      previousStairCaseCut = stairCase.removeGap;
    }

      const columnHeight = floorHeight + floorSpacing;
      const columnGeometry = new THREE.CylinderGeometry(0.3, 0.3, columnHeight);

      for (let col = 0; col < columns; col++) {
        for (let row = 0; row < columns; row++) {
          const x = (col - (columns - 1) / 2) * columnSpacing;
          const z = (row - (columns - 1) / 2) * columnSpacing;

          // Only place columns within building bounds
          if (Math.abs(x) <= width / 2 && Math.abs(z) <= height / 2) {
            const columnMesh = new THREE.Mesh(columnGeometry, columnMaterial);
            columnMesh.position.set(x, y + columnHeight / 2, z);
            columnMesh.castShadow = true;
            columnMesh.receiveShadow = true;
            group.add(columnMesh);
          }
        }
      }
  }



  const holes = previousStairCaseCut ? [previousStairCaseCut]: [];
  group.add(createFloor(width, height, (0.1 + floors * (floorHeight + floorSpacing)), holes));

  // Add some walls for visual interest
  const wallMaterial = new THREE.MeshLambertMaterial({
    color: 0x555555,
    transparent: true,
    opacity: config.wallsOpacity
  });

  for (let floor = 0; floor < floors; floor++) {
    const y = floor * (floorHeight + floorSpacing) + floorHeight / 2;

    // Front and back walls
    const wallGeometry1 = new THREE.BoxGeometry(width, floorHeight, 0.2);

    const frontWall = new THREE.Mesh(wallGeometry1, wallMaterial);
    frontWall.position.set(0, y, height / 2);
    frontWall.castShadow = true;
    group.add(frontWall);

    const backWall = new THREE.Mesh(wallGeometry1, wallMaterial);
    backWall.position.set(0, y, -height / 2);
    backWall.castShadow = true;
    group.add(backWall);

    // Side walls
    const wallGeometry2 = new THREE.BoxGeometry(0.2, floorHeight, height);

    const leftWall = new THREE.Mesh(wallGeometry2, wallMaterial);
    leftWall.position.set(-width / 2, y, 0);
    leftWall.castShadow = true;
    group.add(leftWall);

    const rightWall = new THREE.Mesh(wallGeometry2, wallMaterial);
    rightWall.position.set(width / 2, y, 0);
    rightWall.castShadow = true;
    group.add(rightWall);
  }
}


