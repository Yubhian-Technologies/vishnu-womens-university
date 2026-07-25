import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Landmark, Mail, Zap, Droplets } from 'lucide-react';
import PageHero from '../../components/PageHero/PageHero';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { findCampusFacilityBySlug } from './campusFacilities.data';
import type { ContentBlockDoc } from '../Admin/sections/ContentBlocksAdmin';
import './tabbed-section.css';

// Shown until an admin adds real entries in Page Content Blocks — same
// fallback pattern used throughout this codebase (e.g. defaultTestimonials
// in Home.tsx). Reasonable starting content, not placeholder-looking filler.
const defaultBanksAtms: ContentBlockDoc[] = [
  { id: 'd1', page: 'other-facilities', section: 'banksAtms', value: '', title: 'Indian Bank', desc: 'A branch of Indian Bank runs exclusively for the students and employees of Vishnu Womens University.', icon: '', slug: '', order: 0 },
  { id: 'd2', page: 'other-facilities', section: 'banksAtms', value: '', title: 'ATM — Main Gate', desc: 'Located at the entrance of the Main Gate of the campus, for hassle-free banking needs.', icon: '', slug: '', order: 1 },
  { id: 'd3', page: 'other-facilities', section: 'banksAtms', value: '', title: 'ATM — Near Dental College', desc: 'A second ATM located near the Dental College, meeting the banking needs of the campus community.', icon: '', slug: '', order: 2 },
];

const defaultPostOffice: ContentBlockDoc[] = [
  { id: 'd1', page: 'other-facilities', section: 'postOffice', value: '', title: 'Campus Post Office Access', desc: 'A post office is accessible near campus for courier, parcel, and mail services, supporting students and staff throughout the academic year.', icon: '', slug: '', order: 0 },
];

const defaultPowerBackup: ContentBlockDoc[] = [
  { id: 'd1', page: 'other-facilities', section: 'powerBackup', value: '', title: 'Diesel Generator Backup', desc: 'High-capacity diesel generators automatically supply power to classrooms, labs, and hostels during outages, ensuring uninterrupted academic activity.', icon: '', slug: '', order: 0 },
  { id: 'd2', page: 'other-facilities', section: 'powerBackup', value: '', title: 'UPS for Critical Systems', desc: 'Dedicated UPS backup protects labs, servers, and other sensitive equipment against sudden power fluctuations.', icon: '', slug: '', order: 1 },
];

const defaultMineralWaterPlant: ContentBlockDoc[] = [
  { id: 'd1', page: 'other-facilities', section: 'mineralWaterPlant', value: '', title: 'RO Water Purification', desc: 'A campus-wide reverse osmosis (RO) water plant supplies clean, purified drinking water to classrooms, hostels, and common areas.', icon: '', slug: '', order: 0 },
];

type TabId = 'banks' | 'post' | 'power' | 'water';

const TABS: { id: TabId; label: string }[] = [
  { id: 'banks', label: 'Banks & ATMs' },
  { id: 'post', label: 'Post Office' },
  { id: 'power', label: 'Power Backup' },
  { id: 'water', label: 'Mineral Water Plant' },
];

const hashToTab: Record<string, TabId> = {
  '#banks': 'banks',
  '#post': 'post',
  '#power': 'power',
  '#water': 'water',
};

const TAB_ICONS: Record<TabId, typeof Landmark> = {
  banks: Landmark,
  post: Mail,
  power: Zap,
  water: Droplets,
};

const TAB_INTROS: Record<TabId, string> = {
  banks: 'Since the campus is home to more than ten thousand students and employees, banking is available directly on campus.',
  post: 'Postal and courier services available for the campus community.',
  power: 'Backup power systems that keep the campus running during outages.',
  water: 'Clean drinking water infrastructure serving the whole campus.',
};

export default function OtherFacilities() {
  const facility = findCampusFacilityBySlug('other-facilities');
  const [activeTab, setActiveTab] = useState<TabId>('banks');
  const location = useLocation();

  const liveBanksAtms = useContentBlocks('other-facilities', 'banksAtms');
  const banksAtms = liveBanksAtms.length > 0 ? liveBanksAtms : defaultBanksAtms;
  const livePostOffice = useContentBlocks('other-facilities', 'postOffice');
  const postOffice = livePostOffice.length > 0 ? livePostOffice : defaultPostOffice;
  const livePowerBackup = useContentBlocks('other-facilities', 'powerBackup');
  const powerBackup = livePowerBackup.length > 0 ? livePowerBackup : defaultPowerBackup;
  const liveMineralWaterPlant = useContentBlocks('other-facilities', 'mineralWaterPlant');
  const mineralWaterPlant = liveMineralWaterPlant.length > 0 ? liveMineralWaterPlant : defaultMineralWaterPlant;

  const tabContent: Record<TabId, ContentBlockDoc[]> = {
    banks: banksAtms,
    post: postOffice,
    power: powerBackup,
    water: mineralWaterPlant,
  };

  useEffect(() => {
    document.title = 'Other Facilities | Campus Life | VWU';
  }, []);

  useEffect(() => {
    const tab = hashToTab[location.hash];
    if (tab) setActiveTab(tab);
  }, [location.hash]);

  if (!facility) return null;

  const Icon = TAB_ICONS[activeTab];
  const activeLabel = TABS.find((t) => t.id === activeTab)?.label ?? '';

  return (
    <main className="page-wrapper">
      <PageHero
        page="campus-other-facilities"
        defaultImage="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
        defaultTitle={facility.title}
        defaultSubtitle={facility.desc}
        breadcrumb={[
          { label: 'Home', to: '/' },
          { label: 'Campus Life', to: '/campus' },
          { label: facility.title },
        ]}
      />

      <section className="section bg-white">
        <div className="container">
          <div className="section-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`section-tab-btn${activeTab === tab.id ? ' active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>{activeLabel}</h2>
          <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-8)', maxWidth: 680 }}>
            {TAB_INTROS[activeTab]}
          </p>
          <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
            {tabContent[activeTab].map((item) => (
              <div key={item.id} style={{ background: 'var(--color-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                <Icon size={32} strokeWidth={1.75} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{item.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>
            Explore More of Campus Life
          </h2>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/campus" className="btn btn-accent">Back to Campus Life</Link>
            <Link to="/student-life" className="btn btn-secondary">Student Life</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
