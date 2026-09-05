import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { SECTION_GROUPS, SECTIONS } from '../AdminLayout';
import {
  listAdminUsers, saveAdminUser, createAdminLogin, deleteAdminUser, ROLE_PRESETS,
  type AdminUserDoc, type AdminRole, type ModuleLevel,
} from '../../../lib/rbac';

const ROLE_LABELS: Record<AdminRole, string> = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  department: 'Departments Admin',
  placements: 'Placements Login',
  rnd: 'R&D Login',
  custom: 'Custom Role',
};

/** The role label to display for one admin user — a custom role shows its own admin-typed name instead of the generic "Custom Role". */
function roleLabelFor(u: Pick<AdminUserDoc, 'role' | 'roleName'>): string {
  return u.role === 'custom' && u.roleName?.trim() ? u.roleName : ROLE_LABELS[u.role];
}

const EMPTY: Omit<AdminUserDoc, 'id'> = { email: '', department: '', role: 'custom', roleName: '', active: true, modules: {}, resources: [] };

/**
 * Super Admin-only: manage who else can sign in to /admin and what they can
 * see/edit. Writes to the `department_users` Firestore collection (see
 * lib/rbac.ts) — an account here is just a permissions record, matched by
 * email to a Firebase Auth user that must already exist (create it in the
 * Firebase Console first, same email, then add it here).
 */
