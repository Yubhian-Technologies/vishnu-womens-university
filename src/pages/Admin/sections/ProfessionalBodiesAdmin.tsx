import { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import { deleteFile, type UploadResult } from '../../../lib/storage';

export interface ProfessionalBodyDoc {
  id: string;
  key: string;
  shortName: string;
  fullName: string;
  contentText: string;
  order: number;
  // Circular logo shown on the Professional Bodies grid — links through to
  // this body's own detail page. Optional: a body without one yet just
  // shows its short name instead of an image (see ProfessionalBodiesSection).
  imageUrl?: string;
  storagePath?: string;
}

const EMPTY: Omit<ProfessionalBodyDoc, 'id'> = { key: '', shortName: '', fullName: '', contentText: '', order: 0, imageUrl: '', storagePath: '' };

// The Professional Bodies page's original per-body content — used both as
// the "empty collection" fallback and as the one-click starting point for
// admins moving these into Firestore.
export const DEFAULT_PROFESSIONAL_BODIES: Omit<ProfessionalBodyDoc, 'id'>[] = [
  { key: "iste", shortName: "ISTE", fullName: "Indian Society For Technical Education", contentText: "ISTE is the premier membership association for educators and education leaders engaged in improving and teaching by advancing the effective use of technology in PK-12 and teacher education.\nISTE membership for students and faculty is a powerful and meaningful way for educators to connect with peers, to gather in a variety of forums to share the challenges and excitement of teaching, and to be a part of the community that leads the transformation of education.", order: 1 },
  { key: "ieee", shortName: "IEEE", fullName: "Institute of Electrical and Electronics Engineers", contentText: "IEEE — stands for the Institute of Electrical and Electronics Engineers. IEEE is the world's largest professional association dedicated to advancing technological innovation and excellence for the benefit of humanity.\nIEEE and its members inspire a global community through IEEE's highly cited publications, conferences, technology standards, and professional and educational activities. IEEE creates an environment where members collaborate on world-changing technologies — from computing and sustainable energy systems, to aerospace, communications, robotics, healthcare, and more.\nThe IEEE Brand Identity Toolkit explains the basic usage rules for all corporate identity elements and how to utilize them to create a powerful and consistent communications pieces.", order: 2 },
  { key: "iete", shortName: "IETE", fullName: "Institution of Electronics and Telecommunication Engineers", contentText: "Founded in 1953, The Institution of Electronics and Telecommunication Engineers (IETE) is a leading professional society devoted to the advancement of science and technology of \"Electronics, Telecommunications and IT\". IETE serves its 45,000 members both individuals and industries / organizations through its 41 centers spread all over India and abroad.\nIn a big way, all these various individual societies facilitate our students to do research work in their professional education through Student Chapters. Our students participate various activities for their better stand among other engineering graduates.", order: 3 },
  { key: "iet", shortName: "IET", fullName: "Institution of Engineering and Technology", contentText: "Shri Vishnu Engineering College for Women takes pride in inaugurating its vibrant IET On Campus on 22 November 2018. SVECW is the leading institution in student memberships, with around 200 students in the IET Hyderabad Local network.\nSVECW On Campus has been a hub of Learning and innovation, thanks to its fruitful collaboration with IET. We have organized numerous Seminars, Workshops, and Invited Lectures, providing our students with unique learning opportunities. Our students have also reaped the benefits of hands-on workshops, field competitions, and article presentation competitions, all organized in collaboration with IET (UK). These experiences have enhanced their technical skills and broadened their horizons, preparing them for a successful career in engineering.\n\nPERSON: Faculty Advisor | Dr. K. Kalyan Sagar | Associate Professor — EEE Department\n\nACTIVITIES: List of Activities\n- One Day Workshop on College to Corporate | 15 April 2024\n- A Two Day Workshop on AI Mastery Deep Dive: Unveiling Comprehensive Horizons | 15–16 March 2024\n- A Two Day Workshop on Modern Development Toolkit: Mastering Git, Jenkins, Docker, and AWS Deployment | 15–16 March 2024\n- A Two Day Workshop on Digital Design Using Verilog HDL | 3–4 August 2023\n- One Day Workshop on Artificial Intelligence & Machine Learning | 9 June 2023\n- One Day Workshop on DC-DC Converter Design for Smart Vehicles | 29 December 2021\n- One Day Workshop on Motor Control For Smart Vehicles | 26 August 2021\n- A Two Day Workshop on Industrial IOT | 1–2 March 2019\n- One Day Workshop on LaTeX — An Efficient Documentation Tool | 2 March 2019\n- A Two Day Workshop on Augmented Reality & Artificial Intelligence | 7–8 December 2018", order: 4 },
  { key: "sae", shortName: "SAE", fullName: "Society of Automotive Engineers", contentText: "The SAE Collegiate Club at Shri Vishnu Engineering College for Women has had a remarkable journey since its establishment in September 2015. Having Dr. U. Chandra Sekhar, Program Advisor-Director at Wipro-3D, as the Chief Guest for the inauguration program was indeed a great honor for the club. His expertise and experience in the field of mechanical engineering would have undoubtedly inspired and motivated the members.\nDr. Chandra Sekhar's technical talk on the latest happenings in Mechanical engineering would have provided valuable insights into the industry's trends, challenges, and opportunities. Such talks not only enrich students' knowledge but also ignite their passion for the subject and encourage them to explore new avenues in their academic and professional journey.\nThis inaugural event likely set a high standard for the club's future activities, fostering a culture of learning, innovation, and collaboration among its members. It's clear that the club has been successful in creating a platform for students to engage with industry experts, learn from their experiences, and stay updated with the advancements in the automotive engineering field.\nThe increase in membership from 55 to approximately 350 members demonstrates the growing interest and participation in the club's activities. It's also noteworthy that 72 students are registered with SAE-INDIA for the academic year 2023-2024, showing a continued commitment to the automotive engineering field.\nSAE Collegiate Clubs engage in various activities aimed at enhancing students' knowledge, skills, and networking opportunities in the field of automotive engineering, some of these activities include:\n\n- Hands-on Projects: Participating in hands-on projects like designing, building, and testing vehicles for competitions such as Baja SAE, Formula SAE, and Aero Design.\n- Competitions: Participating in SAE-sponsored competitions and challenges to apply theoretical knowledge in practical scenarios and develop teamwork and leadership skills.\n- Networking Events: Hosting networking events where students can interact with professionals from the automotive industry, potential employers, and alumni.\n- Technical Workshops and Seminars: Organizing workshops and seminars on topics related to automotive engineering, such as vehicle dynamics, powertrain technology, autonomous vehicles, etc.\n- Guest Lectures: Inviting industry professionals and experts to give talks and presentations on the latest trends and developments in automotive technology.\n- Tours and Visits: Organizing visits to automotive companies, research labs, and manufacturing facilities to provide students with real-world exposure to the industry.\n- Skill Development Workshops: Conducting workshops focused on developing practical skills like CAD modeling, simulation software usage, and prototyping techniques.\n- Community Outreach: Engaging in outreach activities such as STEM education programs, mentoring high school students interested in engineering, and participating in community service projects.\n- Professional Development: Providing resources and guidance for resume building, interview preparation, and career development.\n\nPERSON: Faculty Advisor | Dr. P. Srinivasa Raju | PhD, Professor\nPERSON: Faculty Advisor | Mr. Manoneet Kumar | (PhD), Asst. Professor\nPERSON: Faculty Advisor | Mr. A. S. V. Prasad | (PhD), Asst. Professor\n\nACTIVITIES: List of Events, Seminars, Guest Lectures Conducted under SAE\n- Vishnu Karting Championship-2015 | 22–25 Jan 2016 at Shri Vishnu Engineering College for women\n- Team Juno Racers Participation in Indian Karting Race-2016 | Shri Krishna College of Engineering & Technology, Coimbatore, 25–28 August 2016\n- Team Z1ba Racers Participation in Baja-2016 | 15–20 February 2016, Pithampur, Indore\n- Team Z1ba Racers Participation in Baja-2017 | 16–20 February 2017, Pithampur, Indore\n- Vishnu Karting Championship-2017 | 27–30 January 2017 at Shri Vishnu Engineering College for women\n- ISIE — Electric solar vehicle championship in association with ISIE | 26 March – 02 April 2017 at Shri Vishnu Engineering College for Women\n- Workshop on Vehicle Dynamics | 7–10 June 2018\n- Workshop on CAE Workshop | 15–20 Sep 2018, organized by ATOM Motors\n- Team Z1ba Racers Participation in Baja-2019 | 6–10 March 2019 at IIT Ropar\n- Guest talk by ARAI/SAE Southern region — Dr. Sanjay Nibandhe on ATV team motivation and Lecture on Validation of Automobile in Industry | 5–6 Dec 2019\n- Conducted one week EV & Lithium Technology Workshop at SVECW | 21–26 Dec 2019, by Elfer Megacorp Pvt. Ltd.\n- Team Z1ba Racers Participation in Baja-2019 | 22–26 Jan 2020, Pithampur, Indore\n- Industrial Visit to Caterpillar India Pvt Ltd | 11–12 Mar 2020, Chennai\n- A Ten-Day Workshop on \"Advanced CATIA\" | 02–04 March 2020 at Shri Vishnu Engineering College for Women\n- A One Week Workshop on \"EV & Lithium Technology with Hands-on session\" | 21–27 December 2019 at Shri Vishnu Engineering College for Women\n- A Two-Day Talk on \"Validation of Automobile in Industry\" | 05–06 December 2019 at Shri Vishnu Engineering College for women\n- Guest Lecture series on \"Skill requirements and job opportunities for women empowerment in Mechanical Engineering\" | 24 Apr, 01 May & 08 May 2021\n- A 1-Week online short-training program on \"Product Design and Drafting using CATIA\" | 03–08 February 2021\n- One week student workshop on \"Optimization and its Relevance in Additive Manufacturing\" | 25–31 January 2021 at Shri Vishnu Engineering College for Women\n- Webinar on \"Automotive and New Mobility Design\" | 18 March 2022 at Bhimavaram\n- Development of \"Baja Track\" at Yenemduru | 12 March 2022, Bhimavaram\n- A Six Day Workshop on \"Product Design and Drafting by CATIA\" | 22–27 November 2021 at Shri Vishnu Engineering College for women\n- A Webinar on \"Geometric Dimensioning and Tolerancing\" | 23 October 2021 at Shri Vishnu Engineering College for women\n- Virtual talk on \"IPR, Patent and Entrepreneurship\" | 05 June 2021 at Shri Vishnu Engineering College for women\n- Internship opportunity in association with Brakes India Pvt. Ltd | 27 April – 06 May 2022\n- Team Z1ba Racers Participation in Baja-2022 | 23 Jan, Indore Institute of Science and Technology, Pithampur Road, Rau, Indore, Madhya Pradesh\n- One Week student workshop on \"Problem Solving using Finite Element Analysis\" | 12–18 June 2023 at SVECW\n- A Ten-day STTP on \"Digital Manufacturing 2k23\" | 03–05 May 2023 at Shri Vishnu Engineering College for women\n- A One Week Workshop on CATIA | 20–26 March 2023 at Shri Vishnu Engineering College for women\n- An Expert Talk on \"Geometric Dimensioning and Tolerancing\" | 21 June 2023 at SVECW\n- Two-Day Talk on \"Innovative Trends in Automobile and Farm Equipment Machinery\" | 24–25 2023 at Shri Vishnu Engineering College for women\n- Team Z1ba Racers Participation in M-Baja & E-Baja-2023 | 6–11 March 2024, BVRIT-Narsapur\n- Team Z1ba Racers Participation in AGKC-2024 | 26–29 February 2024, AITAM-Tekkali", order: 5 },
  { key: "acm", shortName: "ACM", fullName: "Association for Computing Machinery", contentText: "In pursuit of cultivating skilled professionals in artificial intelligence through premier education and gaining global recognition as a hub, the Department of Artificial Intelligence at SVECW started the ACM-W Student Chapter exclusively for women students. This initiative aims to promote collaboration and research among women students, offering access to valuable resources including papers, journals, and magazines on cutting-edge technologies.\nMembership in ACM connects students to a global community of researchers, fostering networking opportunities and keeping members abreast of technological research trends.\n\nCHAPTER: Chapter Name | SVECW-ACM-W\nCHAPTER: Chapter Group ID | 194312", order: 6 },
  { key: "csi", shortName: "CSI", fullName: "Computer Society of India", contentText: "Formed in 1965, the CSI has been instrumental in guiding the Indian IT industry down the right path since its formative years. Today, the CSI has 70 chapters all over India, 418 student branches, and more than 90000 members including India's most famous IT industry leaders, brilliant scientists and dedicated academicians.\nCSI offers a range of services and networking opportunities through workshops, seminars, conventions and courses, participated by industry majors sharing best practices and digital opportunities for development, exchanging knowledge and ideas.", order: 7 },
  { key: "ici", shortName: "ICI", fullName: "Indian Concrete Institute @ CE Dept", contentText: "Indian Concrete Institute (ICI) — Student Chapter was established in the Department of Civil Engineering from 2019 through taking a Life Institutional Membership in 2016. This ICI Student Chapter is known for its activities at Regional Level and National Level through its versatile programs for students, faculty, local engineers and masons. ICI — Student chapter in association with UltraTech Cement Limited, Infra Support, Transheight Consultants Pvt. Ltd., and many other Industries have organized notable programs/workshops/seminars etc., have benefited students in learning emerging technologies and Industry Ready.\nThe Department of Civil Engineering at SVECW (A), Bhimavaram, has received notable recognition for ICI Student Chapter under the ICI UltraTech Concrete Day and Construction Excellence Award's (2020 till date):\n\n- Outstanding Student Chapter Award: at the regional level (Vijayawada and Vizag Centre) for the years 2020, 2022, and 2023.\n- Best Student Chapter Performance Appreciation Award: for the year 2022 (National Level).\n- Best Student Chapter Award: for the year 2023 (National Level).", order: 8 },
  { key: "asce", shortName: "ASCE", fullName: "American Society of Civil Engineers @ CE Dept.", contentText: "American Society of Civil Engineers (ASCE), an engineering society for the advancement of the science & profession of Civil engineering & enhancement of human welfare through the activities of society members.\nASCE — Student Chapter has started in the department of Civil Engineering from 2024 and is under Probation period. Through this forum, students have been given industry connect globally which makes them understand and adopt versatile technologies that can drive their passion in the Core Sector. Aiming to participate in the National Concrete Canoe Competition that will be hosted under ASCE, the forum focuses to nurture the young women talent through training & equipping them with resources.", order: 9 },
  { key: "ieee-cis", shortName: "IEEE CIS", fullName: "IEEE Computational Intelligence Society", contentText: "The IEEE Computational Intelligence Society (CIS) is a vibrant student community dedicated to the exploration of artificial intelligence, machine learning, and intelligent systems. Our society fosters innovation, research, and technical excellence through workshops, seminars, hands-on projects, and global competitions.\nAs a part of IEEE, CIS focuses on the theory, design, application, and development of biologically and linguistically inspired computational paradigms, including neural networks, genetic algorithms, evolutionary programming, fuzzy systems, and hybrid intelligent systems.\nWe connect students with industry professionals, academic leaders, and mentors, creating opportunities for networking, skill development, and career advancement in AI-driven industries. Whether you are a beginner or an AI enthusiast, CIS provides the perfect platform to learn, collaborate, and lead in the ever-evolving field of computational intelligence.\n\nCHAPTER: IEEE Student Branch Identification Code | SBC08731A", order: 10 },
  { key: "ieee-pes", shortName: "IEEE PES", fullName: "IEEE Power and Energy Society", contentText: "The SVECW IEEE Power & Energy Society (PES) Chapter (SBC08731) was established on 27 Feb 2021 — a dynamic technical chapter under the IEEE umbrella, dedicated to the advancement and dissemination of knowledge in the fields of electric power and energy. Focused on promoting innovation and technical excellence, the PES Chapter provides a platform for professionals, researchers, and students to collaborate, share insights, and stay abreast of the latest developments in power systems, renewable energy, smart grids, and sustainable energy technologies.\nThrough technical talks, workshops, industry expert lectures, and hands-on events, the chapter aims to foster academic and professional growth while contributing to global energy solutions.\n\nPERSON: Chapter Advisor | Dr. S. Dileep Kumar Varma | IEEE Membership Number: 95656674 | IEEE Email: varma8332@ieee.org | Alternate Email: ahaarticles@gmail.com | Mobile: +91-9441171542\nPERSON: Chapter Chair | Ms. Himaja Lingampalli | IEEE Membership Number: 101209432 | IEEE Email: himajalingampalli99@gmail.com | Mobile: +91-7780595684", order: 11 },
];

export default function ProfessionalBodiesAdmin() {
  const { docs, loading } = useOrderedCollection<ProfessionalBodyDoc>('professionalBodies', 'order');
  const [form, setForm] = useState<Omit<ProfessionalBodyDoc, 'id'>>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const set = (k: string, v: string | number) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.key || !form.shortName || !form.fullName) return alert('Key, Short Name, and Full Name are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'professionalBodies', editing), { ...form });
      } else {
        await addDoc(collection(db, 'professionalBodies'), { ...form, order: form.order || docs.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY); setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const startEdit = (d: ProfessionalBodyDoc) => {
    setEditing(d.id);
    setForm({ key: d.key, shortName: d.shortName, fullName: d.fullName, contentText: d.contentText || '', order: d.order, imageUrl: d.imageUrl || '', storagePath: d.storagePath || '' });
  };

  const remove = async (id: string, storagePath?: string) => {
    if (!confirm('Delete this professional body?')) return;
    try {
      if (storagePath) await deleteFile(storagePath);
      await deleteDoc(doc(db, 'professionalBodies', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedDefaults = async () => {
    if (!confirm(`Add all ${DEFAULT_PROFESSIONAL_BODIES.length} current professional bodies as a starting point? You can edit or delete any of them afterwards.`)) return;
    setSeeding(true);
    try {
      for (const d of DEFAULT_PROFESSIONAL_BODIES) {
        await addDoc(collection(db, 'professionalBodies'), { ...d, createdAt: serverTimestamp() });
      }
    } catch (e) {
      alert(`Couldn't add starter bodies: ${(e as Error).message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Professional Body' : 'Add Professional Body'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Powers the logo grid on the Professional Bodies research page — each logo links through to that body's
          own page, which shows the Content below.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-key">Key * (unique, lowercase, e.g. ieee-pes)</label>
            <input id="field-key" value={form.key} onChange={(e) => set('key', e.target.value.trim().toLowerCase().replace(/\s+/g, '-'))} placeholder="ieee-pes" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-short-name">Short Name * (shown collapsed, e.g. IEEE PES)</label>
            <input id="field-short-name" value={form.shortName} onChange={(e) => set('shortName', e.target.value)} placeholder="IEEE PES" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-full-name">Full Name *</label>
            <input id="field-full-name" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="IEEE Power and Energy Society" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} min={0} />
          </div>
          <div className="admin-field admin-field--full">
            <label>Logo (shown as a circle on the Professional Bodies grid)</label>
            <ImageUploader
              folder="vwu/research/professional-bodies"
              currentUrl={form.imageUrl}
              aspect={1}
              label="Upload Logo"
              onUploaded={(r: UploadResult) => setForm((p) => ({ ...p, imageUrl: r.url, storagePath: r.path }))}
            />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-content">Content — a plain line is a paragraph; blank lines are just for
              readability. For a bullet list, start each line with <code>- </code> (use <code>- Label: text</code>{' '}
              to bold just the label). For a named person (advisor, chair, ...) with contact details, add a line{' '}
              <code>PERSON: Role | Name | detail one | detail two</code> (as many detail fields as you need). For a
              small label/value panel (chapter name, ID, ...), add a line <code>CHAPTER: Label | Value</code> per
              row. For a dated activities log, add one line <code>ACTIVITIES: List Title</code> then one{' '}
              <code>- Event name | Date</code> line per row underneath — put this section last, since everything
              after <code>ACTIVITIES:</code> is read as an activity row.</label>
            <textarea
              id="field-content"
              rows={14}
              value={form.contentText}
              onChange={(e) => set('contentText', e.target.value)}
              placeholder={'IEEE is the world\'s largest professional association dedicated to advancing technological innovation.\n\nPERSON: Faculty Advisor | Dr. Name | Associate Professor — ECE Department\n\nCHAPTER: Chapter Name | SVECW-IEEE\n\nACTIVITIES: List of Activities\n- One Day Workshop on AI | 15 April 2024\n- Guest Lecture on IoT | 20 May 2024'}
            />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update' : 'Add Body'}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">Professional Bodies ({docs.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Logo</th><th>Order</th><th>Short Name</th><th>Full Name</th><th>Actions</th></tr></thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id}>
                    <td>
                      {d.imageUrl ? (
                        <img src={d.imageUrl} alt={d.shortName} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-light-gray, #d1d5db)' }} />
                      ) : (
                        <span className="admin-field__hint" style={{ margin: 0 }}>None</span>
                      )}
                    </td>
                    <td>{d.order}</td>
                    <td>{d.shortName}</td>
                    <td>{d.fullName}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(d)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(d.id, d.storagePath)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {docs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="admin-empty">
                      No professional bodies yet — the page is showing its original hardcoded content.{' '}
                      <button className="admin-btn admin-btn--sm" onClick={seedDefaults} disabled={seeding}>
                        {seeding ? 'Adding…' : 'Add starter bodies'}
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
