import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Budget3DChartProps {
  categories: {
    transport: number;
    accommodation: number;
    activities: number;
    meals: number;
    other: number;
  };
  height?: string;
}

export const Budget3DChart: React.FC<Budget3DChartProps> = ({ categories, height = '320px' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const canvasHeight = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / canvasHeight, 0.1, 100);
    camera.position.set(0, 3.5, 6);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffdf9, 1.5);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    // Group for 3D Bars
    const group = new THREE.Group();
    scene.add(group);

    const categoryList = [
      { key: 'transport', name: 'Transport', cost: categories.transport, color: 0x4a7c74 },
      { key: 'accommodation', name: 'Stay', cost: categories.accommodation, color: 0xb86f52 },
      { key: 'activities', name: 'Activities', cost: categories.activities, color: 0xc49a5a },
      { key: 'meals', name: 'Meals', cost: categories.meals, color: 0x72775f },
      { key: 'other', name: 'Other', cost: categories.other, color: 0x7e6c8f },
    ];

    const maxCost = Math.max(...categoryList.map(c => c.cost), 100);
    const startX = -2.0;
    const spacing = 1.0;

    categoryList.forEach((cat, i) => {
      const normalizedHeight = Math.max(0.2, (cat.cost / maxCost) * 2.5);
      const geometry = new THREE.CylinderGeometry(0.3, 0.3, normalizedHeight, 32);
      const material = new THREE.MeshStandardMaterial({
        color: cat.color,
        roughness: 0.3,
        metalness: 0.2,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(startX + i * spacing, normalizedHeight / 2, 0);
      group.add(mesh);
    });

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      group.rotation.y += 0.005;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 500;
      const h = container.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [categories]);

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', bottom: '8px', right: '12px', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
        3D Financial Cylinder Chart [Calculated / User Entered]
      </div>
    </div>
  );
};
