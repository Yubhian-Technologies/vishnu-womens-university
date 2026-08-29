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

const admissionProcedureIntro = 'Application for admission to the Hostel shall be made in the prescribed form, which can be had from the SVES Hostel Office, along with prospectus.';

const admissionProcedureRules: string[] = [
  'The Hostel is under the Management of the Chairman, Sri Vishnu Educational Society, Bhimavaram. He nominates the Hostel Committee and the Warden functions as per the directions of the Chairman of the Committee.',
  'The Warden reserves the right to effect any changes that may be felt necessary in routine matters of the Hostel.',
  'Admission is open to the students studying in the colleges located in Vishnupur, Bhimavaram run by Sri Vishnu Educational Society and Padmabushan Dr. B.V.Raju Foundation.',
  'The students should acquaint themselves thoroughly with the Rules and Regulations of the Hostel before seeking admission.',
  'The Hostel Committee reserves the right to admit or reject a candidate without assigning any reasons and to expect any student, if found not amenable to discipline.',
  'The Parents or guardians of the selected students must be present with them at the time of admission.',
  'Rooms are allotted to the students by the warden following specific guidelines framed by the committee.',
  'Students, selected for admission, shall join the Hostel on or before the due date, after paying the prescribed fees, failing which their seats shall be forfeited.',
  'Once a student pays the prescribed fee to the Bank, she is deemed to have been admitted to the Hostel. I.D. Cards are issued to the hostel students. She is eligible for refund of caution deposit and mess advance, if any, when she leaves the Hostel after admission or on transfer etc.',
  'Students who have not secured eligibility to go to the next higher semester / class shall leave the Hostel immediately. The amount paid at the time of admission shall not be refunded except the amount paid against the Mess Advance and Caution Deposit.',
  'Admissions are made afresh to the hostel every year. Students who apply for readmission in the Hostel should attach marks cards of previous year / semesters (odd or even) along with the application form. They, however, need not pay the admission fee. They are admitted only after clearing the dues/ arrears, if any.',
  'Four stamp size recent color photographs should be submitted along with the application form. Any student, who vacates the hostel in the middle of the year on any personal ground, will not be readmitted during the rest of the course, unless approved by the committee.',
  'Students suffering from contagious diseases / drug addicts are not eligible for admission. If after admission students, found to be having contagious diseases and drug addicts, shall be sent out of the Hostel immediately. She is eligible for refund of money as per Rule No.9 of Admission.',
  'Before actual admission, every student shall give a written undertaking that she will abide by the Rules and Regulations of the Hostel.',
];

const accommodationRules: string[] = [
  'Three students are normally accommodated in each room. Each room is provided with necessary beds, tables, chairs, racks, a ceiling fans and lights etc.',
  'The allotment of room shall be done by the warden in consultation with the Hostel Committee.',
  'If any room is left vacant after the admissions are over, such room shall be allotted to the Boarders who desire to have a single room on an additional payment.',
  'After allotment of the rooms, if any Boarder changes the room without the written orders of the warden, she shall be liable for dismissal from the Hostel or a fine of Rs.1000 or both.',
  'Hostel furniture shall not be shifted from one room to another room under any circumstances. Boarders are responsible for the care of the furniture and fittings provided in their rooms.',
  'Boarders leaving the hostel shall handover the articles, given to them at the time of admission, to the warden or her authorized person and obtain a certificate to that effect. Any boarder who fails to do so, shall not only pay for any damages or losses but also be liable to a fine of not less than Rs.800 at the discretion of the warden.',
  'No boarder shall be allowed to stay outside the hostel. They shall obtain written permission from the warden before they leave the Hostel.',
  'Every boarder shall equip herself with bedding, mosquito net or curtain, a table cloth, a mug, bucket etc. Boarders shall not use their own utensils like drinking water glasses or tumblers, coffee glass/ cups, spoons, plates etc., in the dining hall. These shall be supplied by the Management.',
  'Boarders are not permitted to use any electrical appliance like electric iron, water heater, and stove. They are not allowed to make private arrangements for any special comfort. If such things are observed, they are liable for dismissal from the hostel along with a fine of Rs.1500/-.',
  'Each room is provided with switches, tube light, ceiling fan with regulator etc. Any replacement due to breakages etc., shall be made good by the Management at the cost of the boarders.',
  'Each room is provided with a door along with shutters, shelves / racks and suitable glass panes to the windows and ventilator shutters along with fixture and fittings. They shall be maintained safely by the boarders of the respective rooms failing which they shall be charged with the cost of materials, fixtures, labor charges etc., and the same shall be deducted from the caution deposit/mess advance.',
  'The security person/staff authorized by the warden have every right to check the belongings of the boarders at the time of vacating the hostel for short and long term vacations / dismissal from the hostel in order to safe guard the property of the management.',
  'In case of doubt or suspicion, the security persons/ staff authorized by the warden shall have the powers to check the belongings of the boarders at any time and also while going out of the hostel on ordinary days.',
  'If any complaints are received by the warden regarding the violation of the above rules, disciplinary action will be initiated against such boarders and they shall be made responsible for the loss / theft of articles belonging to the managements along with a minimum fine of Rs.1500.',
];

