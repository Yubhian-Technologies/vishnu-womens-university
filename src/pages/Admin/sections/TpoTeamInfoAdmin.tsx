import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection, type WithId } from '../../../hooks/useCollection';

export interface TpoTeamBioDoc extends WithId {
  name: string;
  paragraphs: string[];
  accomplishmentsIntro: string;
  accomplishments: string[];
  email: string;
  phone: string;
  order: number;
}

const EMPTY = {
  name: '', paragraphs: [] as string[], accomplishmentsIntro: '', accomplishments: [] as string[],
  email: '', phone: '', order: 0,
};

function linesToArray(text: string): string[] {
  return text.split('\n').map((s) => s.trim()).filter(Boolean);
}
function arrayToLines(arr: string[] = []): string {
  return arr.join('\n');
}

// The original hardcoded tpoTeamBios.data.ts content, used as the one-click
// starting point when this collection is still empty — see seedBios below.
const DEFAULT_BIOS: Omit<TpoTeamBioDoc, 'id'>[] = [
  {
    name: 'Mr. Satish Paruchuri', order: 1, accomplishmentsIntro: '', accomplishments: [], email: '', phone: '',
    paragraphs: [
      'Satish Paruchuri, is currently the Director (Industry Relations) at Sri Vishnu Educational Society.',
      'He, along with his team members, looks after Placements, Internships and Industry Interaction. Before his arrival to SVES, Mr. Paruchuri had been with Institute for Electronic Governance (IEG), Government of AP as Program Manager on a mission to enhance employability of young engineers. In this direction, he worked very hard in helping 20,000 students from 200 engineering colleges to get employment in more than 30 IT Companies. IBM, CSC, CA, Mahindra Satyam, TCS and Infosys are a few to name among them.',
      'He has a big success story. On behalf of the Government, he signed MoUs with Microsoft, IBM, CSC and Infosys that have enabled a lakh or more students with opportunities through training in the latest technology. Prior to IEG, he was with Center for Good Governance as Systems Designer, architecting IT applications for Government Programs. Mr Paruchuri managed offshore IT projects for INCOMP Technologies and a Dallas, US based organization at Hyderabad.',
    ],
  },
  {
    name: 'Mr. Ravikiran Saili', order: 2, email: '', phone: '',
    paragraphs: [
      'Mr. Ravikiran Saili completed his Masters in Information Systems from Arts & Science College, Kakatiya University, Warangal in 2003. Upon completion of his masters, he joined Institute for Electronic Governance in the year 2004 as IT Trainer and held various positions such as IT Associate and Project Manager.',
      'At present he is Manager (Industry Relations) at Sri Vishnu Educational Society. He has over 8 years of experience in the areas of HR Functions, Operations, Process Management, Administration, Project Management, Data Management and Report Generation. With all this expertise, he is able to provide mentorship and coaching to team members for better results. During his tenure with JKC, he was responsible for overseeing the relations with the JKC registered institutions, coordinating the recruitment activities for JKC students, leading the team which is looking after the JKC portal, the backbone of all the JKC activities.',
    ],
    accomplishmentsIntro: 'Some of the remarkable accomplishments during his stint with JKC are',
    accomplishments: [
      'Succeeded in driving the novel concept of JKC to the fore of Engineering Colleges across the state during its initial stages.',
      'Essayed a major role in buying the JKC concept by most of engineering institutions across the state and streamlining the entire process of registrations, training activities, workshops and recruitment events.',
      'Part of the top 5% in the organization to develop the strategies for JKC registration process, training activities, recruitment events etc.,',
      'Played a key role in developing the JKC Portal – An online portal for all the JKC registered colleges and students across the state with a daily load of more than 5000 hits.',
      'Coordinated more than 400 on campus, off campus or pooled campus recruitment events for JKC students across the state.',
      'Played a key role in placing more than 15,000 JKC students at various MNCs and Indian companies.',
    ],
  },
  {
    name: 'Dr. K Vamshi Krishna Varma', order: 3, accomplishmentsIntro: '', accomplishments: [],
    paragraphs: [
      'Dr.K Vamshi Krishna Varma has an overall 23.5 years of experience with 13.5 years of industry experience & 10 years as Head Training & placements/Industry Relations along with international exposure, expertise in multiple domains is at the helm of affairs.',
      'Worked in ECIL, NPTI, Access company LTD (Japan), Texas Instruments (Israel), Sasken communications, NEC Electronics, Samsung India, LG electronics, University of Tokyo, ST Microelectronics in various cutting edge technologies. Played Program manager, Principal Engineer, Architect, Business development, Center Head Roles in different organizations.',
      'Worked in G.Pullareddy & G.Narayanamma Engg colleges, MGIT Hyderabad as Head Training & Placements. Building Technical teams. Completed B.Tech(EEE) from S.V University Tirupati in 1998, M.Tech(Power Electronics) from JNTU A in 2013, PGDM(HR & GM) from MIT School Pune in 2016, Received Ph D(EEE) degree from Kalasalingam Academy of Research and Education in 2022.',
    ],
    email: 'vamshivarma.k@srivishnu.edu.in',
    phone: '9618274392',
  },
  {
    name: 'Ms. D. Pushpa', order: 4, accomplishmentsIntro: '', accomplishments: [], email: '', phone: '',
    paragraphs: [
      'Pushpa Diddi has an overall experience of 7 Years in HR and Administration with qualified Masters Degree in Business Administration from Kakatiya University, Warangal. Experience span across important functions like Induction, HR Generalist role and Admin role.',
      'Prior to joining Sri Vishnu, Pushpa worked in Atlanta Systems Pvt Ltd as a HR Personnel, played an active role in Manpower Planning, Talent Acquisition, Induction, Training and Development areas. Then she joined IEG now called TASK, a society run by the State Government and worked for 4 years in the capacity of Team Lead.',
      'As a Team Lead, she played a key role of HR Generalist involved in induction for the new recruits joining formalities, Formalities of Resignation, Experience letters, Exit Interviews, Handling employee issues, Organizing weekly team meetings, Preparing the minutes of the same and sending it across to all the team members. Knowledge of ISO 9001:2008 (QMS). Maintain HRMS (employee data), Online enrollment and relieving process of the employee.',
    ],
  },
  {
    name: 'Mr. Atul Kirdant', order: 5, accomplishmentsIntro: '', accomplishments: [], email: '', phone: '',
    paragraphs: [
      'Mr. Atul Kirdant has been with Sri Vishnu Educational Society since 2012 as Industry Liaison Officer (Pune Region)',
      'He did his B.Sc. from BAMU, Pune and MBA in marketing from IIPM.',
      'Presently, he is looking after internships and placements. He is visiting IT & Core sector companies of Pune region and meeting Corporate HR Heads in the process of on campus and off campus recruitments.',
      'Previously, he worked for Seed Infotech & ICFAI University Pune in the areas of Promotional and branding activities in Pune region.',
    ],
  },
  {
    name: 'Mr. Arokiadoss', order: 6, accomplishmentsIntro: '', accomplishments: [], email: '', phone: '',
    paragraphs: [
      'Mr. Arokiadoss took the position of an Industry Liaison Officer for Tamil Nadu Region in 2013.',
      'Regarding his formal schooling, he succeeded in his Bachelor of Engineering from Annai Teresa college of Engineering, Madras University in 2003 and Master of Business Administration from Alagappa University in 2006.',
      'He has more than 6 years of industrial experience which has helped him hone his skills in the area of general administration, personnel management, facility management, man management. His deftness in maintaining harmonious employee relations has sustained strong cultural and imbibing values of the organization where he worked. He is good at the entire corporate recruitment process and a counselor in giving suggestions to HR related problems.',
      'He believes in the fact that life has a variety of experiences to offer and one should learn from it in every aspect and deliver the goods efficiently.',
    ],
  },
  {
    name: 'Mr. Ramesh T.S', order: 7, accomplishmentsIntro: '', accomplishments: [], email: '', phone: '',
    paragraphs: [
      'Mr. Ramesh T.S joined the SVES family as the Industry liaison officer at Bangalore. He holds a bachelor’s degree in Mechanical engineering and a P.G diploma in Business Administration.',
      'He brings to the table a vast experience from the Industry where he was involved in Brand building, business development and training activities among many others.',
      'He joined the HMS group of Institution as the training and placement officer. Apart from imparting employability skills to the students, he has liaised with industries. SVES welcomes Mr. Ramesh T.S into its fold.',
    ],
  },
  {
    name: 'Mr. Saurabh Mishra', order: 8, accomplishmentsIntro: '', accomplishments: [], email: '', phone: '',
    paragraphs: [
      'MBA From welinker Inst. Mumbai and worked with Vodafone as HR, then Times of India, IPEM group, Sparsh Education Group, Sharda & Amity University',
      'Corporate Relations as a strategic business partner and meeting them by aligning and integrating human resource pillars with current and strategic business needs for a professionally managed company. Handling a wide range of assignments for campus Placement & recruitment & Corporate Relations, CSR, Job fairs, Outreach Activity, MOU, HR Conclave etc.',
    ],
  },
  {
    name: 'Ms. Venkata Swathi R', order: 9, accomplishmentsIntro: '', accomplishments: [], email: '', phone: '',
    paragraphs: [
      'Ms. Venkata Swathi R, Training and Placement Officer (TPO) and Assistant Professor in the Department of Computer Science Engineering, is pursuing a Ph.D. in Computer Science and Engineering at JNTUK. She holds an M. Tech and a B. Tech in Computer Science disciplines, both from JNTUK, having 16 years of teaching experience.',
      'She oversees student training and placement activities, maintaining strong industry connections to facilitate placements. She collaborates with the industry-Institute Interaction Coordinator to organize guest lectures by industry experts. Additionally, she gathers feedback from recruiting companies and arranges soft skills and interview training programs using both institutional and external resources.',
    ],
  },
  {
    name: 'Mr. K. P. Swaroop', order: 10, accomplishmentsIntro: '', accomplishments: [], email: '', phone: '',
    paragraphs: [
      'Mr. K. P. Swaroop is the Assistant Training and Placement Officer and an Assistant Professor in the Department of Electrical and Electronics Engineering. He is currently pursuing a Ph.D. from JNTUK Kakinada and holds an M. Tech. from JNTUH and a B.E. from Andhra University in the same field. With 15 years of teaching experience, he plays an active role in academics and student engagement.',
      'He is responsible for managing a range of training and placement activities, including coordinating placement drives, overseeing logistics, and conducting Campus Recruitment Training (CRT) by utilizing both institutional resources and external expertise. He actively tracks student performance and develops strategies to improve their career readiness.',
    ],
  },
  {
    name: 'Dr. C. P. Pavan Kumar Hota', order: 11, accomplishmentsIntro: '', accomplishments: [], email: '', phone: '',
    paragraphs: [
      'Dr. C. P. Pavan Kumar Hota is an accomplished academician and researcher, currently serving as the Assistant Training and Placement Officer and Assistant Professor in the Department of Artificial Intelligence at Shri Vishnu Engineering College for Women, Andhra Pradesh. He holds a Ph.D. in Computer Science and Engineering from Annamalai University, an M. Tech in Computer Science and Engineering from JNTUK, and a B. Tech in Computer Science and Engineering from Andhra University.',
      'With over 10 years of teaching experience and a strong research background in Educational Data Mining, Learner Behaviour, Educational Psychology, and Cognition, Dr. Hota is committed to enhancing student learning outcomes through data-driven insights. His expertise lies in Data analytics, student performance evaluation, and cognitive ability prediction, helping to refine training and placement strategies for improved employability. As the Assistant Training and Placement Officer, he plays a pivotal role in Overseeing training and placement activities, continuous monitoring of student performance, to enhance student career readiness. His professional development includes certifications in Outcome-Based Education, NBA Accreditation, and Teaching-Learning in Engineering (NATE), along with expertise in Psychology and Machine Learning. Passionate about Educational research and continuous learning, Dr. Hota actively seeks collaborations to advance training initiatives.',
    ],
  },
];

