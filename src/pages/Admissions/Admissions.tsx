import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Admissions.css';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import AdmissionApplyForm from '../../components/AdmissionApplyForm/AdmissionApplyForm';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useContentBlocks, useEapcetCode } from '../../hooks/useContentBlocks';
import { useSitePhotos, useSectionHasPhotos } from '../../hooks/useSitePhotos';
import { useSiteContact, telHref } from '../../hooks/useSiteContact';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import type { FaqDoc } from '../Admin/sections/FaqAdmin';
import { ClipboardList, Users, Phone, Mail, MapPin, Sparkles, BarChart2 } from 'lucide-react';
import { resolveContentIcon } from '../../lib/contentIcons';
import { useHashScroll } from '../../hooks/useHashScroll';

interface RankAnalysisItem {
  code: string;
  course: string;
  collegeCode: 'VISW' | 'VISWPU';
  beginRank2026: string;
  endingRank2026: string;
  beginRank2025: string;
  endingRank2025: string;
}

const eapcetRanksData: RankAnalysisItem[] = [
  // VISW
  { code: 'CIV', course: 'CIVIL ENGINEERING', collegeCode: 'VISW', beginRank2026: '10,350', endingRank2026: '30,914', beginRank2025: '11,298', endingRank2025: '51,609' },
  { code: 'CSE', course: 'COMPUTER SCIENCE AND ENGINEERING', collegeCode: 'VISW', beginRank2026: '375', endingRank2026: '4,020', beginRank2025: '681', endingRank2025: '4,325' },
  { code: 'CSC', course: 'COMPUTER SCIENCE AND ENGINEERING (CYBER SECURITY)', collegeCode: 'VISW', beginRank2026: '2,647', endingRank2026: '5,705', beginRank2025: '1,962', endingRank2025: '7,152' },
  { code: 'CSM', course: 'CSE (ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING)', collegeCode: 'VISW', beginRank2026: '1,733', endingRank2026: '4,814', beginRank2025: '523', endingRank2025: '5,256' },
  { code: 'CAD', course: 'CSE (ARTIFICIAL INTELLIGENCE & DATA SCIENCE)', collegeCode: 'VISW', beginRank2026: '1,481', endingRank2026: '5,475', beginRank2025: '1,466', endingRank2025: '6,284' },
  { code: 'EEE', course: 'ELECTRICAL AND ELECTRONICS ENGINEERING', collegeCode: 'VISW', beginRank2026: '9,353', endingRank2026: '16,183', beginRank2025: '13,282', endingRank2025: '20,962' },
  { code: 'ECE', course: 'ELECTRONICS AND COMMUNICATION ENGINEERING', collegeCode: 'VISW', beginRank2026: '2,484', endingRank2026: '6,978', beginRank2025: '3,684', endingRank2025: '9,659' },
  { code: 'INF', course: 'INFORMATION TECHNOLOGY', collegeCode: 'VISW', beginRank2026: '5,297', endingRank2026: '8,023', beginRank2025: '6,126', endingRank2025: '10,089' },
  { code: 'MEC', course: 'MECHANICAL ENGINEERING', collegeCode: 'VISW', beginRank2026: '7,904', endingRank2026: '20,739', beginRank2025: '18,156', endingRank2025: '33,395' },
  // VISWPU
  { code: 'CSM', course: 'CSE (ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING)', collegeCode: 'VISWPU', beginRank2026: '1,242', endingRank2026: '9,991', beginRank2025: '---', endingRank2025: '---' },
  { code: 'EVT', course: 'ELECTRONICS ENGINEERING (VLSI DESIGN AND TECHNOLOGY)', collegeCode: 'VISWPU', beginRank2026: '2,331', endingRank2026: '7,756', beginRank2025: '---', endingRank2025: '---' },
];

const defaultAdmissionsPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'VWU campus buildings', caption: 'VWU Campus' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Smart classrooms', caption: 'Smart Classrooms' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Research labs', caption: 'Specialised Labs' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Sports court', caption: 'Sports Facilities' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Central library', caption: 'Central Library' },
];

const defaultUgPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'B.Tech Counseling', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'UG Orientation', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'UG Lab Demos', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Classroom Culture', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Campus Life Preview', caption: '' },
];

const defaultPgPhotos = [
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'PG Seminar & Orientation', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Specialization Research', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'PG Industry Meetups', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Advanced Computing', caption: '' },
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'Graduation Day Prep', caption: '' },
];

const DEFAULT_ADMISSIONS_FAQS: FaqDoc[] = [
  {
    id: 'faq-1',
    page: 'admissions',
    question: 'Is VWU a private university?',
    answer: 'Yes. VWU is a private women’s university recognised by the University Grants Commission (UGC). This enables VWU to design its own curricula and conduct independent examinations.',
    order: 1,
  },
  {
    id: 'faq-2',
    page: 'admissions',
    question: 'Is hostel accommodation available?',
    answer: 'Yes. VWU offers a wide range of hostel facilities.',
    order: 2,
  },
  {
    id: 'faq-3',
    page: 'admissions',
    question: 'Is VWU exclusively for women?',
    answer: 'Yes. VWU is exclusively for women students.',
    order: 3,
  },
];

