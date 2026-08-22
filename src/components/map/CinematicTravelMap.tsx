import React, { useState, useMemo } from 'react';
import type { TripStop } from '../../types';
import { WORLD_CITY_GEO_DATA, getCityCoordinates } from '../../utils/mapGeoData';
import type { MapMarkerData } from '../../utils/mapGeoData';
import { Compass, MapPin } from 'lucide-react';

interface CinematicTravelMapProps {
  stops?: TripStop[];
  activeStopId?: string | null;
  onSelectStop?: (stop: TripStop) => void;
  height?: string;
  selectedDay?: number | null;
  interactive?: boolean;
}

export const CinematicTravelMap: React.FC<CinematicTravelMapProps> = ({
  stops = [],
  activeStopId,
  onSelectStop,
  height = '480px',
  selectedDay = null,
  interactive = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(activeStopId || null);

  // Map user stops to geographic points
  const stopPoints = useMemo(() => {
    return stops.map((stop, index) => {
      const geo = getCityCoordinates(stop.cityId || stop.cityName);
      return {
        ...stop,
        lat: geo.lat,
        lng: geo.lng,
        index: index + 1
      };
    });
  }, [stops]);

  // Collect category markers for display cities
  const cityMarkers = useMemo(() => {
    let allMarkers: MapMarkerData[] = [];
    stops.forEach((s, idx) => {
      const cityData = WORLD_CITY_GEO_DATA[s.cityId] || Object.values(WORLD_CITY_GEO_DATA).find(c => c.cityName.toLowerCase() === s.cityName.toLowerCase());
      if (cityData) {
        cityData.markers.forEach(m => {
          allMarkers.push({ ...m, dayIndex: idx + 1 });
        });
      }
    });

    if (selectedCategory !== 'All') {
      allMarkers = allMarkers.filter(m => m.category === selectedCategory);
    }
    if (selectedDay !== null) {
      allMarkers = allMarkers.filter(m => m.dayIndex === selectedDay);
    }
    return allMarkers;
  }, [stops, selectedCategory, selectedDay]);

  // Convert lat/lng coordinates to 2D SVG canvas percentages
  const mapCoordsToSvg = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const activeMarker = cityMarkers.find(m => m.id === activeMarkerId);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height,
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-color)',
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at center, var(--bg-card) 0%, var(--bg-subtle) 100%)',
      boxShadow: 'var(--shadow-subtle)'
    }}>

      {/* Top Map Controls Bar */}
      {interactive && (
        <div style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          right: '14px',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          pointerEvents: 'auto'
        }}>
          {/* Brand & Dynamic Per-User Trip Route Indicator */}
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
            <Compass size={15} style={{ color: 'var(--primary)' }} />
            <span>
              {stops.length >= 2
                ? `Route: ${stops.map(s => s.cityName).join(' ➔ ')}`
                : stops.length === 1
                ? `Exploring: ${stops[0].cityName}`
                : 'GlobeTrotter Spatial Map'}
            </span>
          </div>

          {/* Category Filter Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-color)',
            padding: '0.25rem',
            borderRadius: 'var(--radius-full)'
          }}>
            {['All', 'Attraction', 'Hotel', 'Dining', 'Culture'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat ? 'var(--primary)' : 'transparent',
                  color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Interactive Geographic Map Canvas SVG */}
      <svg style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B86F52" />
            <stop offset="50%" stopColor="#C49A5A" />
            <stop offset="100%" stopColor="#72775F" />
          </linearGradient>

          {/* Glow filter for travel markers */}
          <filter id="markerGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Stylized Geography Background Grid */}
        <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border-color)" strokeWidth="0.5" opacity="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#mapGrid)" />

        {/* Dynamic Route Line connecting consecutive user stops in order */}
        {stopPoints.length >= 2 && (
          <g>
            {stopPoints.map((pt, idx) => {
              if (idx === stopPoints.length - 1) return null;
              const nextPt = stopPoints[idx + 1];
              const p1 = mapCoordsToSvg(pt.lat, pt.lng);
              const p2 = mapCoordsToSvg(nextPt.lat, nextPt.lng);

              // Curved Bezier Flight Arc Path
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2 - 12;

              return (
                <g key={`route-${idx}`}>
                  <path
                    d={`M ${p1.x}% ${p1.y}% Q ${midX}% ${midY}%, ${p2.x}% ${p2.y}%`}
                    fill="none"
                    stroke="url(#routeGradient)"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    opacity="0.85"
                  />
                  <circle cx={`${midX}%`} cy={`${midY}%`} r="4" fill="var(--primary)" />
                </g>
              );
            })}
          </g>
        )}

        {/* Render City Stop Pins */}
        {stopPoints.map(stop => {
          const pos = mapCoordsToSvg(stop.lat, stop.lng);
          const isSelected = activeStopId === stop.id;

          return (
            <g
              key={stop.id}
              onClick={() => onSelectStop && onSelectStop(stop)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={`${pos.x}%`}
                cy={`${pos.y}%`}
                r={isSelected ? 18 : 12}
                fill={isSelected ? 'var(--primary)' : 'var(--accent-champagne)'}
                opacity="0.25"
              />
              <circle
                cx={`${pos.x}%`}
                cy={`${pos.y}%`}
                r={isSelected ? 9 : 7}
                fill="var(--primary)"
                stroke="#FFFFFF"
                strokeWidth="2"
                filter="url(#markerGlow)"
              />
              <text
                x={`${pos.x}%`}
                y={`${pos.y - 14}%`}
                textAnchor="middle"
                fill="var(--text-primary)"
                fontSize="11"
                fontWeight="800"
                fontFamily="Outfit, sans-serif"
              >
                {stop.cityName} ({stop.index})
              </text>
            </g>
          );
        })}

        {/* Render Place Category Markers (Hotels, Dining, Culture) */}
        {cityMarkers.map(m => {
          const pos = mapCoordsToSvg(m.lat, m.lng);
          const isHighlighted = activeMarkerId === m.id;

          const markerColor =
            m.category === 'Hotel' ? '#4A7C74' :
            m.category === 'Dining' ? '#C49A5A' :
            m.category === 'Culture' ? '#72775F' : '#B86F52';

          return (
            <g
              key={m.id}
              onClick={() => setActiveMarkerId(m.id)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={`${pos.x}%`}
                cy={`${pos.y}%`}
                r={isHighlighted ? 7 : 5}
                fill={markerColor}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            </g>
          );
        })}
      </svg>

      {/* Selected Marker Detail Card Floating Overlay */}
      {activeMarker && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          maxWidth: '300px',
          width: 'calc(100% - 32px)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          boxShadow: 'var(--shadow-subtle)',
          zIndex: 30,
          pointerEvents: 'auto'
        }} className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            {activeMarker.coverImage && (
              <img
                src={activeMarker.coverImage}
                alt={activeMarker.name}
                style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
              />
            )}
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                {activeMarker.category} • Day {activeMarker.dayIndex || 1}
              </span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.1rem 0' }}>
                {activeMarker.name}
              </h4>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {activeMarker.description}
              </div>
              {activeMarker.cost !== undefined && (
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-teal)', marginTop: '0.3rem' }}>
                  ${activeMarker.cost} <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>[Estimated]</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setActiveMarkerId(null)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Bottom Spatial Info Strip */}
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
        <span>Click any pin to inspect location details</span>
      </div>

    </div>
  );
};
