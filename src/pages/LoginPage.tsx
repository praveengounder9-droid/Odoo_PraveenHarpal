import React, { useState } from 'react';
import { Compass, Mail, Lock, User as UserIcon, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';

export const LoginPage: React.FC = () => {
  const { login, signup } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (isSignup && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setIsLoading(true);
    try {
      if (isSignup) {
        await signup(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (quickEmail: string) => {
    setIsLoading(true);
    try {
      await login(quickEmail, 'password123');
    } catch (err: any) {
      setError(err?.message || 'Quick login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail) {
      setForgotSuccess(true);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: 'var(--bg-dark)'
    }}>
      {/* Background Hero Image with Soft Warm Blur Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.15,
        filter: 'blur(2px)'
      }} />

      {/* Main Glass Card */}
      <div className="glass-panel" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '2.5rem 2rem',
        position: 'relative',
        zIndex: 10,
        background: 'var(--bg-card)',
        boxShadow: '0 20px 40px -10px rgba(31, 26, 23, 0.12)'
      }}>
        {/* Brand Icon */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.75rem', textAlign: 'center' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            marginBottom: '0.75rem',
            boxShadow: '0 4px 14px rgba(184, 111, 82, 0.25)'
          }}>
            <Compass size={30} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)' }}>GlobeTrotter</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            {isSignup ? 'Create your personal travel account' : 'Welcome back to your travel journal'}
          </p>
        </div>

        {/* Quick Demo Accounts Bar */}
        <div style={{ marginBottom: '1.5rem', padding: '0.85rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <UserCheck size={13} style={{ color: 'var(--primary)' }} /> Quick Multi-User Test Accounts:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('rahul@globetrotter.io')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', justifyContent: 'center' }}
            >
              User A (Rahul)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('priya@globetrotter.io')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', justifyContent: 'center' }}
            >
              User B (Priya)
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(201, 76, 76, 0.08)',
            border: '1px solid rgba(201, 76, 76, 0.2)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--accent-rose)',
            fontSize: '0.85rem',
            marginBottom: '1.2rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <Input
              label="Full Name"
              type="text"
              placeholder="Alex Morgan"
              value={name}
              onChange={e => setName(e.target.value)}
              icon={<UserIcon size={17} />}
            />
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="rahul@globetrotter.io"
            value={email}
            onChange={e => setEmail(e.target.value)}
            icon={<Mail size={17} />}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            icon={<Lock size={17} />}
          />

          {!isSignup && (
            <div style={{ textAlign: 'right', marginBottom: '1.2rem', marginTop: '-0.4rem' }}>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                style={{ color: 'var(--primary)', fontSize: '0.825rem', fontWeight: 600 }}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            <span>{isSignup ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight size={17} />
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px solid var(--border-color)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
            style={{ color: 'var(--primary)', fontWeight: 700, marginLeft: '0.25rem' }}
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>

      <Modal
        isOpen={showForgotModal}
        onClose={() => { setShowForgotModal(false); setForgotSuccess(false); }}
        title="Reset Your Password"
      >
        {forgotSuccess ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <p style={{ color: 'var(--accent-teal)', marginBottom: '1rem', fontWeight: 600 }}>
              Password reset link has been sent to {forgotEmail}!
            </p>
            <Button onClick={() => { setShowForgotModal(false); setForgotSuccess(false); }}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Enter your account email address and we will send you instructions to reset your password.
            </p>
            <Input
              label="Email Address"
              type="email"
              placeholder="rahul@globetrotter.io"
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              icon={<Mail size={17} />}
            />
            <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '1rem' }}>
              Send Reset Link
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