export default function Admissions() {
  useHashScroll();
  const { phone, email } = useSiteContact();
  const { docs: allFaqs } = useOrderedCollection<FaqDoc>('faqs', 'order');
  const liveFaqs = allFaqs.filter((f) => f.page === 'admissions');
  const faqs = liveFaqs.length > 0 ? liveFaqs : DEFAULT_ADMISSIONS_FAQS;
  const tuitionData = useContentBlocks('admissions', 'tuitionData');
  const admissionHub = useContentBlocks('admissions', 'admissionHub');
  const visitOptions = useContentBlocks('admissions', 'visitOptions');
  const eapcetCode = useEapcetCode();
  const admissionsPhotos = useSitePhotos('admissions', 'main', defaultAdmissionsPhotos);
  const ugPhotos = useSitePhotos('admissions', 'ug', defaultUgPhotos);
  const hasUgPhotos = useSectionHasPhotos('admissions', 'ug');
  const pgPhotos = useSitePhotos('admissions', 'pg', defaultPgPhotos);
  const hasPgPhotos = useSectionHasPhotos('admissions', 'pg');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  useEffect(() => {
    document.title = "Admissions | Vishnu Women's University";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay || '0';
            setTimeout(() => el.classList.add('revealed'), parseInt(delay));
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page-wrapper">
      {/* Hero */}
      <PageHero
        page="admissions"
        defaultTitle="Admissions Open"
        defaultSubtitle="First Private Women’s University in Andhra Pradesh and Telangana. No. 1 preferred choice for female students in EAPCET."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Admissions' }]}
        scrollCtaTargetId="admissions-content"
      />

      {/* Admissions Hub */}
      <section id="admissions-content" className="section bg-off-white" style={{ paddingBottom: 0, scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          {/* EAPCET 2026 Distinction Highlight Card */}
          <div className="reveal" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #173824 100%)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6) var(--space-8)', color: 'var(--color-white)', textAlign: 'center', marginBottom: 'var(--space-10)', border: '1.5px solid rgba(201,168,76,0.4)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--color-accent)', color: 'var(--color-primary)', fontWeight: 800, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.35rem 0.85rem', borderRadius: '999px', marginBottom: 'var(--space-3)' }}>
              <Sparkles size={14} /> APEAPCET 2026 Benchmark
            </div>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--color-white)', margin: 0, lineHeight: 1.3 }}>
              First Private Women’s University in Andhra Pradesh and Telangana
            </h2>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-accent)', fontWeight: 700, marginTop: 'var(--space-2)', marginBottom: 0 }}>
              No. 1 preferred choice for female students in APEAPCET 2026.
            </p>
          </div>

          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <span className="section-label">Admissions</span>
            <h2 className="section-title">Everything You Need to Apply</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Everything you need to apply — fees, step-by-step procedure, opening & closing ranks, and the application portal — in one place.
            </p>
          </div>
          <div className="adm-hub-grid">
            {admissionHub.map((item) => {
              const Icon = resolveContentIcon(item.icon) || ClipboardList;
              // A content block's "slug" is normally an internal route, but admins
              // can also paste a full external URL (e.g. the fee payment gateway) —
              // route those through <a target="_blank"> instead of React Router's
              // <Link>, which can't navigate to an off-site address.
              const isExternal = /^https?:\/\//.test(item.slug);
              const cardBody = (
                <>
                  <div className="adm-hub-icon"><Icon size={38} strokeWidth={1.75} /></div>
                  <div className="adm-hub-highlight">{item.value}</div>
                  <h3 className="adm-hub-title">{item.title}</h3>
                  <p className="adm-hub-desc">{item.desc}</p>
                  <span className="adm-hub-arrow">View Details →</span>
                </>
              );
              return isExternal ? (
                <a href={item.slug} key={item.id} target="_blank" rel="noopener noreferrer" className="adm-hub-card">
                  {cardBody}
                </a>
              ) : (
                <Link to={item.slug || '/admissions'} key={item.id} className="adm-hub-card">
                  {cardBody}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Admissions Overview */}
      <section className="section bg-white">
        <div className="container">
          <div className="adm-intro-grid">
            <div className="adm-intro-main reveal-left">
              <span className="section-label">Your Journey to Excellence Starts Here</span>
              <h2 className="section-title">Admissions at Vishnu Women’s University</h2>
              <p className="adm-intro-text">
                Admissions at Vishnu Women’s University open the door to an enriching educational experience shaped by world-class infrastructure, accomplished faculty, diverse academic opportunities, and a vibrant campus environment. Designed to be transparent, student-centric, and merit-driven, the admission process enables aspiring women learners to discover programmes that align with their ambitions and embark on a journey of academic excellence, personal growth, leadership, and lifelong achievement.
              </p>
            </div>
            <div className="adm-intro-hub-panel reveal-right">
              <div className="adm-intro-hub-icon"><Users size={22} strokeWidth={2} /></div>
              <h3 className="adm-intro-subtitle">Admission Hub</h3>
              <p className="adm-intro-text">
                The Admission Hub is the university’s first point of connection with prospective students—facilitating the admission journey through clear processes, responsive guidance, and personalised support from the first enquiry to enrolment.
              </p>
              <p className="adm-intro-text">
                Vishnu Women’s University is committed to attracting high-potential students who share its pursuit of academic excellence, innovation, leadership, and meaningful impact, reinforcing its reputation as a destination for transformative women’s education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* APEAPCET 2026 - 27 Opening & Closing Ranks Analysis */}
      <section id="rank-analysis" className="section bg-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto var(--space-10)' }}>
            <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <BarChart2 size={16} /> APEAPCET Cut-off Analysis
            </span>
            <h2 className="section-title">Opening and Ending Ranks Analysis of VWU in APEAPCET 2026 – 27</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Official branch-wise Opening and Closing ranks analysis for Vishnu Women's University in APEAPCET 2026 – 27 counseling.
            </p>
          </div>

          {(() => {
            const parseRank = (val: string) => {
              const num = parseInt(val.replace(/,/g, ''), 10);
              return isNaN(num) ? Infinity : num;
            };
            const viswRows = eapcetRanksData
              .filter(r => r.collegeCode === 'VISW')
              .sort((a, b) => parseRank(a.endingRank2026) - parseRank(b.endingRank2026));
            const viswpuRows = eapcetRanksData
              .filter(r => r.collegeCode === 'VISWPU')
              .sort((a, b) => parseRank(a.endingRank2026) - parseRank(b.endingRank2026));
            return (
          <div className="reveal" style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 780 }}>
              <thead>
                <tr style={{ background: 'var(--color-primary)', color: 'var(--color-white)' }}>
                  <th rowSpan={2} style={{ padding: 'var(--space-3)', fontSize: 'var(--text-xs)', fontWeight: 800, textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)' }}>S.No.</th>
                  <th rowSpan={2} style={{ padding: 'var(--space-3)', fontSize: 'var(--text-xs)', fontWeight: 800, textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)' }}>Branch</th>
                  <th rowSpan={2} style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-xs)', fontWeight: 800, borderRight: '1px solid rgba(255,255,255,0.15)' }}>Course Name</th>
                  <th colSpan={2} style={{ padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-xs)', fontWeight: 800, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', borderRight: '1px solid rgba(255,255,255,0.15)' }}>2026 – 27 Ranks (OC)</th>
                  <th colSpan={2} style={{ padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-xs)', fontWeight: 800, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>2025 – 26 Ranks (OC)</th>
                </tr>
                <tr style={{ background: 'var(--color-primary)', color: 'var(--color-white)', borderBottom: '2px solid var(--color-accent)' }}>
                  <th style={{ padding: '0.4rem', fontSize: 'var(--text-xs)', fontWeight: 700, textAlign: 'center' }}>Begin Rank</th>
                  <th style={{ padding: '0.4rem', fontSize: 'var(--text-xs)', fontWeight: 700, textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)' }}>Ending Rank</th>
                  <th style={{ padding: '0.4rem', fontSize: 'var(--text-xs)', fontWeight: 700, textAlign: 'center' }}>Begin Rank</th>
                  <th style={{ padding: '0.4rem', fontSize: 'var(--text-xs)', fontWeight: 700, textAlign: 'center' }}>Ending Rank</th>
                </tr>
              </thead>
              <tbody>
                {/* VISW Section */}
                <tr style={{ background: 'rgba(0,47,25,0.08)', borderBottom: '1.5px solid var(--color-primary)' }}>
                  <td colSpan={7} style={{ padding: '0.4rem 1rem', fontWeight: 800, fontSize: 'var(--text-xs)', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    APEAPCET College Code: VISW
                  </td>
                </tr>
                {viswRows.map((row, idx) => (
                  <tr key={`visw-${row.code}`} style={{ borderBottom: '1px solid var(--color-light-gray)', background: idx % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                    <td style={{ padding: 'var(--space-3)', textAlign: 'center', fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>{idx + 1}</td>
                    <td style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                      <span style={{ background: 'rgba(0,47,25,0.08)', color: 'var(--color-primary)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 800, fontSize: 'var(--text-xs)' }}>{row.code}</span>
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-xs)' }}>{row.course}</td>
                    <td style={{ padding: 'var(--space-3)', textAlign: 'center', fontWeight: 700, color: '#1b5e20', fontSize: 'var(--text-xs)' }}>{row.beginRank2026}</td>
                    <td style={{ padding: 'var(--space-3)', textAlign: 'center', fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-xs)' }}>{row.endingRank2026}</td>
                    <td style={{ padding: 'var(--space-3)', textAlign: 'center', fontWeight: 600, color: 'var(--color-text-light)', fontSize: 'var(--text-xs)' }}>{row.beginRank2025}</td>
                    <td style={{ padding: 'var(--space-3)', textAlign: 'center', fontWeight: 600, color: 'var(--color-text-light)', fontSize: 'var(--text-xs)' }}>{row.endingRank2025}</td>
                  </tr>
                ))}
                {/* VISWPU Section */}
                <tr style={{ background: 'rgba(0,47,25,0.08)', borderTop: '2px solid var(--color-primary)', borderBottom: '1.5px solid var(--color-primary)' }}>
                  <td colSpan={7} style={{ padding: '0.4rem 1rem', fontWeight: 800, fontSize: 'var(--text-xs)', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    APEAPCET College Code: VISWPU
                  </td>
                </tr>
                {viswpuRows.map((row, idx) => (
                  <tr key={`viswpu-${row.code}`} style={{ borderBottom: '1px solid var(--color-light-gray)', background: idx % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                    <td style={{ padding: 'var(--space-3)', textAlign: 'center', fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>{viswRows.length + idx + 1}</td>
                    <td style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                      <span style={{ background: 'rgba(0,47,25,0.08)', color: 'var(--color-primary)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 800, fontSize: 'var(--text-xs)' }}>{row.code}</span>
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-xs)' }}>{row.course}</td>
                    <td style={{ padding: 'var(--space-3)', textAlign: 'center', fontWeight: 700, color: '#1b5e20', fontSize: 'var(--text-xs)' }}>{row.beginRank2026}</td>
                    <td style={{ padding: 'var(--space-3)', textAlign: 'center', fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-xs)' }}>{row.endingRank2026}</td>
                    <td style={{ padding: 'var(--space-3)', textAlign: 'center', fontWeight: 600, color: 'var(--color-text-light)', fontSize: 'var(--text-xs)' }}>{row.beginRank2025}</td>
                    <td style={{ padding: 'var(--space-3)', textAlign: 'center', fontWeight: 600, color: 'var(--color-text-light)', fontSize: 'var(--text-xs)' }}>{row.endingRank2025}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', textAlign: 'right', fontStyle: 'italic' }}>
              * Comparative Statement of Official APEAPCET Cut-off Ranks (2026–27 vs 2025–26) for VWU (College Codes: VISW, VISWPU).
            </div>
          </div>
            );
          })()}
        </div>
      </section>

      {/* Tuition */}
      <section className="section" style={{ background: 'var(--color-primary)' }}>
        <div className="container">
          <div className="adm-tuition-grid">
            <div className="reveal-left">
              <span className="section-label" style={{ color: 'var(--color-accent)' }}>Fee Structure</span>
              <h2 className="section-title" style={{ color: 'var(--color-white)' }}>Education Within Reach</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-lg)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
                B.Tech tuition is ₹1,05,000 per year. M.Tech is ₹55,800 and MBA is ₹55,000 annually.
                Through government scholarships, SC/ST/BC fee reimbursement, and the PM Vidyalaxmi Scheme,
                a VWU education is financially accessible to every deserving student.
              </p>
              <Link to="/programmes-fee-structure" className="btn btn-accent">View Full Fee Structure</Link>
            </div>
            <div className="adm-tuition-table">
              {tuitionData.map((row, i) => (
                <div key={row.id} className="adm-tuition-row" style={{ borderTop: i === tuitionData.length - 2 ? '2px solid rgba(201,168,76,0.4)' : undefined }}>
                  <span>{row.title}</span>
                  <strong style={{ color: i >= tuitionData.length - 2 ? 'var(--color-accent)' : 'var(--color-white)' }}>{row.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Campus Visit */}
      <section id="visit" className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto var(--space-12)' }}>
            <span className="section-label">Campus Visits</span>
            <h2 className="section-title">Come See VWU for Yourself</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Seeing VWU in person is the best way to know if it is the right fit for you. Choose the visit format that suits you best.
            </p>
          </div>
          <div className="adm-visit-grid">
            {visitOptions.map((v) => {
              const Icon = resolveContentIcon(v.icon) || Users;
              return (
                <div key={v.id} className="adm-visit-card">
                  <div className="adm-visit-icon"><Icon size={40} strokeWidth={1.75} /></div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                  <Link to="/campus-visit" className="btn btn-outline" style={{ marginTop: 'auto' }}>Schedule Now</Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Campus Photos */}
      <section className="section bg-off-white">
        <div className="container">
          <PhotoGrid
            images={admissionsPhotos}
            label="Why VWU"
            title="Experience the VWU Difference"
            subtitle="From modern labs and smart classrooms to hostels, sports grounds, and a buzzing placement season — see what awaits you at VWU."
            highlights={[
              `EAPCET college code: ${eapcetCode}`,
              '1,400+ placements in 2024–25 alone',
              'Highest package: ₹59.28 LPA',
              '100% scholarship coverage available for eligible students',
              'Campus visit & virtual tour options available',
            ]}
            columns={2}
            layout="side-text"
          />
        </div>
      </section>

      {/* Undergraduate (UG) — hidden until real photos are added */}
      {hasUgPhotos && (
        <section className="section bg-off-white">
          <div className="container">
            <PhotoGrid
              images={ugPhotos}
              label="Undergraduate (UG)"
              title="Your B.Tech Journey Starts Here"
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

      {/* Postgraduate (PG) — hidden until real photos are added */}
      {hasPgPhotos && (
        <section className="section bg-white">
          <div className="container">
            <PhotoGrid
              images={pgPhotos}
              label="Postgraduate (PG)"
              title="Advance Your Career with a PG Degree"
              columns={3}
              layout="default"
            />
          </div>
        </section>
      )}

      {/* Contact Admissions */}
      <section id="admissions-contact" className="section bg-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="adm-contact-grid">
            <div className="reveal-left">
              <span className="section-label">Contact Us</span>
              <h2 className="section-title">Talk to Our Admissions Team</h2>
              <p className="section-desc" style={{ marginBottom: 'var(--space-6)' }}>
                Our admissions team is ready to answer your questions, walk you through each step,
                and help you find your path at VWU.
              </p>
              <div className="adm-contact-info">
                <div className="adm-contact-item">
                  <Phone size={22} strokeWidth={1.75} />
                  <div>
                    <strong>Phone</strong>
                    <a href={telHref(phone)}>{phone}</a>
                  </div>
                </div>
                <div className="adm-contact-item">
                  <Mail size={22} strokeWidth={1.75} />
                  <div>
                    <strong>Email</strong>
                    <a href={`mailto:${email}`}>{email}</a>
                  </div>
                </div>
                <div className="adm-contact-item">
                  <MapPin size={22} strokeWidth={1.75} />
                  <div>
                    <strong>Office Location</strong>
                    <span>Bhimavaram, West Godavari Dist., AP – 534 202</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="adm-form-card reveal-right">
              <div style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4) var(--space-5)', marginBottom: 'var(--space-6)', borderLeft: '4px solid var(--color-accent)' }}>
                <span style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 2 }}>
                  Admissions Open
                </span>
                <p style={{ color: 'var(--color-white)', fontSize: 'var(--text-sm)', fontWeight: 700, margin: 0, lineHeight: 1.5 }}>
                  Candidates seeking Admissions, apply here by filling in the details below.
                </p>
              </div>

              <AdmissionApplyForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto var(--space-12)' }}>
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Common questions about joining VWU, answered. If you do not find what you are looking for, contact our admissions team directly.
            </p>
          </div>
          <div className="adm-faq-list">
            {/* Items render from Firestore, so no scroll-reveal animation here
                (see the gotcha documented in CLAUDE.md). */}
            {faqs.map((faq, i) => (
              <div key={faq.id} className={`adm-faq-card${openFaq === i ? ' open' : ''}`}>
                <button
                  className="adm-faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{faq.question}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {/* Always mounted — collapse is done purely with CSS (grid-template-rows),
                    so the answer animates open/closed instead of hard-mounting/unmounting. */}
                <div className="adm-faq-collapse" aria-hidden={openFaq !== i}>
                  <div className="adm-faq-collapse-inner">
                    <div className="adm-faq-answer">{faq.answer}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
            <p style={{ color: 'var(--color-text-light)', marginBottom: 'var(--space-4)' }}>Still have questions?</p>
            <a href={telHref(phone)} className="btn btn-primary btn-lg">Call Admissions: {phone}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
