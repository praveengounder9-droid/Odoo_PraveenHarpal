import React, { useState } from 'react';
import { Compass, Navigation, MapPin, Calendar, ArrowRight } from 'lucide-react';
import type { TripStop } from '../../types';
import { CinematicTravelMap } from '../map/CinematicTravelMap';

interface CinematicScrollExperienceProps {
  stops?: TripStop[];
  onPlanTrip: () => void;
  onExploreCities: () => void;
}

export const CinematicScrollExperience: React.FC<CinematicScrollExperienceProps> = ({
  stops = [],
  onPlanTrip,
  onExploreCities,
}) => {
  const [activeStage, setActiveStage] = useState<number>(1);

  const stages = [
    { id: 1, title: '1. Visualize Journey', subtitle: 'Spatial Map Overview', icon: <Compass size={16} /> },
    { id: 2, title: '2. Discover Cities', subtitle: 'Curated World Pins', icon: <MapPin size={16} /> },
    { id: 3, title: '3. Connect Routes', subtitle: 'Dynamic Per-User Path', icon: <Navigation size={16} /> },
    { id: 4, title: '4. Plan & Manage', subtitle: 'Itinerary & Budget', icon: <Calendar size={16} /> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Interactive Cinematic Stage Selector Navigation Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.75rem',
        background: 'var(--bg-subtle)',
        padding: '0.5rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)'
      }}>
        {stages.map(stage => {
          const isActive = activeStage === stage.id;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStage(stage.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: isActive ? 'var(--bg-card)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--border-color)' : '1px solid transparent',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? 'var(--shadow-subtle)' : 'none'
              }}
            >
              <div style={{
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center'
              }}>
                {stage.icon}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.825rem', lineHeight: 1.2 }}>{stage.title}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{stage.subtitle}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Spatial Map Canvas */}
      <div style={{ position: 'relative' }}>
        <CinematicTravelMap
          stops={stops}
          height="420px"
          selectedDay={activeStage === 3 ? 1 : null}
        />

        {/* Floating Story Stage Banner Overlay */}
        <div style={{
          position: 'absolute',
          top: '65px',
          left: '16px',
          maxWidth: '320px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-color)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-subtle)',
          pointerEvents: 'auto',
          zIndex: 25
        }} className="animate-fade-in">
          {activeStage === 1 && (
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Stage 1 • Vision
              </div>
              <h3 style={{ fontSize: '1.15rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Your Journey, Visualized
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Map your multi-city travels geographically across Europe, Asia, and the Americas on an interactive spatial canvas.
              </p>
              <button onClick={onPlanTrip} className="btn btn-primary btn-sm" style={{ marginTop: '0.85rem' }}>
                <span>Plan New Journey</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {activeStage === 2 && (
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-teal)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Stage 2 • Discovery
              </div>
              <h3 style={{ fontSize: '1.15rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Dream & Discover Pins
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Explore curated world city pins, inspect local daily costs, and add attractions directly into your itinerary.
              </p>
              <button onClick={onExploreCities} className="btn btn-secondary btn-sm" style={{ marginTop: '0.85rem' }}>
                <span>Explore All Cities</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {activeStage === 3 && (
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-champagne)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Stage 3 • Route Connections
              </div>
              <h3 style={{ fontSize: '1.15rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Dynamic Per-User Routes
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Animated route lines connect your active stops in sequence. Every user sees their own unique spatial path!
              </p>
            </div>
          )}

          {activeStage === 4 && (
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-olive)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Stage 4 • Spatial Planning
              </div>
              <h3 style={{ fontSize: '1.15rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                Synchronized Itinerary
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Filter itinerary stops by day or category. Selecting an activity smoothly focuses the map on that location.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
