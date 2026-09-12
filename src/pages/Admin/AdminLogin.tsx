import { useState } from 'react';
import { getFirebaseAuth } from '../../lib/firebaseAdmin';
import './Admin.css';

interface Props {
  /** Generic error passed from parent if needed */
  error?: string;
  /** Called synchronously, right before sign-in is attempted */
  onAttempt?: () => void;
}

export default function AdminLogin({ error, onAttempt }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);
    if (onAttempt) onAttempt();
    try {
      const [{ signInWithEmailAndPassword }, auth] = await Promise.all([
        import('firebase/auth'),
        getFirebaseAuth(),
      ]);
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setLocalError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__logo">
          <span aria-hidden="true">🎓</span>
          <h1>VWU Admin</h1>
          <p>Vishnu Women's University — Content Management</p>
        </div>
        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="admin-field">
            <label htmlFor="field-email">Email</label>
            <input id="field-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@vishnu.edu.in"
              required
              autoFocus
            />
          </div>
          <div className="admin-field">
            <label htmlFor="field-password">Password</label>
            <input id="field-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {(localError || error) && <p className="admin-error" role="alert">{localError || error}</p>}
          <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
