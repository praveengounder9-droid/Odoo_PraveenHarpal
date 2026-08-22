import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronRight, Edit3 } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { EmptyState } from '../components/common/EmptyState';

interface CalendarTimelinePageProps {
  setActiveTab: (tab: string) => void;
}

export const CalendarTimelinePage: React.FC<CalendarTimelinePageProps> = ({ setActiveTab }) => {
  const { activeTrip } = useTrips();
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  if (!activeTrip) {
    return (
      <EmptyState
        icon={<CalendarIcon size={30} />}
        title="No active trip selected"
        description="Select a trip to view its visual chronological calendar and timeline."
        action={
          <button onClick={() => setActiveTab('my-trips')} className="btn btn-primary">
            View My Trips
          </button>
        }
      />
    );
  }

  let dayCounter = 1;
  const timelineDays: Array<{
    dayNumber: number;
    cityName: string;
    country: string;
    dateStr: string;
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

      timelineDays.push({
        dayNumber: dayCounter++,
        cityName: stop.cityName,
        country: stop.country,
        dateStr,
        activities: stop.activities.slice(d * 2, d * 2 + 2)
      });
    }
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>Visual Journey</span>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)' }}>{activeTrip.name} – Timeline</h2>
        </div>
        <button onClick={() => setActiveTab('builder')} className="btn btn-secondary">
          <Edit3 size={15} />
          <span>Quick Edit Schedule</span>
        </button>
      </div>

      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '14px',
          width: '3px',
          background: 'linear-gradient(to bottom, #B85B3D, #4A7C74, #D49B4B)',
          borderRadius: '2px'
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {timelineDays.map((day) => {
            const isExpanded = expandedDay === day.dayNumber;
            return (
              <div key={day.dayNumber} style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '-2rem',
                  top: '1.1rem',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: isExpanded ? 'var(--primary)' : '#FFFFFF',
                  border: '3px solid var(--primary)',
                  boxShadow: isExpanded ? '0 0 10px rgba(184, 91, 61, 0.4)' : 'none',
                  zIndex: 2,
                  transition: 'all 0.2s ease'
                }} />

                <div className="glass-card" style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', background: '#FFFFFF' }} onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary)' }}>
                        Day {day.dayNumber}
                      </span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {day.cityName}, {day.country}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{day.dateStr}</span>
                      <ChevronRight size={17} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease', color: 'var(--text-muted)' }} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {day.activities.length === 0 ? (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          No scheduled activities for this day. Free exploration in {day.cityName}.
                        </div>
                      ) : (
                        day.activities.map((act, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--bg-input)', borderRadius: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <Clock size={14} style={{ color: 'var(--primary)' }} />
                              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{act.startTime || '10:00 AM'} – {act.name}</span>
                            </div>
                            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-teal)' }}>${act.cost}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