// Full bios shown when a "TPO Team" roster row (Admin → Placement Sub-pages
// → TPO Team) is expanded on the public site — see the `name` field's hint
// below. Photos for these same people are uploaded separately, from TPO
// Team Photos, keyed by this same name.
export default function TpoTeamInfoAdmin() {
  const { docs: bios, loading } = useOrderedCollection<TpoTeamBioDoc>('tpoTeamBios', 'order');
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof EMPTY, v: string | number | string[]) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!form.name || form.paragraphs.length === 0) return alert('Name and at least one bio paragraph are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, 'tpoTeamBios', editing), { ...form });
      } else {
        await addDoc(collection(db, 'tpoTeamBios'), { ...form, order: form.order || bios.length + 1, createdAt: serverTimestamp() });
      }
      setForm(EMPTY);
      setEditing(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (b: TpoTeamBioDoc) => {
    setEditing(b.id);
    setForm({
      name: b.name, paragraphs: b.paragraphs || [], accomplishmentsIntro: b.accomplishmentsIntro || '',
      accomplishments: b.accomplishments || [], email: b.email || '', phone: b.phone || '', order: b.order,
    });
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this bio?')) return;
    try {
      await deleteDoc(doc(db, 'tpoTeamBios', id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  const seedBios = async () => {
    if (!confirm('Add the original 11 TPO Team bios as a starting point?')) return;
    try {
      for (const b of DEFAULT_BIOS) await addDoc(collection(db, 'tpoTeamBios'), { ...b, createdAt: serverTimestamp() });
    } catch (e) {
      alert(`Couldn't add starter bios: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">{editing ? 'Edit Bio' : 'Add Bio'}</h2>
        <p className="admin-lead" style={{ marginBottom: '1rem' }}>
          Powers the expanded view when a row on the TPO Team page (Admin → Placement Sub-pages → TPO Team) is
          clicked. The Name below must exactly match that person's name in the TPO Team roster, or the bio won't
          show up. Photos are uploaded separately, from TPO Team Photos.
        </p>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="field-name-must-match-tpo-team">Name (must match TPO Team roster) *</label>
            <input id="field-name-must-match-tpo-team" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Mr. Satish Paruchuri" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-display-order">Display Order</label>
            <input id="field-display-order" type="number" value={form.order} onChange={(e) => set('order', +e.target.value)} min={0} />
          </div>
          <div className="admin-field">
            <label htmlFor="field-email-optional">Email (optional)</label>
            <input id="field-email-optional" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="name@srivishnu.edu.in" />
          </div>
          <div className="admin-field">
            <label htmlFor="field-phone-optional">Phone (optional)</label>
            <input id="field-phone-optional" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="9618274392" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-bio-paragraphs-one-per-line">Bio Paragraphs (one per line) *</label>
            <textarea id="field-bio-paragraphs-one-per-line" rows={6} value={arrayToLines(form.paragraphs)} onChange={(e) => set('paragraphs', linesToArray(e.target.value))} />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-accomplishments-intro-optional">Accomplishments Intro (optional)</label>
            <input id="field-accomplishments-intro-optional" value={form.accomplishmentsIntro} onChange={(e) => set('accomplishmentsIntro', e.target.value)} placeholder="Some of the remarkable accomplishments during his stint with JKC are" />
          </div>
          <div className="admin-field admin-field--full">
            <label htmlFor="field-accomplishments-one-per-line-optional">Accomplishments (one per line — optional)</label>
            <textarea id="field-accomplishments-one-per-line-optional" rows={4} value={arrayToLines(form.accomplishments)} onChange={(e) => set('accomplishments', linesToArray(e.target.value))} />
          </div>
        </div>
        <div className="admin-form-actions">
          {editing && <button className="admin-btn admin-btn--ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
          <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Bio'}</button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">TPO Team Bios ({bios.length})</h2>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
              <tbody>
                {bios.map((b) => (
                  <tr key={b.id}>
                    <td>{b.order}</td>
                    <td>{b.name}</td>
                    <td>{b.email}</td>
                    <td>{b.phone}</td>
                    <td>
                      <button className="admin-btn admin-btn--sm" onClick={() => startEdit(b)}>Edit</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => remove(b.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {bios.length === 0 && (
                  <tr>
                    <td colSpan={5} className="admin-empty">
                      No bios yet.{' '}
                      <button className="admin-btn admin-btn--sm" onClick={seedBios}>Add starter bios</button>
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
