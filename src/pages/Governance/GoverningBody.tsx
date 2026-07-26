import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import { useOrderedCollection } from '../../hooks/useCollection';
import SmoothImage from '../../components/SmoothImage/SmoothImage';
import PageHero from '../../components/PageHero/PageHero';
import type { GovernanceItemDoc } from '../Admin/sections/GovernanceItemsAdmin';
import './GoverningBody.css';

const DEFAULT_OVERVIEW = "The Governing Body of Shri Vishnu Engineering College for Women serves as the apex decision-making authority responsible for guiding the institution's vision, strategic planning, academic excellence, and overall development. Comprising representatives from the management, distinguished academicians, industry experts, university nominees, government officials, faculty members, and the Principal, the Governing Body ensures transparent governance, quality education, innovation, and continuous institutional growth while upholding the values and mission of the college.";

export interface GoverningBodyMember {
  id: string;
  name: string;
  position: string;
  category: string;
  photoUrl?: string;
  order: number;
}

export const defaultMembers: Omit<GoverningBodyMember, 'id'>[] = [
  { name: 'Sri K.V. Vishnu Raju', position: 'Chairman, SVES', category: 'Management', order: 1 },
  { name: 'Sri Ravichandran Rajagopal', position: 'Vice-Chancellor, SVES', category: 'Management', order: 2 },
  { name: 'Sri Aditya Vissam', position: 'Secretary, SVES', category: 'Management', order: 3 },
  { name: 'Sri K. Sai Sumant', position: 'Joint Secretary, SVES', category: 'Management', order: 4 },
  { name: 'Sri JVSSRD Prasada Raju', position: 'Director, SVES', category: 'Management', order: 5 },
  { name: 'Prof. P. Venkata Rama Raju', position: 'Vice-Principal, Vishnu Womens University', category: 'Teachers', order: 6 },
  { name: 'Dr. S.M. Padmaja', position: 'Professor & Head, EEE', category: 'Teachers', order: 7 },
  { name: 'Dr. U. Chandra Sekhar', position: 'WIPRO, Bengaluru', category: 'Educationalist / Industrialist', order: 8 },
  { name: 'Dr. Buddha Singh', position: 'JNU, New Delhi', category: 'UGC Nominee', order: 9 },
  { name: 'Mr. J. Satyanarayana Murthy', position: 'RJD, Technical Education', category: 'State Government', order: 10 },
  { name: 'Prof. GVR Prasada Raju', position: 'JNTUK, Kakinada', category: 'University Nominee', order: 11 },
  { name: 'Dr. G. Srinivasa Rao', position: 'Principal, Vishnu Womens University', category: 'Principal (Ex-Officio)', order: 12 },
];

function getInitials(name: string) {
  const cleaned = name.replace(/\b(Dr|Sri|Prof|Mr|Mrs|Ms)\.?\s*/gi, '');
  const parts = cleaned.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function MembersTiles() {
  const { docs, loading } = useOrderedCollection<GoverningBodyMember>('governingBody', 'order');
  const members = !loading && docs.length > 0 ? docs : defaultMembers;

  return (
    <div className="gb-tiles">
      {members.map((member, i) => (
        <motion.div
          className="gb-tile"
          key={member.name}
          initial={{ opacity: 0, y: 28, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: (i % 12) * 0.06, ease: 'easeOut' }}
          whileHover={{ y: -8, transition: { duration: 0.25 } }}
        >
          {member.photoUrl ? (
            <SmoothImage src={member.photoUrl} alt={member.name} className="gb-tile__photo" />
          ) : (
            <div className="gb-tile__avatar">{getInitials(member.name)}</div>
          )}
          <h3 className="gb-tile__name">{member.name}</h3>
          <p className="gb-tile__position">{member.position}</p>
          <span className="gb-tile__category">{member.category}</span>
        </motion.div>
      ))}
    </div>
  );
}

export default function GoverningBody() {
  // The "Governing Body" entry in the Governance/Committees/IQAC admin
  // (slug "governing-body") only ever powers this Overview text — its
  // Members Table field is unused, since the real member list below comes
  // from the separate `governingBody` collection/admin (with photos).
  const { docs: govItems } = useOrderedCollection<GovernanceItemDoc>('governanceItems', 'order');
  const overviewItem = govItems.find((i) => i.slug === 'governing-body');
  const overviewText = [overviewItem?.intro, overviewItem?.about].filter(Boolean).join(' ') || DEFAULT_OVERVIEW;

  useEffect(() => {
    document.title = 'Governing Body | Vishnu Womens University';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            setTimeout(() => el.classList.add('revealed'), parseInt(el.dataset.delay || '0'));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-wrapper governing-body-page">
      {/* Hero */}
      <PageHero
        page="governing-body"
        defaultImage="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=60&auto=format"
        defaultTitle="Governing Body"
        defaultSubtitle="Dedicated leaders and distinguished members committed to academic excellence, institutional governance, innovation, and the continuous growth of Shri Vishnu Engineering College for Women."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Governance', to: '/governance' }, { label: 'Governing Body' }]}
      />

      {/* Overview */}
      <section className="section gb-overview">
        <div className="container">
          <div className="gb-overview__grid reveal">
            <div className="gb-overview__inner">
              <span className="gb-label">Overview</span>
              <h2 className="gb-overview__title">Overview</h2>
              <p>{overviewText}</p>
              {overviewItem?.highlights && overviewItem.highlights.length > 0 && (
                <ul style={{ marginTop: 'var(--space-4)', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {overviewItem.highlights.map((h) => (
                    <li key={h} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6 }}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="gb-overview__placeholder">
              <ImageIcon size={40} strokeWidth={1.5} />
              <span>Image Placeholder</span>
            </div>
          </div>
        </div>
      </section>

      {/* Members */}
      <section className="section gb-members">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="gb-label">Members</span>
            <h2 className="gb-overview__title">Governing Body Members</h2>
            <p className="gb-members__subtitle">
              Meet the leaders steering VWU's institutional vision and governance.
            </p>
          </div>
          <MembersTiles />
        </div>
      </section>
    </main>
  );
}
