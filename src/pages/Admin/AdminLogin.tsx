import { useEffect, useState } from 'react';
import { getFirebaseAuth } from '../../lib/firebaseAdmin';
import { listDepartments } from '../../lib/rbac';
import './Admin.css';

const STATIC_DEPARTMENTS = ['Admin'];

interface Props {
  /** Set by the parent once it's determined the signed-in account doesn't
   *  match the department this form submitted under (see AdminLayout —
   *  it owns this check so the error survives the auth-state transition
   *  instead of being lost when this component unmounts). */
  error: string;
  /** Called synchronously, right before sign-in is attempted, so the parent
   *  knows which department to validate the resulting account against. */
  onAttempt: (department: string) => void;
}

export default function AdminLogin({ error, onAttempt }: Props) {
  const [departments, setDepartments] = useState<string[]>(STATIC_DEPARTMENTS);
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // Bad-credentials errors never race the auth-state listener (sign-in
  // itself throws before `user` ever becomes truthy), so this one can stay
  // local — only the department-mismatch error needs to come from the
  // parent (see the `error` prop's doc comment).
  const [localError, setLocalError] = useState('');

  // Department-account options are read live from `department_users` — a
  // future department just needs one new Firestore document (see
  // src/lib/rbac.ts), never a change here.
  useEffect(() => {
    listDepartments().then((live) => {
      setDepartments([...STATIC_DEPARTMENTS, ...live.filter((d) => !STATIC_DEPARTMENTS.includes(d))]);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department) return;
    setLocalError('');
    setLoading(true);
    onAttempt(department);
    try {
      const [{ signInWithEmailAndPassword }, auth] = await Promise.all([
        import('firebase/auth'),
        getFirebaseAuth(),
      ]);
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      onAttempt('');
      setLocalError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fieldsEnabled = !!department;

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__logo">
          <span>🎓</span>
          <h1>VWU Admin</h1>
          <p>Vishnu Womens University — Content Management</p>
        </div>
        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="admin-field">
            <label>Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              autoFocus
            >
              <option value="" disabled>Select Department</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="admin-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@svecw.edu.in"
              required
              disabled={!fieldsEnabled}
            />
          </div>
          <div className="admin-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={!fieldsEnabled}
            />
          </div>
          {(localError || error) && <p className="admin-error">{localError || error}</p>}
          <button type="submit" className="admin-btn admin-btn--primary" disabled={loading || !fieldsEnabled}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
