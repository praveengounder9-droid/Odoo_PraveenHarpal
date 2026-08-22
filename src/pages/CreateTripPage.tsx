import React, { useState } from 'react';
import { Calendar, DollarSign, Compass, CheckCircle2 } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

interface CreateTripPageProps {
  setActiveTab: (tab: string) => void;
}

export const CreateTripPage: React.FC<CreateTripPageProps> = ({ setActiveTab }) => {
  const { user } = useAuth();
  const { createTrip } = useTrips();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-15');
  const [estimatedBudget, setEstimatedBudget] = useState(2500);
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80');
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const sampleCoverImages = [
    { label: 'Tropical Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Historic Europe', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
    { label: 'Asian Metropolis', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80' },
    { label: 'Mountain Retreat', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Trip name is required.';
    if (!startDate) newErrors.startDate = 'Start date is required.';
    if (!endDate) newErrors.endDate = 'End date is required.';
    if (startDate > endDate) newErrors.endDate = 'End date must be after start date.';
    if (estimatedBudget <= 0) newErrors.budget = 'Please enter a valid estimated budget.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await createTrip({
        userId: user?.id || 'usr-rahul',
        name,
        description,
        startDate,
        endDate,
        estimatedBudget: Number(estimatedBudget),
        coverImage,
        status: 'planning',
        isPublic: false,
      });

      setActiveTab('builder');
    } catch (err) {
      console.error('Failed to create trip', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)' }}>Plan a New Journey</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Fill in the trip parameters to launch your multi-city itinerary builder.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', background: 'var(--bg-card)' }}>
        <div style={{
          position: 'relative',
          height: '190px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          marginBottom: '2rem',
          border: '1px solid var(--border-color)'
        }}>
          <img src={coverImage} alt="Cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(31, 26, 23, 0.85), transparent 60%)',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '1.25rem'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#E6E1D7', fontWeight: 600, textTransform: 'uppercase' }}>Cover Preview</span>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'Playfair Display, Georgia, serif', color: '#FFFFFF' }}>{name || 'Your Trip Title'}</h3>
            </div>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Select Cover Image</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            {sampleCoverImages.map((img, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setCoverImage(img.url)}
                style={{
                  position: 'relative',
                  height: '75px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  border: coverImage === img.url ? '2px solid var(--primary)' : '1px solid var(--border-color)'
                }}
              >
                <img src={img.url} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {coverImage === img.url && (
                  <div style={{ position: 'absolute', top: '4px', right: '4px', color: 'var(--primary)' }}>
                    <CheckCircle2 size={16} fill="#FFFFFF" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Trip Name"
          type="text"
          placeholder="e.g. Autumn in Japan & South Korea"
          value={name}
          onChange={e => setName(e.target.value)}
          error={errors.name}
          icon={<Compass size={17} />}
        />

        <div className="form-group">
          <label className="form-label">Trip Description (Optional)</label>
          <textarea
            className="input-field"
            rows={3}
            placeholder="Brief notes on what you want to experience or achieve during this trip..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            error={errors.startDate}
            icon={<Calendar size={17} />}
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            error={errors.endDate}
            icon={<Calendar size={17} />}
          />
        </div>

        <Input
          label="Estimated Total Budget (USD)"
          type="number"
          placeholder="2500"
          value={estimatedBudget}
          onChange={e => setEstimatedBudget(Number(e.target.value))}
          error={errors.budget}
          icon={<DollarSign size={17} />}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setActiveTab('my-trips')}
          >
            Cancel
          </button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
          >
            Start Building Itinerary
          </Button>
        </div>

      </form>
    </div>
  );
};
