import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Calendar, Compass, ArrowDown, Eye } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { citiesService } from '../services/api/citiesService';
import { activitiesService } from '../services/api/activitiesService';
import type { City, Activity } from '../types';
import { StopCard } from '../components/trips/StopCard';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';

interface ItineraryBuilderPageProps {
  setActiveTab: (tab: string) => void;
}

export const ItineraryBuilderPage: React.FC<ItineraryBuilderPageProps> = ({ setActiveTab }) => {
  const { 
    activeTrip, 
    addStopToTrip, 
    removeStopFromTrip, 
    reorderTripStops, 
    addActivityToStop, 
    removeActivityFromStop 
  } = useTrips();

  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [stopStartDate, setStopStartDate] = useState<string>('2026-10-01');
  const [stopEndDate, setStopEndDate] = useState<string>('2026-10-05');
  const [showAddStopModal, setShowAddStopModal] = useState<boolean>(false);

  const [showAddActivityModal, setShowAddActivityModal] = useState<boolean>(false);
  const [targetStopId, setTargetStopId] = useState<string>('');
  const [cityActivities, setCityActivities] = useState<Activity[]>([]);
  
  const [actName, setActName] = useState('');
  const [actCategory, setActCategory] = useState<'Sightseeing' | 'Food' | 'Adventure' | 'Culture' | 'Entertainment'>('Sightseeing');
  const [actTime, setActTime] = useState('10:00 AM');
  const [actDuration, setActDuration] = useState(2);
  const [actCost, setActCost] = useState(30);

  useEffect(() => {
    citiesService.getCities().then(res => {
      setAvailableCities(res);
      if (res.length > 0) setSelectedCityId(res[0].id);
    });
  }, []);

  if (!activeTrip) {
    return (
      <EmptyState
        icon={<Compass size={30} />}
        title="No active trip selected"
        description="Please create a trip or select an existing trip to begin building your itinerary."
        action={
          <button onClick={() => setActiveTab('create-trip')} className="btn btn-primary">
            <Plus size={17} />
            <span>Create New Trip</span>
          </button>
        }
      />
    );
  }

  const handleAddStopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCityId) return;
    await addStopToTrip(activeTrip.id, selectedCityId, stopStartDate, stopEndDate);
    setShowAddStopModal(false);
  };

  const handleMoveStop = async (stopIndex: number, direction: 'up' | 'down') => {
    const newStops = [...activeTrip.stops];
    const targetIndex = direction === 'up' ? stopIndex - 1 : stopIndex + 1;
    if (targetIndex < 0 || targetIndex >= newStops.length) return;

    const temp = newStops[stopIndex];
    newStops[stopIndex] = newStops[targetIndex];
    newStops[targetIndex] = temp;

    const stopIdsInOrder = newStops.map(s => s.id);
    await reorderTripStops(activeTrip.id, stopIdsInOrder);
  };

  const openActivityModal = (stopId: string) => {
    setTargetStopId(stopId);
    const stop = activeTrip.stops.find(s => s.id === stopId);
    if (stop) {
      activitiesService.getActivities(stop.cityId).then(acts => setCityActivities(acts));
    }
    setShowAddActivityModal(true);
  };

  const handleAddCatalogActivity = async (act: Activity) => {
    if (!targetStopId) return;
    await addActivityToStop(activeTrip.id, targetStopId, {
      activityId: act.id,
      name: act.name,
      category: act.category,
      startTime: '10:00 AM',
      durationHours: act.durationHours,
      cost: act.cost,
      description: act.description,
      coverImage: act.coverImage,
    });
    setShowAddActivityModal(false);
  };

  const handleAddCustomActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStopId || !actName.trim()) return;
    await addActivityToStop(activeTrip.id, targetStopId, {
      name: actName,
      category: actCategory,
      startTime: actTime,
      durationHours: Number(actDuration),
      cost: Number(actCost),
    });
    setShowAddActivityModal(false);
    setActName('');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <span className="badge badge-primary">{activeTrip.status}</span>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{activeTrip.startDate} → {activeTrip.endDate}</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)' }}>{activeTrip.name}</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => setShowAddStopModal(true)} className="btn btn-primary">
            <Plus size={17} />
            <span>Add City Stop</span>
          </button>
          <button onClick={() => setActiveTab('itinerary-view')} className="btn btn-secondary">
            <Eye size={17} />
            <span>View Full Itinerary</span>
          </button>
        </div>
      </div>

      {/* Connected Journey Sequence Pathway */}
      <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
        <h4 style={{ fontSize: '0.825rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', fontWeight: 700 }}>
          Connected Journey Route
        </h4>

        {activeTrip.stops.length === 0 ? (
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            No stops added yet. Add your first destination below to start building your route!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {activeTrip.stops.map((stop, idx) => (
              <React.Fragment key={stop.id}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                    {idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      {stop.cityName}, {stop.country}
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                      {stop.startDate} → {stop.endDate} • {stop.activities.length} Activities planned
                    </div>
                  </div>
                </div>
                {idx < activeTrip.stops.length - 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '0.1rem 0' }}>
                    <ArrowDown size={18} style={{ color: 'var(--primary)' }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Detailed City Stop Cards */}
      <div>
        {activeTrip.stops.length === 0 ? (
          <EmptyState
            icon={<MapPin size={30} />}
            title="Your trip itinerary is empty"
            description="Start building your multi-city journey by adding destination stops and assigning activities to each city."
            action={
              <button onClick={() => setShowAddStopModal(true)} className="btn btn-primary">
                <Plus size={17} />
                <span>Add First City Stop</span>
              </button>
            }
          />
        ) : (
          <div>
            {activeTrip.stops.map((stop, idx) => (
              <StopCard
                key={stop.id}
                stop={stop}
                index={idx}
                totalStops={activeTrip.stops.length}
                onRemoveStop={stopId => removeStopFromTrip(activeTrip.id, stopId)}
                onMoveUp={() => handleMoveStop(idx, 'up')}
                onMoveDown={() => handleMoveStop(idx, 'down')}
                onAddActivity={openActivityModal}
                onRemoveActivity={(stopId, actId) => removeActivityFromStop(activeTrip.id, stopId, actId)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Stop Modal */}
      <Modal
        isOpen={showAddStopModal}
        onClose={() => setShowAddStopModal(false)}
        title="Add City Stop to Itinerary"
      >
        <form onSubmit={handleAddStopSubmit}>
          <div className="form-group">
            <label className="form-label">Select Destination City</label>
            <select
              className="input-field"
              value={selectedCityId}
              onChange={e => setSelectedCityId(e.target.value)}
            >
              {availableCities.map(city => (
                <option key={city.id} value={city.id} style={{ background: '#FFFFFF', color: '#1F1A17' }}>
                  {city.name}, {city.country} ({city.costIndex} Cost Level)
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Stop Start Date"
              type="date"
              value={stopStartDate}
              onChange={e => setStopStartDate(e.target.value)}
              icon={<Calendar size={17} />}
            />
            <Input
              label="Stop End Date"
              type="date"
              value={stopEndDate}
              onChange={e => setStopEndDate(e.target.value)}
              icon={<Calendar size={17} />}
            />
          </div>

          <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '1rem' }}>
            Add Stop to Trip
          </Button>
        </form>
      </Modal>

      {/* Add Activity Modal */}
      <Modal
        isOpen={showAddActivityModal}
        onClose={() => setShowAddActivityModal(false)}
        title="Add Activity to Stop"
      >
        <div>
          {cityActivities.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 600 }}>
                Recommended City Experiences
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                {cityActivities.map(act => (
                  <div
                    key={act.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      background: 'var(--bg-input)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{act.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>${act.cost} • {act.durationHours}h</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddCatalogActivity(act)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleAddCustomActivity} style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 600 }}>
              Or Create Custom Activity
            </h4>
            <Input
              label="Activity Title"
              placeholder="e.g. Sunset Dinner at Cliffside Bistro"
              value={actName}
              onChange={e => setActName(e.target.value)}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="input-field"
                  value={actCategory}
                  onChange={e => setActCategory(e.target.value as any)}
                >
                  <option value="Sightseeing">Sightseeing</option>
                  <option value="Food">Food</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Culture">Culture</option>
                  <option value="Entertainment">Entertainment</option>
                </select>
              </div>
              <Input
                label="Start Time"
                type="text"
                placeholder="10:00 AM"
                value={actTime}
                onChange={e => setActTime(e.target.value)}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Input
                label="Duration (Hours)"
                type="number"
                value={actDuration}
                onChange={e => setActDuration(Number(e.target.value))}
              />
              <Input
                label="Estimated Cost ($)"
                type="number"
                value={actCost}
                onChange={e => setActCost(Number(e.target.value))}
              />
            </div>
            <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '1rem' }}>
              Add Custom Activity
            </Button>
          </form>
        </div>
      </Modal>

    </div>
  );
};
