import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wifi, Gauge, Cpu, Server, Cable, Network, ShieldCheck, BatteryCharging, Camera,
} from 'lucide-react';
import SEO from '../../components/SEO/SEO';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import { useSitePhotos } from '../../hooks/useSitePhotos';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import '../detail-layout.css';

const INFRASTRUCTURE: { icon: typeof Wifi; title: string; desc: string }[] = [
  { icon: Wifi, title: 'Campus-Wide Wi-Fi', desc: 'More than 300 RUCKUS Wi-Fi access points provide reliable connectivity across the campus, helping students and faculty access academic platforms, digital resources and online services from multiple locations.' },
  { icon: Gauge, title: 'High-Speed Internet', desc: 'The campus is supported by 1,530 Mbps of dedicated internet bandwidth, enabling fast and reliable access to online learning resources, research platforms and digital communication tools.' },
  { icon: Cpu, title: 'Advanced Computing Infrastructure', desc: 'More than 1,700 workstations, supported by Xeon-based rack servers, provide the computing resources required for academic work, research, projects and technology-enabled learning.' },
  { icon: Server, title: 'Reliable Server Infrastructure', desc: 'Enterprise-grade Lenovo servers provide a reliable and resilient computing environment for institutional applications, digital services and data management.' },
  { icon: Cable, title: 'High-Speed Fibre Network', desc: 'A 20-km fibre-optic backbone supports connectivity of up to 10 Gbps, enabling efficient data transmission and seamless communication across the campus network.' },
  { icon: Network, title: 'High-Performance Campus Network', desc: 'ARUBA enterprise network infrastructure supports scalable and efficient network connectivity, helping maintain reliable digital access across the University.' },
  { icon: ShieldCheck, title: 'Secure Campus Network', desc: 'Advanced SOPHOS firewall infrastructure helps protect the University’s network, systems and digital resources while supporting secure access for users.' },
  { icon: BatteryCharging, title: 'Reliable Power Support', desc: '320 KVA online UPS systems provide backup power for critical IT and network infrastructure, helping maintain continuity of essential digital services.' },
  { icon: Camera, title: 'Campus Security Infrastructure', desc: 'More than 700 CCTV cameras support round-the-clock campus surveillance and contribute to a secure environment for students, faculty and staff.' },
];

const defaultWifiPhotos = Array.from({ length: 5 }, (_, i) => ({
  src: PHOTO_NEEDED_PLACEHOLDER,
  alt: `Wi-Fi Enabled Campus at VWU — Photo ${i + 1}`,
  caption: '',
}));

export default function WifiCampus() {
  const photos = useSitePhotos('campus', 'wifi-campus', defaultWifiPhotos);

  useEffect(() => {
    document.title = 'Wi-Fi Enabled Campus | VWU';
  }, []);

  return (
    <main className="page-wrapper">
      <SEO
        title="Wi-Fi Enabled Campus | Vishnu Women's University"
        description="Seamless connectivity for learning, research and collaboration — campus-wide Wi-Fi, high-speed internet and advanced computing infrastructure at VWU."
        canonicalPath="/campus/wifi-campus"
      />

      <PageHero
        page="campus-wifi-campus"
        defaultTitle="Wi-Fi Enabled Campus"
        defaultSubtitle="Seamless Connectivity for Learning, Research and Collaboration"
        hideCta={true}
      />

      <section className="section bg-white">
        <div className="container">
          <div style={{ marginBottom: '4rem', maxWidth: 900 }}>
            <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
              Connected Campus for Learning and Research
            </h2>
            <div style={{ fontSize: '1.1rem', color: 'var(--color-text)', lineHeight: 1.7 }}>
              <p style={{ marginBottom: '1.5rem' }}>
                Vishnu Women&rsquo;s University provides a digitally enabled campus supported by high-speed
                internet, campus-wide Wi-Fi and advanced computing infrastructure. The University&rsquo;s digital
                ecosystem supports academic learning, research, communication and administrative services while
                enabling students and faculty to access digital resources and collaborate efficiently across the
                campus.
              </p>
              <p>
                With infrastructure capable of supporting <strong style={{ color: 'var(--color-primary)' }}>3,000+ computing devices</strong>,
                the campus provides a reliable and secure digital environment for students, faculty and staff.
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '4rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '2rem' }}>
              Digital Infrastructure and Key Facilities
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: '1.5rem' }}>
              {INFRASTRUCTURE.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  style={{ padding: '1.5rem', background: 'var(--color-off-white)', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}
                >
                  <span
                    style={{
                      width: 40, height: 40, borderRadius: '50%', marginBottom: '0.75rem',
                      background: 'var(--color-primary)', color: 'var(--color-accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Icon size={18} strokeWidth={2.2} />
                  </span>
                  <strong style={{ display: 'block', fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--color-heading)' }}>{title}</strong>
                  <span style={{ color: 'var(--color-text-light)', lineHeight: 1.6, display: 'block' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '4rem', maxWidth: 900 }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
              How Our Digital Campus Supports Students
            </h3>
            <div style={{ fontSize: '1.1rem', color: 'var(--color-text)', lineHeight: 1.7 }}>
              <p style={{ marginBottom: '1.5rem' }}>
                The University&rsquo;s digital infrastructure is designed to make technology an integral part of the
                learning experience. Campus-wide connectivity enables students to access learning platforms,
                digital libraries, academic resources and collaborative tools while supporting project work,
                research, presentations and technology-enabled classroom activities.
              </p>
              <p>
                Reliable connectivity also helps students and faculty communicate, collaborate and access academic
                resources beyond the classroom, creating a more connected and flexible learning environment.
              </p>
            </div>
          </div>

          <div
            style={{
              background: 'var(--color-off-white)', padding: '3rem', borderRadius: '12px',
              textAlign: 'center', maxWidth: '900px', margin: '0 auto',
            }}
          >
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
              A Connected and Future-Ready Campus
            </h3>
            <p style={{ fontSize: '1.15rem', color: 'var(--color-text)', lineHeight: 1.7, fontStyle: 'italic' }}>
              Together, high-speed connectivity, advanced computing resources, secure network infrastructure and
              reliable digital services create a resilient and future-ready campus. These facilities support
              students and faculty in accessing resources, collaborating effectively and participating in
              technology-driven learning and research.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-off-white">
        <div className="container">
          <PhotoGrid
            images={photos}
            title="Explore Our Digital Infrastructure"
            subtitle="Take a closer look at the technology and infrastructure that power our connected campus."
            columns={3}
            layout="default"
          />
        </div>
      </section>

      <section style={{ background: 'var(--color-primary)', padding: 'var(--space-14) 0' }}>
        <div className="container" style={{ textAlign: 'center', color: 'var(--color-white)' }}>
          <h2 style={{ color: 'var(--color-white)', marginBottom: 'var(--space-2)' }}>
            Explore More of Campus Life
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto var(--space-6)' }}>
            Discover the facilities, resources and experiences that support learning and student life at Vishnu
            Women&rsquo;s University.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/student-life" className="btn btn-secondary">Student Life</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
