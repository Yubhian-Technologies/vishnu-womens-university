import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import CampusFacilitiesNav from './CampusFacilitiesNav';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import { findCampusFacilityBySlug } from './campusFacilities.data';
import '../detail-layout.css';
import './tabbed-section.css';

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

const TAB_PARAGRAPHS: Record<TabId, string[]> = {
  banks: [
    'Bank services are very important for the modern society. Since the campus is huge and team with more than ten thousand students and employees, it need to meet lots of banking transactions.',
    'Indian Bank was exclusively runs for the students and employees of SVES.',
    'Apart from it, there are two ATMs. One of which is located at the entrance of the Main Gate of the campus and another near the Dental College in order to meet their banking needs hassle free.',
  ],
  post: [
    'From the time immemorial, communication has been the integral part of everyday life. The post office at Bhimavaram campus is always at the disposal of everyone and provides best services.',
    'In addition, Courier service is one more advantage in providing prompt service for one and all in the campus.',
  ],
  power: [
    'In Vishnu educational society there is a great power backup for helping to all seven institutions. Power backup’s service needs for uninterruptable power supply. This is certified and offer fully warranted installations and give technical support to all institutions.',
    'With increasing power crisis in the state, and resources getting scarcer by the day, power cuts can only be expected to increase in frequency. However, SVECW cannot put student’s lives on pause every time the power goes off. Therefore, SVECW procured generators to provide the necessary electricity backup and ensure that work goes on smoothly in the campus.',
    'SVECW facilities typically have backup generators onsite to supply electricity in the case of a power failure. Diesel standby generators uniquely start automatically within 60 seconds of a power outage, helping to protect critical data, security and communications systems.',
  ],
  water: [
    'Water is the elixir of life which rejuvenates biological system in the body for better functioning. Now-a-days water is being polluted and the fact is that there are many water-borne diseases which are contagious in nature and spread quickly. Purified water is the solution for it.',
    'The mineral water plant provides plenty of purified water continuously to hostlers, colleges and everyone in the campus. The free of cost purified water is hygienic, packaged and is daily transported in a minivan to every place in the campus.',
    'Aqua Vishnu mineral water plant was set up in the campus and uses the Domestic RO System. Aqua Vishnu brings the water in its purest and safest form in through an effective and five-stage purification process. In addition, SVECW maintain an exclusive team of Administration staff to look after the water plant regularly, through which the College is assuring the safe water to all our students and staff.',
  ],
};

export default function OtherFacilities() {
  const facility = findCampusFacilityBySlug('other-facilities');
  const [activeTab, setActiveTab] = useState<TabId>('banks');
  const location = useLocation();

  const defaultPhotos = Array.from({ length: 5 }, (_, i) => ({
    src: PHOTO_NEEDED_PLACEHOLDER,
    alt: `Other Facilities — Photo ${i + 1}`,
    caption: '',
  }));
  const photos = useSitePhotos('campus', 'other-facilities', defaultPhotos);

  useEffect(() => {
    document.title = 'Other Facilities | Campus Life | VWU';
  }, []);

  useEffect(() => {
    const tab = hashToTab[location.hash];
    if (tab) setActiveTab(tab);
  }, [location.hash]);

  if (!facility) return null;

  const activeLabel = TABS.find((t) => t.id === activeTab)?.label ?? '';

  return (
    <main className="page-wrapper">
      <PageHero
        page="campus-other-facilities"
        defaultImage="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=60&auto=format"
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

          <div className="detail-grid">
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-6)' }}>{activeLabel}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 760 }}>
                {TAB_PARAGRAPHS[activeTab].map((para) => (
                  <p key={para} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75 }}>{para}</p>
                ))}
              </div>
            </div>

            <div className="detail-sidebar">
              <div style={{ position: 'sticky', top: 'calc(var(--topbar-height) + var(--header-height) + 1.5rem)' }}>
                <CampusFacilitiesNav activeSlug={facility.slug} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {photos.length > 0 && (
        <section className="section bg-off-white">
          <div className="container">
            <PhotoGrid
              images={photos}
              label={facility.title}
              title={`${facility.title} in Pictures`}
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

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
