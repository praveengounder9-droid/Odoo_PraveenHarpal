import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { TripStop, City } from '../../types';
import { CITY_COORDINATES, latLngToVector3, createFlightArcPoints } from '../../utils/geoUtils';
import { Navigation, Compass } from 'lucide-react';

interface Globe3DProps {
  stops?: TripStop[];
  cities?: City[];
  onSelectCity?: (city: City) => void;
  activeCityId?: string | null;
  height?: string;
  autoRotate?: boolean;
}

export const Globe3D: React.FC<Globe3DProps> = ({
  stops = [],
  cities = [],
  onSelectCity,
  activeCityId,
  height = '500px',
  autoRotate = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);
  const [hoveredCity, setHoveredCity] = useState<{ name: string; country: string; costIndex?: string } | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // WebGL support check
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const width = container.clientWidth || 800;
    const canvasHeight = container.clientHeight || 500;

    // Scene Setup
    const scene = new THREE.Scene();

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / canvasHeight, 0.1, 1000);
    camera.position.set(0, 0, 5.5);

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Base Sphere
    const globeRadius = 2.0;
    const sphereGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);

    // Create Canvas Texture for Earth Continents
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 2048;
    textureCanvas.height = 1024;
    const ctx = textureCanvas.getContext('2d');
    if (ctx) {
      // Warm Luxury Light Palette background
      ctx.fillStyle = '#EFE9DE';
      ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

      // Continent Landmass lines/shapes (Procedural Land Map)
      ctx.fillStyle = '#D6CDBF';
      ctx.strokeStyle = '#B86F52';
      ctx.lineWidth = 2;

      // Draw stylized latitude & longitude reference grid
      ctx.strokeStyle = '#DED6C9';
      ctx.lineWidth = 1;
      for (let x = 0; x < textureCanvas.width; x += 128) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, textureCanvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < textureCanvas.height; y += 128) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(textureCanvas.width, y);
        ctx.stroke();
      }

      // Draw Continents stylized shapes
      ctx.fillStyle = '#D6CEC0';
      // Eurasia / Africa
      ctx.beginPath();
      ctx.ellipse(1200, 350, 450, 250, 0, 0, 2 * Math.PI);
      ctx.fill();
      // Americas
      ctx.beginPath();
      ctx.ellipse(500, 450, 280, 380, 0.2, 0, 2 * Math.PI);
      ctx.fill();
      // Australia
      ctx.beginPath();
      ctx.ellipse(1700, 750, 180, 120, 0, 0, 2 * Math.PI);
      ctx.fill();
    }

    const globeTexture = new THREE.CanvasTexture(textureCanvas);

    const globeMaterial = new THREE.MeshStandardMaterial({
      map: globeTexture,
      roughness: 0.7,
      metalness: 0.1,
      color: 0xffffff,
    });
    const globeMesh = new THREE.Mesh(sphereGeometry, globeMaterial);
    globeGroup.add(globeMesh);

    // Atmosphere Outer Glow Sphere
    const atmosphereGeometry = new THREE.SphereGeometry(globeRadius * 1.04, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xb86f52,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfffdf9, 1.8);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xb86f52, 0.6);
    dirLight2.position.set(-5, -3, -5);
    scene.add(dirLight2);

    // Pin Interactive Markers Group
    const pinsGroup = new THREE.Group();
    globeGroup.add(pinsGroup);

    const interactiveObjects: THREE.Object3D[] = [];
    const cityObjectsMap = new Map<string, { mesh: THREE.Mesh; cityData: any }>();

    // Determine target cities to plot
    const displayCities = cities.length > 0 ? cities : Object.entries(CITY_COORDINATES).map(([id, geo]) => ({
      id,
      name: geo.cityName,
      country: geo.country,
      description: '',
      coverImage: '',
      costIndex: '$$$',
      popularityScore: 90,
      averageDailyCost: 150,
      region: 'World',
      tags: []
    }));

    // Plot City 3D Pins
    displayCities.forEach(city => {
      const geo = CITY_COORDINATES[city.id] || Object.values(CITY_COORDINATES).find(g => g.cityName.toLowerCase() === city.name.toLowerCase());
      if (!geo) return;

      const pinPos = latLngToVector3(geo.lat, geo.lng, globeRadius, 0.04);
      const isStopInTrip = stops.some(s => s.cityId === city.id || s.cityName.toLowerCase() === city.name.toLowerCase());
      const isActive = city.id === activeCityId;

      // Pin Mesh (Sphere + Cone)
      const pinGeometry = new THREE.SphereGeometry(isStopInTrip || isActive ? 0.06 : 0.04, 16, 16);
      const pinMaterial = new THREE.MeshStandardMaterial({
        color: isStopInTrip ? 0xb86f52 : isActive ? 0x72775f : 0x756c62,
        roughness: 0.3,
        metalness: 0.5,
        emissive: isStopInTrip ? 0xb86f52 : 0x000000,
        emissiveIntensity: isStopInTrip ? 0.4 : 0,
      });

      const pinMesh = new THREE.Mesh(pinGeometry, pinMaterial);
      pinMesh.position.copy(pinPos);
      pinMesh.userData = { city, isStopInTrip };
      pinsGroup.add(pinMesh);

      interactiveObjects.push(pinMesh);
      cityObjectsMap.set(city.id, { mesh: pinMesh, cityData: city });
    });

    // Draw Dynamic 3D Flight Route Arcs for Active Trip Stops (Paris ➔ Rome ➔ Barcelona etc.)
    const routesGroup = new THREE.Group();
    globeGroup.add(routesGroup);

    const pulseParticles: Array<{ mesh: THREE.Mesh; points: THREE.Vector3[]; progress: number; speed: number }> = [];

    if (stops.length >= 2) {
      for (let i = 0; i < stops.length - 1; i++) {
        const currentStop = stops[i];
        const nextStop = stops[i + 1];

        const geo1 = CITY_COORDINATES[currentStop.cityId] || Object.values(CITY_COORDINATES).find(g => g.cityName.toLowerCase() === currentStop.cityName.toLowerCase());
        const geo2 = CITY_COORDINATES[nextStop.cityId] || Object.values(CITY_COORDINATES).find(g => g.cityName.toLowerCase() === nextStop.cityName.toLowerCase());

        if (geo1 && geo2) {
          const v1 = latLngToVector3(geo1.lat, geo1.lng, globeRadius, 0.04);
          const v2 = latLngToVector3(geo2.lat, geo2.lng, globeRadius, 0.04);

          const arcPoints = createFlightArcPoints(v1, v2, globeRadius, 50);
          const arcGeometry = new THREE.BufferGeometry().setFromPoints(arcPoints);

          // Flight Arc Tube Line
          const arcMaterial = new THREE.LineDashedMaterial({
            color: 0xb86f52,
            dashSize: 0.1,
            gapSize: 0.05,
            linewidth: 2,
          });

          const arcLine = new THREE.Line(arcGeometry, arcMaterial);
          arcLine.computeLineDistances();
          routesGroup.add(arcLine);

          // Travelling Light Particle
          const particleGeo = new THREE.SphereGeometry(0.03, 12, 12);
          const particleMat = new THREE.MeshBasicMaterial({ color: 0xc49a5a });
          const particleMesh = new THREE.Mesh(particleGeo, particleMat);
          routesGroup.add(particleMesh);

          pulseParticles.push({
            mesh: particleMesh,
            points: arcPoints,
            progress: 0,
            speed: 0.008 + (i * 0.002),
          });
        }
      }
    }

    // Drag & Interaction state
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        globeGroup.rotation.y += deltaX * 0.005;
        globeGroup.rotation.x += deltaY * 0.005;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      } else {
        // Raycasting for hover tooltip
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveObjects);

        if (intersects.length > 0) {
          const hitObj = intersects[0].object;
          const cityData = hitObj.userData.city;
          if (cityData) {
            setHoveredCity({ name: cityData.name, country: cityData.country, costIndex: cityData.costIndex });
            setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top - 40 });
            container.style.cursor = 'pointer';
          }
        } else {
          setHoveredCity(null);
          container.style.cursor = isDragging ? 'grabbing' : 'grab';
        }
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects);

      if (intersects.length > 0) {
        const cityData = intersects[0].object.userData.city;
        if (cityData && onSelectCity) {
          onSelectCity(cityData);
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('click', onClick);

    // Animation Render Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && !isDragging) {
        globeGroup.rotation.y += 0.0015;
      }

      // Update route pulse particles
      pulseParticles.forEach(p => {
        p.progress += p.speed;
        if (p.progress >= 1) p.progress = 0;
        const index = Math.floor(p.progress * (p.points.length - 1));
        const point = p.points[index];
        if (point) p.mesh.position.copy(point);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 800;
      const newH = container.clientHeight || 500;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('click', onClick);
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
      renderer.dispose();
    };
  }, [stops, cities, activeCityId, autoRotate, onSelectCity]);

  // Graceful 2D Fallback Component if WebGL fails
  if (!webGlSupported) {
    return (
      <div style={{
        height,
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <Navigation size={42} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontFamily: 'Playfair Display, serif' }}>
          Interactive 2D Route Visualizer
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '500px', marginTop: '0.5rem' }}>
          WebGL 3D graphics are not available on this browser session. Showing 2D dynamic route pathway.
        </p>

        {stops.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {stops.map((s, idx) => (
              <React.Fragment key={s.id}>
                <div style={{ background: 'var(--bg-subtle)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontWeight: 700, fontSize: '0.85rem' }}>
                  {s.cityName}
                </div>
                {idx < stops.length - 1 && <span style={{ color: 'var(--primary)', fontWeight: 800 }}>➔</span>}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'radial-gradient(circle at center, var(--bg-card) 0%, var(--bg-dark) 100%)' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* Hover Tooltip Overlay */}
      {hoveredCity && (
        <div style={{
          position: 'absolute',
          left: `${tooltipPos.x}px`,
          top: `${tooltipPos.y}px`,
          pointerEvents: 'none',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-color)',
          padding: '0.4rem 0.8rem',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-subtle)',
          zIndex: 50
        }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
            {hoveredCity.name}, {hoveredCity.country}
          </div>
          {hoveredCity.costIndex && (
            <div style={{ fontSize: '0.725rem', color: 'var(--primary)' }}>
              Cost Index: {hoveredCity.costIndex} [Estimated]
            </div>
          )}
        </div>
      )}

      {/* Dynamic User Route Badge */}
      <div style={{
        position: 'absolute',
        bottom: '14px',
        left: '14px',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--border-color)',
        padding: '0.4rem 0.85rem',
        borderRadius: 'var(--radius-full)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.785rem',
        fontWeight: 600,
        color: 'var(--text-primary)',
        boxShadow: 'var(--shadow-subtle)'
      }}>
        <Compass size={14} style={{ color: 'var(--primary)' }} />
        <span>
          {stops.length > 0 
            ? `3D Active Journey: ${stops.map(s => s.cityName).join(' ➔ ')}`
            : 'Interactive 3D Globe — Click any pin to explore'}
        </span>
      </div>
    </div>
  );
};
