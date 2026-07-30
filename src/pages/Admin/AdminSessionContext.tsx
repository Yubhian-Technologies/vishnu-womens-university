import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { resolveAdminSession, type AdminSession } from '../../lib/rbac';

const AdminSessionContext = createContext<AdminSession | null>(null);

/**
 * The signed-in admin/department user's permission session, resolved once
 * per sign-in and shared via context so every section under /admin can
 * check permissions without each one re-reading Firestore.
 */
export function useAdminSession(): AdminSession | null {
  return useContext(AdminSessionContext);
}

export default function AdminSessionProvider({ user, children }: { user: User; children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);

  useEffect(() => {
    let cancelled = false;
    setSession(null);
    resolveAdminSession(user).then((s) => {
      if (!cancelled) setSession(s);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!session) {
    return (
      <div className="admin-checking">
        <div className="admin-spinner" />
      </div>
    );
  }

  return <AdminSessionContext.Provider value={session}>{children}</AdminSessionContext.Provider>;
}
