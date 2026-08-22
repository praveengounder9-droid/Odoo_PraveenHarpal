import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { TripStop } from '../../types';
import { getCityCoordinates } from '../../utils/mapGeoData';
import { MapPin, Search, Navigation, AlertCircle } from 'lucide-react';

interface RealMapEngineProps {
  stops?: TripStop[];
  activeStopId?: string | null;
  onSelectStop?: (stop: TripStop) => void;
  onOpenSearchModal?: () => void;
  height?: string;
  selectedDay?: number | null;
}

export const RealMapEngine: React.FC<RealMapEngineProps> = ({
  stops = [],
  activeStopId,
  onSelectStop,
  onOpenSearchModal,
  height = '520px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const markersRef = useRef<any[]>([]);

  // Map user stops to real numeric geographic points [lng, lat]
  const stopPoints = stops.map((stop, idx) => {
    const geo = (stop.lat !== undefined && stop.lng !== undefined && !isNaN(Number(stop.lat)) && !isNaN(Number(stop.lng)))
      ? { lat: Number(stop.lat), lng: Number(stop.lng) }
      : getCityCoordinates(stop.cityId || stop.cityName);

    return {
      ...stop,
      lat: geo.lat,
      lng: geo.lng,
      index: idx + 1
    };
  });

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    try {
      // Center map around first stop coordinate or default center (Europe/Middle East)
      const centerLng = stopPoints.length > 0 ? stopPoints[0].lng : 15.0;
      const centerLat = stopPoints.length > 0 ? stopPoints[0].lat : 45.0;

      // Initialize MapLibre GL JS Real Vector Map
      const map = new maplibregl.Map({
        container,
        style: {
          version: 8,
          sources: {
            'carto-voyager': {
              type: 'raster',
              tiles: ['https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; OpenStreetMap &copy; CARTO'
            }
          },
          layers: [
            {
              id: 'carto-layer',
              type: 'raster',
              source: 'carto-voyager',
              minzoom: 0,
              maxzoom: 19
            }
          ]
        },
        center: [centerLng, centerLat],
        zoom: stopPoints.length > 0 ? 4 : 2,
        pitch: 35, // 3D Camera Pitch
        bearing: 0
      });

      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');

      map.on('load', () => {
        setMapLoaded(true);
      });

      map.on('error', (e: any) => {
        console.warn('MapLibre GL tile loading warning', e);
      });

      mapRef.current = map;
    } catch (err) {
      console.warn('MapLibre GL WebGL initialization failed, activating 2D fallback', err);
      setMapError(true);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Markers & Per-User Dynamic GeoJSON Route Line
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Clear previous markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add Markers for each user stop at true [lng, lat]
    stopPoints.forEach((pt) => {
      const el = document.createElement('div');
      el.className = 'custom-map-marker';
      el.style.cssText = `
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #B86F52;
        border: 2px solid #FFFFFF;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 12px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(31, 26, 23, 0.25);
      `;
      el.innerText = `${pt.index}`;

      el.addEventListener('click', () => {
        if (onSelectStop) onSelectStop(pt);
        map.flyTo({ center: [pt.lng, pt.lat], zoom: 10, pitch: 45, duration: 1500, essential: true });
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([pt.lng, pt.lat])
        .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 4px; font-family: Outfit, sans-serif;">
            <strong style="color: #29231F; font-size: 14px;">Day ${pt.index}: ${pt.cityName}</strong>
            <p style="margin: 4px 0 0; color: #756C62; font-size: 12px;">${pt.country}</p>
            <p style="margin: 2px 0 0; color: #B86F52; font-size: 11px; font-weight: 600;">Lat: ${pt.lat.toFixed(4)}, Lng: ${pt.lng.toFixed(4)}</p>
          </div>
        `))
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Draw Dynamic Per-User GeoJSON Route Line connecting stops in sequence
    if (stopPoints.length >= 2) {
      const coordinates = stopPoints.map(pt => [pt.lng, pt.lat]);

      const routeSourceId = 'user-route-source';
      const routeLayerId = 'user-route-layer';

      if (map.getSource(routeSourceId)) {
        (map.getSource(routeSourceId) as any).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates
          }
        });
      } else {
        map.addSource(routeSourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates
            }
          }
        });

        map.addLayer({
          id: routeLayerId,
          type: 'line',
          source: routeSourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#B86F52',
            'line-width': 4,
            'line-dasharray': [2, 1]
          }
        });
      }
    }
  }, [stopPoints, mapLoaded, onSelectStop]);

  // Auto Fit Bounds for multi-destination trips
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || stopPoints.length === 0) return;

    if (stopPoints.length >= 2) {
      try {
        const bounds = new (maplibregl as any).LngLatBounds();
        stopPoints.forEach(pt => bounds.extend([pt.lng, pt.lat]));
        map.fitBounds(bounds, { padding: 70, maxZoom: 12, duration: 1400 });
      } catch (err) {
        console.warn('MapLibre fitBounds error', err);
      }
    } else if (stopPoints.length === 1) {
      map.flyTo({
        center: [stopPoints[0].lng, stopPoints[0].lat],
        zoom: 9,
        pitch: 35,
        duration: 1200
      });
    }
  }, [stopPoints.length, mapLoaded]);

  // Handle activeStopId camera flyTo transition (Focus Map feature)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !activeStopId) return;

    const targetStop = stopPoints.find(s => s.id === activeStopId);
    if (targetStop) {
      map.flyTo({
        center: [targetStop.lng, targetStop.lat],
        zoom: 10,
        pitch: 45,
        duration: 1800,
        essential: true
      });
    }
  }, [activeStopId, mapLoaded]);

  // Graceful Fallback if WebGL/MapLibre fails
  if (mapError) {
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
        <AlertCircle size={40} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontFamily: 'Playfair Display, serif' }}>
          Interactive Map Visualizer (2D Mode)
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '500px', marginTop: '0.5rem' }}>
          MapLibre WebGL engine is unavailable. Showing fallback interactive route path.
        </p>

        {onOpenSearchModal && (
          <button onClick={onOpenSearchModal} className="btn btn-primary btn-sm" style={{ marginTop: '1.25rem' }}>
            <Search size={14} /> + Add Destination Search
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height,
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-color)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-subtle)'
    }}>
      {/* MapLibre Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating Control Bar Overlay */}
      <div style={{
        position: 'absolute',
        top: '14px',
        left: '14px',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        pointerEvents: 'auto'
      }}>
        <div style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-color)',
          padding: '0.4rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          boxShadow: '0 4px 12px rgba(31, 26, 23, 0.08)'
        }}>
          <Navigation size={15} style={{ color: 'var(--primary)' }} />
          <span>
            {stopPoints.length >= 2
              ? `Real Route: ${stopPoints.map(s => s.cityName).join(' ➔ ')}`
              : stopPoints.length === 1
              ? `Exploring: ${stopPoints[0].cityName}`
              : 'GlobeTrotter Real Vector Map'}
          </span>
        </div>

        {onOpenSearchModal && (
          <button
            type="button"
            onClick={onOpenSearchModal}
            className="btn btn-primary btn-sm"
            style={{ borderRadius: 'var(--radius-full)', boxShadow: '0 4px 12px rgba(184, 111, 82, 0.25)' }}
          >
            <Search size={14} />
            <span>+ Add Destination</span>
          </button>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div style={{
        position: 'absolute',
        bottom: '14px',
        left: '14px',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--border-color)',
        padding: '0.35rem 0.75rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem'
      }}>
        <MapPin size={13} style={{ color: 'var(--primary)' }} />
        <span>MapLibre GL Vector Tile Engine • Real Geographic Coordinates</span>
      </div>

    </div>
  );
};