const amenitiesRules: string[] = [
  'To improve their General Knowledge, Newspapers and Educative Periodicals are provided in the reading room. The selection of Newspaper and Periodicals shall be done by the boarders but approved by the Warden and their cost shall be charged to all Boarders on dividing system. They may read only at this reading room, but shall not carry the same to their rooms.',
  'Free internet connectivity through Wi-Fi system for academic purposes only and subject to conditions.',
  'Arrangement for 24 hours power supply.',
  'A reading room / T.V. room is provided separately in each block. It will be operated during stipulated hours.',
  'In special situations Boarders shall be allowed to watch T.V. Programs after the specified hours, on obtaining the prior written permission from the warden well in advance.',
  'Indoor / outdoor games are provided in the hostel.',
  'In case of serious illness or for the treatment suggested by the specialist doctor, the Management provides transport facility for admitting her to a nursing home / hospital at her own cost. Students permitted for outings on medical grounds have to submit MEDICAL REPORTS & CERTIFICATES on return.',
  'Students will not permit to consult their family doctors on health ground.',
];

const disciplinePolicyRules: string[] = [
  'Discipline, to be observed in the Hostel, shall be as per the direction of the Hostel Committee and the Warden. Students should observe strict discipline and timings in the Hostel.',
  'Students are not allowed to stay in the Hostel during college hours without the prior permission of the Hostel / College authorities.',
  'They are not allowed to use T.V., Radio, Transistor or Tape Recorder in their rooms. If such things are noticed, disciplinary action will be initiated along with a minimum fine of Rs.500/- each time.',
  'RAGGING in any form in the Hostel premises or in the Campus is an offence as per the Constitution and is prohibited. Any one found indulging in such detrimental activities shall be handed over to the police and is liable for expulsion / dismissal from the Hostel / College immediately along with a minimum fine of Rs.4000/- (Rupees Five Hundred Only).',
  'Defacing the walls or the doors should be avoided. Any willful damage done to the property of the Hostel by boarder will entail for her dismissal from the Hostel along with a minimum fine of Rs.500/- (Rupees Five Hundred Only).',
  'Defacing / rewriting the Memos / Notifications should be avoided. If any such things are noticed by the Warden / Staff, the same will be viewed seriously.',
  'The main gates of the Hostel Building shall be opened only after 6:00 A.M and all the entrance gates of the Hostel shall be closed at 9:00 P.M.',
  'If any Boarder comes late and demands the Security Staff to open the gate, disciplinary action shall be taken against him/her and also a minimum fine of Rs.250/- is levied for the first time without conducting any enquiry.',
  'If the same is repeated for the second time a fine of Rs.500/- will be levied on such Boarders with a show cause notice.',
  'If any Boarder Continues to create indiscipline and does not obey the rules and regulations of the Hostel, she will be sent out of the hostel along with a minimum fee of Rs.1000.',
  'Parents or their authorized guardians with I.D. cards are permitted to visit the hostel between 9.00 am and 6.00pm only on holidays.',
  'Boarders are permitted to leave the hostel and accompany their parents or authorized guardians with I.D. Cards, only once in a month on specified days.',
  'In extraordinary cases, they may be permitted, if a parent / local guardian of another student hailing from the same area accepts the responsibility to accompany.',
  'Students not returning on due date after outings / holidays more than twice will be denied the hostel facilities during subsequent years.',
  'Students are not permitted to go on pilgrimage during working days.',
  'Staying over night outside the Hostel is strictly forbidden. Absence from the Hostel at night without prior written permission from the Warden shall result in dismissal of the boarder concerned along with a fine of Rs.500/- (Rupees Five Hundred Only).',
  'Boarders are not permitted to leave the Hostel premises after 9-00pm without the orders of the Warden.',
  'Boarders shall not issue orders to the Hostel Staff or interfere in their work. Causes of misconduct by Hostel Employees shall immediately be reported to the Warden with full particulars in writing. The warden shall make enquiries and take suitable action there on.',
  'Boarders shall not give tips to Hostel staff.',
  'Boarders are not allowed to put up notices or convene meetings of any sort within the premises of Hostel / Campus. They shall not join any Club / Society /Association except the College Associations, without obtaining a written permission from the Warden.',
  'If the Boarders wish to celebrate Hostel day, they should obtain prior written permission from the warden. The Hostel Day shall be celebrated only on any Holiday. The Hostel mess shall not work on that day evening and the dinner is cancelled.',
  'Students are not permitted to celebrate birthday parties in the college premises. They may arrange the parties in the hostel before 8.30pm after informing the Warden.',
  'A boarder whose name is removed from the college rolls has got no right to occupy a room in the hostel. The warden has full powers to expel such boarders from the hostel.',
  'A boarder, who fails to secure eligibility to go to the next higher semester, is not permitted to stay in the hostel. Refund of amount paid at the time of admission shall be based on rule 9 of Admission.',
  'The boarder who have arrears of previous month shall not be eligible to stay in the Hostel and shall vacate the rooms on or before 1st of next month. They shall claim their refund of advance made towards boarding and Caution Deposit, only after vacating the rooms. This shall also be applicable for Boarder who are dismissed from the Hostel.',
  'If any boarder leaves the Hostel after 1st day of the Month, she shall wait upto 15th of next month for refund of deposits paid towards Mess Advance and Caution Deposit.',
  'Students are permitted to go to their native places only during vacations and are not permitted to leave the hostel during normal / preparation holidays.',
  'Use of ALCOHOL in the room, in the Hostel Premises / Campus is strictly prohibited. Further, students are not permitted to enter the Hostel after consuming Alcohol. If any such incidence is observed or reported by the Residential Warden or by the Authorised Staff, it will be viewed seriously and proper action shall be taken by the Warden in consultation with the Hostel Committee on such Boarders. In this connection a minimum fine of Rs.3000/- shall be levied on such Boarders. Smoking is strictly prohibited in hostel and campus.',
  'The warden has a right to correspond or intimate the parents of Boarders on any matter pertaining to the Hostel and academic affairs.',
  'Playing cards or any game in the room is strictly prohibited. If detected, the warden has a right to expel such Boarders from the Hostel without giving any warning. However a minimum fine of Rs.2,500/- shall be levied and collected from such Boarders.',
  'No Boarder shall be allowed to bring her friends, classmates, parents and relatives to the rooms without the written permission of the Warden. If such things are noticed or brought to the notice of the Warden, disciplinary action shall be taken against such Boarder along with a minimum fine of Rs.500/-.',
  'Guests shall not be allowed to stay in the Hostel, under any circumstances.',
  'No Boarder is permitted to engage or keep her own servant in the Hostel.',
  'Boarders, in their own interest, are advised not to keep money / valuables (Watches, Calculators, Jewels etc.,) in their rooms without locking whenever they go out. The Management shall not be responsible for any such losses and no such complaints will be entertained for enquiry either by the Warden or by the Management.',
  'The inmates of the room shall have their own lock and keys. Whenever they go out of the room, they shall lock the room and leave.',
  'Only authorized visitors are allowed to see the students on Holidays between 9-00 am and 6-00 pm.',
  'Periodical visits by Parents / Guardians to the Hostel for discussion with the Warden are highly appreciated.',
  'Cell Phones are not permitted in the hostel without written permission. Unauthorised phones will be confiscated.',
  'The college/hostel officials reserve the right to screen the suspicious letters addressed to the students.',
  "Every Boarder is expected to cooperate whole heartedly in maintaining the Hostel's peaceful atmosphere.",
  'In all matters concerning admission, interpretation of the rules, disciplinary action etc., the decision of the hostel committee shall be final. We trust that the parents and guardians whole-heartedly cooperate in maintaining and enforcing the discipline.',
];

