import { useEffect, useState } from 'react';
import { getFirebaseAuth } from '../../lib/firebaseAdmin';
import { listRoleOptions, type RoleOption } from '../../lib/rbac';
import './Admin.css';

interface Props {
  /** Set by the parent once it's determined the signed-in account doesn't
   *  match the role this form submitted under (see AdminLayout — it owns
   *  this check so the error survives the auth-state transition instead of
   *  being lost when this component unmounts). */
  error: string;
  /** Called synchronously, right before sign-in is attempted, so the parent
   *  knows which role to validate the resulting account against. `label` is
   *  only for the error message if the check fails. */
  onAttempt: (role: string, label: string) => void;
}

export default function AdminLogin({ error, onAttempt }: Props) {
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // Bad-credentials errors never race the auth-state listener (sign-in
  // itself throws before `user` ever becomes truthy), so this one can stay
  // local — only the role-mismatch error needs to come from the parent (see
  // the `error` prop's doc comment).
  const [localError, setLocalError] = useState('');

  // The five fixed roles always show; any custom roles currently in use are
  // read live from `department_users` — a future custom role just needs one
  // new Firestore document (see src/lib/rbac.ts), never a change here.
  useEffect(() => {
    listRoleOptions().then(setRoleOptions);
  }, []);

  const mainRoles = roleOptions.filter((r) => r.group === 'main');
  const otherRoles = roleOptions.filter((r) => r.group === 'other');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setLocalError('');
    setLoading(true);
    const label = roleOptions.find((r) => r.value === role)?.label || role;
    onAttempt(role, label);
    try {
      const [{ signInWithEmailAndPassword }, auth] = await Promise.all([
        import('firebase/auth'),
        getFirebaseAuth(),
      ]);
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      onAttempt('', '');
      setLocalError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fieldsEnabled = !!role;

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
            <label htmlFor="field-role">Role</label>
            <select id="field-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              autoFocus
            >
              <option value="" disabled>Select Role</option>
              <optgroup label="Main Roles">
                {mainRoles.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </optgroup>
              {otherRoles.length > 0 && (
                <optgroup label="Others">
                  {otherRoles.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="field-email">Email</label>
            <input id="field-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@svecw.edu.in"
              required
              disabled={!fieldsEnabled}
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
              disabled={!fieldsEnabled}
            />
          </div>
          {(localError || error) && <p className="admin-error" role="alert">{localError || error}</p>}
          <button type="submit" className="admin-btn admin-btn--primary" disabled={loading || !fieldsEnabled}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
