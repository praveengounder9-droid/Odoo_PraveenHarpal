import React, { useState } from 'react';
import { Share2, Copy, Check, Globe } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { shareService } from '../services/api/shareService';
import { EmptyState } from '../components/common/EmptyState';

interface SharedItineraryPageProps {
  setActiveTab: (tab: string) => void;
}

export const SharedItineraryPage: React.FC<SharedItineraryPageProps> = ({ setActiveTab }) => {
  const { activeTrip, refreshTrips, setActiveTripId } = useTrips();
  const [copiedLink, setCopiedLink] = useState(false);
  const [isCopyingTrip, setIsCopyingTrip] = useState(false);
  const [copySuccessMsg, setCopySuccessMsg] = useState('');

  if (!activeTrip) {
    return (
      <EmptyState
        icon={<Share2 size={30} />}
        title="No trip selected to share"
        description="Select a trip to generate a public shareable URL or preview how others will see it."
        action={
          <button onClick={() => setActiveTab('my-trips')} className="btn btn-primary">
            View My Trips
          </button>
        }
      />
    );
  }

  const shareUrl = `${window.location.origin}/#share-${activeTrip.shareToken || activeTrip.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyTripToMyAccount = async () => {
    setIsCopyingTrip(true);
    try {
      const newTrip = await shareService.copyTripToUserAccount(activeTrip.id);
      await refreshTrips();
      setActiveTripId(newTrip.id);
      setCopySuccessMsg(`Trip successfully copied to your account as "${newTrip.name}"!`);
    } catch (err) {
      console.error('Failed to copy trip', err);
    } finally {
      setIsCopyingTrip(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      <div className="glass-panel" style={{ padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-teal)', fontWeight: 700, textTransform: 'uppercase' }}>Public Sharable View</span>
            <h2 style={{ fontSize: '1.75rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)' }}>Shareable Itinerary Link</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleCopyTripToMyAccount}
              className="btn btn-primary"
              disabled={isCopyingTrip}
            >
              <Copy size={15} />
              <span>{isCopyingTrip ? 'Copying...' : 'Copy Trip to My Account'}</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-input)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <Globe size={17} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <input
            type="text"
            readOnly
            value={shareUrl}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none' }}
          />
          <button onClick={handleCopyLink} className="btn btn-secondary btn-sm">
            {copiedLink ? <Check size={15} style={{ color: 'var(--accent-teal)' }} /> : <Copy size={15} />}
            <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
          </button>
        </div>

        {copySuccessMsg && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(74, 124, 116, 0.1)', border: '1px solid rgba(74, 124, 116, 0.25)', color: 'var(--accent-teal)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
            {copySuccessMsg}
          </div>
        )}
      </div>

      <div className="glass-card" style={{ padding: '2.5rem', overflow: 'hidden', background: '#FFFFFF' }}>
        
        <div style={{
          height: '240px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          position: 'relative',
          marginBottom: '2rem'
        }}>
          <img src={activeTrip.coverImage} alt={activeTrip.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(31, 26, 23, 0.9), transparent 50%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '2rem'
          }}>
            <span className="badge badge-success" style={{ width: 'fit-content', marginBottom: '0.5rem' }}>Verified Public Itinerary</span>
            <h1 style={{ fontSize: '2.2rem', fontFamily: 'Playfair Display, Georgia, serif', color: '#FFFFFF' }}>{activeTrip.name}</h1>
            <p style={{ color: '#E6E1D7', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              {activeTrip.description}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem', padding: '1rem 1.25rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Travel Dates</div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{activeTrip.startDate} → {activeTrip.endDate}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Destinations Count</div>
            <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>{activeTrip.stops.length} Cities</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Est. Total Budget</div>
            <div style={{ fontWeight: 700, color: 'var(--accent-gold)', fontSize: '0.95rem' }}>${activeTrip.estimatedBudget}</div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)', marginBottom: '1rem' }}>Destinations & Stops</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {activeTrip.stops.map((stop, idx) => (
              <div key={stop.id} style={{ padding: '1rem 1.25rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ background: 'var(--primary)', color: '#FFFFFF', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>#{idx + 1}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{stop.cityName}, {stop.country}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stop.startDate} → {stop.endDate}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-teal)', fontWeight: 600 }}>
                  {stop.activities.length} Planned Activities
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
