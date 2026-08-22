import React, { useState, useEffect, useRef } from 'react';
import { User as UserIcon, Mail, Bookmark, ShieldAlert, Trash2, Camera, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/api/profileService';
import { citiesService } from '../services/api/citiesService';
import type { City } from '../types';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';

export const ProfilePage: React.FC = () => {
  const { user, updateProfileState, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [currency, setCurrency] = useState(user?.preferences?.currency || 'USD');
  const [language, setLanguage] = useState(user?.preferences?.language || 'English');

  const [savedCities, setSavedCities] = useState<City[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio || '');
      setAvatarUrl(user.avatarUrl || '');
      setCurrency(user.preferences?.currency || 'USD');
      setLanguage(user.preferences?.language || 'English');
    }
  }, [user]);

  useEffect(() => {
    if (user?.savedCityIds && user.savedCityIds.length > 0) {
      citiesService.getCities().then(all => {
        const filtered = all.filter(c => user.savedCityIds.includes(c.id));
        setSavedCities(filtered);
      });
    } else {
      setSavedCities([]);
    }
  }, [user]);

  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setAvatarUrl(result);
          // Instantly trigger profile update with new avatar
          if (user) {
            const updated = { ...user, avatarUrl: result };
            updateProfileState(updated);
            profileService.updateProfile({ avatarUrl: result }).catch(console.error);
            setSuccessMsg('Profile picture updated successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await profileService.updateProfile({
        name,
        email,
        bio,
        avatarUrl,
        preferences: {
          currency,
          language,
          theme: user?.preferences?.theme || 'light'
        }
      });
      updateProfileState(updated);
      setSuccessMsg('Profile settings updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Hidden File Picker Input for PC/Gallery Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleAvatarFileSelect}
      />

      <div>
        <h2 style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)' }}>Account Settings & Preferences</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Manage your personal travel profile, upload profile photo, currency, language, and saved destinations.
        </p>
      </div>

      <form onSubmit={handleProfileSave} className="glass-panel" style={{ padding: '2rem', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          {/* Clickable Profile Photo Container with Upload Overlay */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: 'relative',
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              cursor: 'pointer',
              overflow: 'hidden',
              border: '3px solid var(--primary)',
              boxShadow: '0 4px 14px rgba(184, 111, 82, 0.2)'
            }}
            title="Click to upload new photo from gallery or PC"
          >
            <img
              src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt="Avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(31, 26, 23, 0.55)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              opacity: 0.85,
              transition: 'opacity 0.2s ease',
              fontSize: '0.7rem',
              fontWeight: 600,
              gap: '0.2rem'
            }}>
              <Camera size={18} />
              <span>Change</span>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.3rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)' }}>{name}</h3>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Role: {user?.role ? user.role.toUpperCase() : 'USER'}</span>
            <div style={{ marginTop: '0.6rem' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.8rem', gap: '0.4rem' }}
              >
                <Upload size={14} style={{ color: 'var(--primary)' }} />
                <span>Upload Photo from PC / Gallery</span>
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input
            label="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            icon={<UserIcon size={17} />}
          />
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            icon={<Mail size={17} />}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Traveler Bio</label>
          <textarea
            className="input-field"
            rows={3}
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Tell fellow travelers about your favorite destinations..."
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Preferred Currency</label>
            <select className="input-field" value={currency} onChange={e => setCurrency(e.target.value)}>
              <option value="USD" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>USD ($)</option>
              <option value="EUR" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>EUR (€)</option>
              <option value="GBP" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>GBP (£)</option>
              <option value="JPY" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>JPY (¥)</option>
              <option value="AUD" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>AUD ($)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Language Preference</label>
            <select className="input-field" value={language} onChange={e => setLanguage(e.target.value)}>
              <option value="English" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>English</option>
              <option value="French" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>French</option>
              <option value="Spanish" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Spanish</option>
              <option value="Japanese" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Japanese</option>
              <option value="German" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>German</option>
            </select>
          </div>
        </div>

        {successMsg && (
          <div style={{ padding: '0.75rem', background: 'rgba(74, 124, 116, 0.1)', color: 'var(--accent-teal)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
            {successMsg}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <button type="button" onClick={() => setShowDeleteModal(true)} className="btn btn-danger btn-sm">
            <Trash2 size={15} /> Delete Account
          </button>

          <Button type="submit" variant="primary" isLoading={isSaving}>
            Save Changes
          </Button>
        </div>

      </form>

      <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
        <h3 style={{ fontSize: '1.2rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bookmark size={17} style={{ color: 'var(--accent-champagne)' }} />
          Saved Destinations ({savedCities.length})
        </h3>
        {savedCities.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No saved cities yet. Click the bookmark icon on any city card in Explore Cities to save it here.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {savedCities.map(c => (
              <div key={c.id} style={{ padding: '0.75rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src={c.coverImage} alt={c.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{c.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.country}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Account Deletion"
      >
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <ShieldAlert size={48} style={{ color: 'var(--accent-rose)', margin: '0 auto 1rem' }} />
          <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Are you sure you want to delete your account?
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            This action is permanent and will remove all your planned trips, itineraries, and preferences.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary">Cancel</button>
            <button onClick={logout} className="btn btn-danger">Confirm Delete</button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