type TabId = 'about' | 'admission' | 'accommodation' | 'amenities' | 'discipline';

const TABS: { id: TabId; label: string }[] = [
  { id: 'about', label: 'About Hostel' },
  { id: 'admission', label: 'Admission Procedure' },
  { id: 'accommodation', label: 'Accommodation' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'discipline', label: 'Discipline Policies' },
];

const hashToTab: Record<string, TabId> = {
  '#about': 'about',
  '#admission': 'admission',
  '#accommodation': 'accommodation',
  '#amenities': 'amenities',
  '#discipline': 'discipline',
};

export default function CampusHostels() {
  const facility = findCampusFacilityBySlug('campus-hostels');
  const [activeTab, setActiveTab] = useState<TabId>('about');
  const location = useLocation();

  const defaultPhotos = Array.from({ length: 5 }, (_, i) => ({
    src: PHOTO_NEEDED_PLACEHOLDER,
    alt: `Campus Hostels — Photo ${i + 1}`,
    caption: '',
  }));
  const photos = useSitePhotos('campus', 'campus-hostels', defaultPhotos);

  useEffect(() => {
    document.title = 'Campus Hostels | Campus Life | VWU';
  }, []);

  useEffect(() => {
    const tab = hashToTab[location.hash];
    if (tab) setActiveTab(tab);
  }, [location.hash]);

  if (!facility) return null;

  return (
    <main className="page-wrapper">
      <PageHero
        page="campus-campus-hostels"
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

          {/* About Hostel */}
          {activeTab === 'about' && (
            <div>
              <span className="section-label">Campus Life</span>
              <h2 className="section-title" style={{ fontSize: '1.75rem' }}>About {facility.title}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 760 }}>
                <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                  The objective of the Hostel is to provide suitable and comfortable accommodation for deserving students from Andhra Pradesh and outside the State. The Hostel has a number of blocks to accommodate exclusively for girl students.
                </p>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                  Ideal hostel facility with a homely atmosphere is provided within the campus. Mess with a modern kitchen and spacious air-conditioned dining halls are attached to the hostel. Many recreation facilities are also provided.
                </p>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                  To improve their general knowledge, newspapers and educative periodicals are provided in the reading room. The selection of newspapers and periodicals is done by the Boarders but approved by the Warden.
                </p>
                <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75 }}>
                  A reading room / T.V. room is provided separately in each block, operated during stipulated hours. Indoor / outdoor games are provided in the hostel, and pictures are screened regularly in the auditorium.
                </p>
              </div>
            </div>
          )}

          {/* Admission Procedure */}
          {activeTab === 'admission' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>Admission Procedure</h2>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75, marginBottom: 'var(--space-6)', maxWidth: 760 }}>
                {admissionProcedureIntro}
              </p>
              <ol style={{ margin: 0, paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 760 }}>
                {admissionProcedureRules.map((rule) => (
                  <li key={rule} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75 }}>{rule}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Accommodation */}
          {activeTab === 'accommodation' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-6)' }}>Accommodation</h2>
              <ol style={{ margin: 0, paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 760 }}>
                {accommodationRules.map((rule) => (
                  <li key={rule} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75 }}>{rule}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Amenities */}
          {activeTab === 'amenities' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-6)' }}>Amenities</h2>
              <ol style={{ margin: 0, paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 760 }}>
                {amenitiesRules.map((rule) => (
                  <li key={rule} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75 }}>{rule}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Discipline Policies */}
          {activeTab === 'discipline' && (
            <div>
              <h2 className="section-title" style={{ marginBottom: 'var(--space-6)' }}>Discipline Policies</h2>
              <ol style={{ margin: 0, paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 760 }}>
                {disciplinePolicyRules.map((rule) => (
                  <li key={rule} style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', lineHeight: 1.75 }}>{rule}</li>
                ))}
              </ol>
            </div>
          )}

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