export default function UsersRolesAdmin() {
  const [users, setUsers] = useState<AdminUserDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const { docs: departments } = useOrderedCollection<{ id: string; title: string }>('departments', 'order');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<AdminUserDoc, 'id'>>(EMPTY);
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    listAdminUsers().then(setUsers).finally(() => setLoading(false));
  };
  useEffect(load, []);

  // Read/Write picked here is just what a preset's modules start as when
  // applied below — every module still has its own None/Read/Write select
  // further down, so this is a shortcut, not a separate permission level.
  const [presetLevel, setPresetLevel] = useState<ModuleLevel>('write');

  const applyPreset = (role: AdminRole, level: ModuleLevel = presetLevel) => {
    const preset = ROLE_PRESETS.find((p) => p.role === role);
    const modules: Record<string, ModuleLevel> = {};
    (preset?.modules || []).forEach((id) => { modules[id] = level; });
    setForm((f) => ({ ...f, role, modules }));
  };

  const setModuleLevel = (id: string, level: ModuleLevel | 'none') => {
    setForm((f) => {
      const modules = { ...f.modules };
      if (level === 'none') delete modules[id];
      else modules[id] = level;
      return { ...f, modules };
    });
  };

  const edit = (u: AdminUserDoc) => {
    setEditingId(u.id);
    setForm({ email: u.email, department: u.department, role: u.role, roleName: u.roleName || '', active: u.active, modules: u.modules, resources: u.resources });
    setPassword('');
  };

  const save = async () => {
    const email = form.email.trim().toLowerCase();
    if (!email) return alert('Email is required.');
    if (!editingId && password.length < 6) return alert('Set a password of at least 6 characters for this new login.');
    setSaving(true);
    try {
      if (editingId) {
        await saveAdminUser(editingId, { ...form, email });
      } else {
        // Creates the actual Firebase Auth sign-in too, not just the
        // permissions record — see createAdminLogin in lib/rbac.ts.
        await createAdminLogin(email, password, { department: form.department, role: form.role, roleName: form.roleName, active: form.active, modules: form.modules, resources: form.resources });
      }
      setEditingId(null);
      setForm(EMPTY);
      setPassword('');
      load();
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (u: AdminUserDoc) => {
    if (!confirm(`Remove admin access for ${u.email}? Their Firebase Auth account itself is untouched — this only removes their permissions record, so they can no longer sign in to /admin.`)) return;
    await deleteAdminUser(u.id);
    load();
  };

  return (
    <div>
      <p className="admin-field__hint" style={{ marginBottom: '1rem' }}>
        Super Admin (you) has every module plus this page. A Firebase Auth account with no record here also falls
        back to unrestricted Super Admin — add a record only for accounts that should be limited. Adding a new user
        below creates their actual sign-in too — give them the email and password you set here.
      </p>

      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <h2 className="admin-card__title">{editingId ? 'Edit Admin User' : 'Add Admin User'}</h2>
        <div className="admin-field">
          <label>Email</label>
          <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="placements@vishnu.edu.in" disabled={!!editingId} />
        </div>
        {!editingId && (
          <div className="admin-field">
            <label>Password (min. 6 characters — share this with them)</label>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Set a password for their sign-in" />
          </div>
        )}
        <div className="admin-field">
          <label>Role</label>
          <select value={form.role} onChange={(e) => applyPreset(e.target.value as AdminRole)}>
            {ROLE_PRESETS.map((p) => <option key={p.role} value={p.role}>{p.label}</option>)}
          </select>
        </div>
        {form.role === 'custom' && (
          <div className="admin-field">
            <label>Role Name (shown instead of "Custom Role")</label>
            <input value={form.roleName} onChange={(e) => setForm((f) => ({ ...f, roleName: e.target.value }))} placeholder="e.g. Department Placement Officer" />
          </div>
        )}
        {form.role !== 'admin' && (
          <div className="admin-field">
            <label>Default Access for This Role's Modules</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <input type="radio" name="preset-level" checked={presetLevel === 'read'} onChange={() => { setPresetLevel('read'); applyPreset(form.role, 'read'); }} />
                Read
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <input type="radio" name="preset-level" checked={presetLevel === 'write'} onChange={() => { setPresetLevel('write'); applyPreset(form.role, 'write'); }} />
                Write
              </label>
            </div>
            <p className="admin-field__hint">Sets every module below to this level at once — each can still be changed individually.</p>
          </div>
        )}
        {form.role !== 'admin' && (
          <div className="admin-field">
            <label>Department</label>
            <select value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}>
              <option value="">— None / not department-specific —</option>
              {departments.map((d) => <option key={d.id} value={d.title}>{d.title}</option>)}
            </select>
          </div>
        )}
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0.5rem 0' }}>
          <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
          Active (unchecking blocks sign-in without deleting the record)
        </label>

        {form.role !== 'admin' && (
          <>
            <h3 style={{ marginTop: '1rem' }}>Module Permissions</h3>
            <p className="admin-field__hint">Pick None / Read (view only) / Write per module. Unlisted modules stay hidden from this account.</p>
            {SECTION_GROUPS.map((group) => (
              <div key={group.label} style={{ marginBottom: '0.75rem' }}>
                <strong style={{ fontSize: '0.85rem' }}>{group.label}</strong>
                {group.ids.map((id) => {
                  const s = SECTIONS.find((sec) => sec.id === id);
                  if (!s || id === 'users-roles') return null;
                  const level = form.modules[id] ?? 'none';
                  return (
                    <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.2rem 0' }}>
                      <span style={{ flex: 1, fontSize: '0.85rem' }}><FontAwesomeIcon icon={s.icon} fixedWidth aria-hidden="true" /> {s.label}</span>
                      <select value={level} onChange={(e) => setModuleLevel(id, e.target.value as ModuleLevel | 'none')} style={{ width: 100 }}>
                        <option value="none">None</option>
                        <option value="read">Read</option>
                        <option value="write">Write</option>
                      </select>
                    </div>
                  );
                })}
              </div>
            ))}
          </>
        )}

        <div className="admin-form-actions">
          {editingId && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditingId(null); setForm(EMPTY); setPassword(''); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editingId ? 'Update' : 'Add User'}</button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Admin Users</h2>
        {loading ? <p>Loading…</p> : users.length === 0 ? (
          <p className="admin-field__hint">No scoped accounts yet — every other Firebase Auth user is Super Admin by default.</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Email</th><th>Role</th><th>Department</th><th>Modules</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{roleLabelFor(u)}</td>
                  <td>{u.department || '—'}</td>
                  <td>{Object.keys(u.modules).length}</td>
                  <td>{u.active ? 'Active' : 'Disabled'}</td>
                  <td>
                    <button className="admin-btn admin-btn--sm" onClick={() => edit(u)}>Edit</button>{' '}
                    <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(u)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
