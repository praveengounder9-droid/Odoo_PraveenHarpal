import React, { useState } from 'react';
import { Calendar, MapPin, Clock, List, LayoutGrid, Share2, Printer } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { EmptyState } from '../components/common/EmptyState';

interface ItineraryViewPageProps {
  setActiveTab: (tab: string) => void;
}

export const ItineraryViewPage: React.FC<ItineraryViewPageProps> = ({ setActiveTab }) => {
  const { activeTrip } = useTrips();
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');

  if (!activeTrip) {
    return (
      <EmptyState
        icon={<Calendar size={30} />}
        title="No active trip selected"
        description="Please select a trip to view its completed day-wise itinerary."
        action={
          <button onClick={() => setActiveTab('my-trips')} className="btn btn-primary">
            View My Trips
          </button>
        }
      />
    );
  }

  let dayCounter = 1;
  const dayWiseItinerary: Array<{
    dayNumber: number;
    dateStr: string;
    cityName: string;
    country: string;
    activities: any[];
  }> = [];

  activeTrip.stops.forEach(stop => {
    const start = new Date(stop.startDate);
    const end = new Date(stop.endDate);
    const diffTime = Math.max(1000 * 60 * 60 * 24, end.getTime() - start.getTime());
    const daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    for (let d = 0; d < daysCount; d++) {
      const curDate = new Date(start);
      curDate.setDate(curDate.getDate() + d);
      const dateStr = curDate.toISOString().split('T')[0];

      const dayActs = stop.activities.slice(d * 2, d * 2 + 2);

      dayWiseItinerary.push({
        dayNumber: dayCounter++,
        dateStr,
        cityName: stop.cityName,
        country: stop.country,
        activities: dayActs,
      });
    }
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <span className="badge badge-primary">{activeTrip.status}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activeTrip.startDate} → {activeTrip.endDate}</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)' }}>{activeTrip.name}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            {activeTrip.stops.length} Cities • {dayWiseItinerary.length} Total Days • ${activeTrip.estimatedBudget} Planned Budget
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', background: 'var(--bg-input)', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.825rem',
                fontWeight: 600,
                color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-muted)',
                background: viewMode === 'list' ? '#FFFFFF' : 'transparent',
                boxShadow: viewMode === 'list' ? '0 2px 6px rgba(0,0,0,0.04)' : 'none'
              }}
            >
              <List size={15} /> List View
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.825rem',
                fontWeight: 600,
                color: viewMode === 'timeline' ? 'var(--primary)' : 'var(--text-muted)',
                background: viewMode === 'timeline' ? '#FFFFFF' : 'transparent',
                boxShadow: viewMode === 'timeline' ? '0 2px 6px rgba(0,0,0,0.04)' : 'none'
              }}
            >
              <LayoutGrid size={15} /> Timeline View
            </button>
          </div>

          <button onClick={() => window.print()} className="btn btn-secondary btn-sm" title="Print itinerary">
            <Printer size={15} />
          </button>
          <button onClick={() => setActiveTab('shared')} className="btn btn-primary btn-sm">
            <Share2 size={15} /> Share Plan
          </button>
        </div>
      </div>

      {dayWiseItinerary.length === 0 ? (
        <EmptyState
          icon={<MapPin size={30} />}
          title="No city stops configured"
          description="Add city stops in the Itinerary Builder to generate your day-wise schedule."
          action={
            <button onClick={() => setActiveTab('builder')} className="btn btn-primary">
              Go to Itinerary Builder
            </button>
          }
        />
      ) : viewMode === 'list' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {dayWiseItinerary.map((day) => (
            <div key={day.dayNumber} className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'var(--primary)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem'
                  }}>
                    D{day.dayNumber}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)' }}>
                      Day {day.dayNumber} – {day.cityName}, {day.country}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{day.dateStr}</span>
                  </div>
                </div>

                <button onClick={() => setActiveTab('builder')} className="btn btn-secondary btn-sm">
                  Edit Day
                </button>
              </div>

              {day.activities.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                  Free exploration day in {day.cityName}. No fixed scheduled activities.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {day.activities.map((act, i) => (
                    <div
                      key={act.id || i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1.1rem',
                        background: 'var(--bg-input)',
                        borderRadius: 'var(--radius-sm)',
                        borderLeft: '4px solid var(--primary)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          color: 'var(--primary)',
                          minWidth: '75px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          <Clock size={13} /> {act.startTime || '10:00 AM'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                            {act.name}
                          </div>
                          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                            Category: {act.category} • Duration: {act.durationHours}h
                          </div>
                        </div>
                      </div>

                      <div style={{ fontWeight: 700, color: 'var(--accent-teal)', fontSize: '0.95rem' }}>
                        ${act.cost}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {dayWiseItinerary.map((day) => (
            <div key={day.dayNumber} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="badge badge-primary">Day {day.dayNumber}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{day.dateStr}</span>
              </div>
              <h4 style={{ fontSize: '1.1rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)' }}>{day.cityName}</h4>

              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                {day.activities.map((act, i) => (
                  <div key={act.id || i} style={{ padding: '0.6rem 0.8rem', background: 'var(--bg-input)', borderRadius: '6px', fontSize: '0.825rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{act.startTime || '10:00 AM'} – {act.name}</div>
                    <div style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>${act.cost} • {act.category}</div>
                  </div>
                ))}
                {day.activities.length === 0 && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Leisure Day</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
