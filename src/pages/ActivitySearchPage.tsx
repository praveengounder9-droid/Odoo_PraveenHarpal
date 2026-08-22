import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { activitiesService } from '../services/api/activitiesService';
import type { Activity } from '../types';
import { ActivityCard } from '../components/discovery/ActivityCard';
import { Input } from '../components/common/Input';
import { useTrips } from '../context/TripContext';

interface ActivitySearchPageProps {
  setActiveTab: (tab: string) => void;
}

export const ActivitySearchPage: React.FC<ActivitySearchPageProps> = ({ setActiveTab }) => {
  const { activeTrip, addActivityToStop } = useTrips();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    activitiesService.getActivities(undefined, selectedCategory, searchQuery).then(setActivities);
  }, [selectedCategory, searchQuery]);

  const handleAddActivity = async (activity: Activity) => {
    if (activeTrip && activeTrip.stops.length > 0) {
      const stop = activeTrip.stops[0];
      await addActivityToStop(activeTrip.id, stop.id, {
        activityId: activity.id,
        name: activity.name,
        category: activity.category,
        startTime: '10:00 AM',
        durationHours: activity.durationHours,
        cost: activity.cost,
        description: activity.description,
        coverImage: activity.coverImage,
      });
      setActiveTab('builder');
    } else {
      setActiveTab('builder');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div>
        <h2 style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)' }}>Things to Do & Experience</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Browse curated sightseeing tours, culinary walks, adventure sports, and cultural shows.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {['All', 'Sightseeing', 'Food', 'Adventure', 'Culture', 'Entertainment'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-secondary)',
                background: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                boxShadow: selectedCategory === cat ? '0 2px 6px rgba(184, 91, 61, 0.2)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ width: '280px' }}>
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {activities.map(act => (
          <ActivityCard
            key={act.id}
            activity={act}
            onAdd={handleAddActivity}
          />
        ))}
      </div>

    </div>
  );
};
