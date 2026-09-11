import { useEffect, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import './Admissions.css';
import PageHero from '../../components/PageHero/PageHero';
import PhotoGrid from '../../components/PhotoGrid/PhotoGrid';
import AdmissionApplyForm from '../../components/AdmissionApplyForm/AdmissionApplyForm';
import { useOrderedCollection } from '../../hooks/useCollection';
import { useContentBlocks } from '../../hooks/useContentBlocks';
import { useSitePhotos, useSectionHasPhotos } from '../../hooks/useSitePhotos';
import { useSiteContact, telHref } from '../../hooks/useSiteContact';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../lib/photoPlaceholder';
import type { FaqDoc } from '../Admin/sections/FaqAdmin';
import { ClipboardList, Users, Phone, Mail, MapPin, Sparkles } from 'lucide-react';
import { resolveContentIcon } from '../../lib/contentIcons';
import { useHashScroll } from '../../hooks/useHashScroll';
import { dotTech } from '../../lib/academicDegreeNames';

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
  { src: PHOTO_NEEDED_PLACEHOLDER, alt: 'B.Tech. Counseling', caption: '' },
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
  const admissionsPhotos = useSitePhotos('admissions', 'main', defaultAdmissionsPhotos);
  const ugPhotos = useSitePhotos('admissions', 'ug', defaultUgPhotos);
  const hasUgPhotos = useSectionHasPhotos('admissions', 'ug');
  const pgPhotos = useSitePhotos('admissions', 'pg', defaultPgPhotos);
  const hasPgPhotos = useSectionHasPhotos('admissions', 'pg');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [rankYear, setRankYear] = useState<'2026-27' | '2025-26'>('2026-27');
  const [rankCollege, setRankCollege] = useState<'VISW' | 'VISWPU'>('VISW');
  const [rankProgramme, setRankProgramme] = useState<string>('all');
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
        defaultSubtitle="First Private Women’s University in Andhra Pradesh and Telangana. No. 1 preferred choice for female students in AP EAPCET."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Admissions' }]}
        hideCta
      />

      {/* Admissions Hub */}
      <section id="admissions-content" className="section bg-off-white" style={{ paddingBottom: 0, scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          {/* AP EAPCET 2026 Distinction Highlight Card */}
          <div className="reveal" style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #173824 100%)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6) var(--space-8)', color: 'var(--color-white)', textAlign: 'center', marginBottom: 'var(--space-10)', border: '1.5px solid rgba(201,168,76,0.4)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--color-accent)', color: 'var(--color-primary)', fontWeight: 800, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.35rem 0.85rem', borderRadius: '999px', marginBottom: 'var(--space-3)' }}>
              <Sparkles size={14} /> AP EAPCET 2026 Benchmark
            </div>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--color-white)', margin: 0, lineHeight: 1.3 }}>
              First Private Women’s University in Andhra Pradesh and Telangana
            </h2>
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-accent)', fontWeight: 700, marginTop: 'var(--space-2)', marginBottom: 0 }}>
              No. 1 preferred choice for female students in AP EAPCET 2026.
            </p>
          </div>

          <div className="reveal" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <h2 className="section-title">Everything You Need to Apply</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Find key information on programmes, eligibility, admission procedures, fees and AP EAPCET counselling.
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
                  <div className="adm-hub-highlight">{dotTech(item.value)}</div>
                  <h3 className="adm-hub-title">{dotTech(item.title)}</h3>
                  <p className="adm-hub-desc">{dotTech(item.desc)}</p>
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
              <span className="section-label">Admissions at VWU</span>
              <h2 className="section-title">Applying to Vishnu Women’s University</h2>
              <p className="adm-intro-text">
                Admissions information is organised here to help students and families understand programmes, eligibility, fees, counselling and the application process.
              </p>
              <Link to="/admission-procedure" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>Check Eligibility</Link>
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

      {/* AP EAPCET 2026 - 27 Opening & Closing Ranks Analysis */}
      <section id="rank-analysis" className="section bg-white" style={{ scrollMarginTop: 'calc(var(--topbar-height) + var(--header-height) + 1rem)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto var(--space-10)' }}>
            <h2 className="section-title">AP EAPCET Opening & Closing Ranks</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Official branch-wise Opening and Closing ranks analysis for Vishnu Women's University in AP EAPCET counseling.
            </p>
          </div>

          {(() => {
            const parseRank = (val: string) => {
              const num = parseInt(val.replace(/,/g, ''), 10);
              return isNaN(num) ? Infinity : num;
            };
            const beginKey: keyof RankAnalysisItem = rankYear === '2026-27' ? 'beginRank2026' : 'beginRank2025';
            const endKey: keyof RankAnalysisItem = rankYear === '2026-27' ? 'endingRank2026' : 'endingRank2025';
            const collegeRows = eapcetRanksData.filter(r => r.collegeCode === rankCollege);
            const programmeOptions = [...new Map(collegeRows.map(r => [r.code, r.course])).entries()];
            const filteredRows = collegeRows
              .filter(r => rankProgramme === 'all' || r.code === rankProgramme)
              .sort((a, b) => parseRank(a[endKey]) - parseRank(b[endKey]));

            const selectStyle: CSSProperties = {
              border: '1.5px solid var(--color-light-gray)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.65rem 0.9rem',
              minHeight: 48,
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--color-primary)',
              background: 'var(--color-white)',
              cursor: 'pointer',
              minWidth: 220,
            };
            const labelStyle: CSSProperties = {
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              fontSize: 'var(--text-xs)',
              fontWeight: 800,
              color: 'var(--color-text-light)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            };

            return (
          <>
            <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', justifyContent: 'center', marginBottom: 'var(--space-8)' }}>
              <label style={labelStyle}>
                Academic Year
                <select
                  value={rankYear}
                  onChange={(e) => setRankYear(e.target.value as typeof rankYear)}
                  style={selectStyle}
                >
                  <option value="2026-27">2026 – 27</option>
                  <option value="2025-26">2025 – 26</option>
                </select>
              </label>
              <label style={labelStyle}>
                College Code
                <select
                  value={rankCollege}
                  onChange={(e) => { setRankCollege(e.target.value as typeof rankCollege); setRankProgramme('all'); }}
                  style={selectStyle}
                >
                  <option value="VISW">VISW</option>
                  <option value="VISWPU">VISWPU</option>
                </select>
              </label>
              <label style={labelStyle}>
                Programme
                <select
                  value={rankProgramme}
                  onChange={(e) => setRankProgramme(e.target.value)}
                  style={selectStyle}
                >
                  <option value="all">All Programmes</option>
                  {programmeOptions.map(([code, course]) => (
                    <option key={code} value={code}>{course} ({code})</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="reveal" style={{ background: 'var(--color-off-white)', border: '1.5px solid var(--color-light-gray)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 560 }}>
                <thead>
                  <tr style={{ background: 'var(--color-primary)', color: 'var(--color-white)' }}>
                    <th style={{ padding: 'var(--space-3)', fontSize: 'var(--text-xs)', fontWeight: 800, textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)' }}>S.No.</th>
                    <th style={{ padding: 'var(--space-3)', fontSize: 'var(--text-xs)', fontWeight: 800, textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)' }}>Branch</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-xs)', fontWeight: 800, borderRight: '1px solid rgba(255,255,255,0.15)' }}>Course Name</th>
                    <th style={{ padding: 'var(--space-3)', fontSize: 'var(--text-xs)', fontWeight: 800, textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)' }}>Begin Rank</th>
                    <th style={{ padding: 'var(--space-3)', fontSize: 'var(--text-xs)', fontWeight: 800, textAlign: 'center' }}>Ending Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-light)', fontSize: 'var(--text-sm)' }}>
                        No rank data available for this selection.
                      </td>
                    </tr>
                  ) : filteredRows.map((row, idx) => (
                    <tr key={row.code} style={{ borderBottom: '1px solid var(--color-light-gray)', background: idx % 2 === 0 ? 'var(--color-white)' : 'var(--color-off-white)' }}>
                      <td style={{ padding: 'var(--space-3)', textAlign: 'center', fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>{idx + 1}</td>
                      <td style={{ padding: 'var(--space-3)', textAlign: 'center' }}>
                        <span style={{ background: 'rgba(0,47,25,0.08)', color: 'var(--color-primary)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 800, fontSize: 'var(--text-xs)' }}>{row.code}</span>
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-xs)' }}>{row.course}</td>
                      <td style={{ padding: 'var(--space-3)', textAlign: 'center', fontWeight: 700, color: '#1b5e20', fontSize: 'var(--text-xs)' }}>{row[beginKey]}</td>
                      <td style={{ padding: 'var(--space-3)', textAlign: 'center', fontWeight: 700, color: 'var(--color-primary)', fontSize: 'var(--text-xs)' }}>{row[endKey]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', textAlign: 'right', fontStyle: 'italic' }}>
                * Official AP EAPCET Cut-off Ranks (OC) for VWU — College Code: {rankCollege}, {rankYear} counseling.
              </div>
            </div>
          </>
            );
          })()}
        </div>
      </section>

      {/* Tuition */}
      <section className="section" style={{ background: 'var(--color-primary)' }}>
        <div className="container">
          <div className="adm-tuition-grid">
            <div className="reveal-left">
              <h2 className="section-title" style={{ color: 'var(--color-white)' }}>Programme Fees</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-lg)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
                View the applicable tuition fees and available fee-related information for each programme.
              </p>
              <Link to="/programmes-fee-structure" className="btn btn-accent">View Full Fee Structure</Link>
            </div>
            <div className="adm-tuition-table">
              {tuitionData.map((row, i) => (
                <div key={row.id} className="adm-tuition-row" style={{ borderTop: i === tuitionData.length - 2 ? '2px solid rgba(201,168,76,0.4)' : undefined }}>
                  <span>{dotTech(row.title)}</span>
                  <strong style={{ color: 'var(--color-white)' }}>{dotTech(row.value)}</strong>
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
            <h2 className="section-title">Come See VWU for Yourself</h2>
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Explore the campus, academic facilities and student environment before making your decision.
            </p>
          </div>
          <div className="adm-visit-grid">
            {visitOptions.map((v) => {
              const Icon = resolveContentIcon(v.icon) || Users;
              // CTA text is admin-editable via the card's "slug" field in
              // Content Blocks admin (Admissions — Campus Visit Options).
              // Falls back to a title-keyword guess for cards an admin
              // hasn't set it on yet, so old/un-edited docs don't all show
              // the same generic "Schedule a Visit".
              const title = v.title.toLowerCase();
              const cta = v.slug?.trim() || (title.includes('virtual')
                ? 'Take the Virtual Tour'
                : title.includes('book')
                  ? 'Book a Campus Tour'
                  : 'Schedule a Visit');
              return (
                <div key={v.id} className="adm-visit-card">
                  <div className="adm-visit-icon"><Icon size={40} strokeWidth={1.75} /></div>
                  <h3>{dotTech(v.title)}</h3>
                  <p>{dotTech(v.desc)}</p>
                  <Link to="/campus-visit" className="btn btn-outline" style={{ marginTop: 'auto' }}>{cta}</Link>
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
            label="WHY VWU"
            title="A University Experience Designed Around Learning"
            subtitle="Explore VWU's academic environment, campus facilities, student life and career support before making your choice."
            columns={2}
            layout="side-text"
          />
          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <Link to="/campus-visit" className="btn btn-primary btn-lg">Explore Campus →</Link>
          </div>
        </div>
      </section>

      {/* Undergraduate (UG) — hidden until real photos are added */}
      {hasUgPhotos && (
        <section className="section bg-off-white">
          <div className="container">
            <PhotoGrid
              images={ugPhotos}
              label="Undergraduate (UG)"
              title="Your B.Tech. Journey Starts Here"
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
                    <a href={`mailto:${email || 'admissions@vwu.edu.in'}`}>{email || 'admissions@vwu.edu.in'}</a>
                  </div>
                </div>
                <div className="adm-contact-item">
                  <MapPin size={22} strokeWidth={1.75} />
                  <div>
                    <strong>Office Location</strong>
                    <span>Vishnupur, Bhimavaram, West Godavari Dist., AP – 534 202</span>
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
                  <span>{dotTech(faq.question)}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {/* Always mounted — collapse is done purely with CSS (grid-template-rows),
                    so the answer animates open/closed instead of hard-mounting/unmounting. */}
                <div className="adm-faq-collapse" aria-hidden={openFaq !== i}>
                  <div className="adm-faq-collapse-inner">
                    <div className="adm-faq-answer">{dotTech(faq.answer)}</div>
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
