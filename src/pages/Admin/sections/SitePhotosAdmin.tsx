import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrderedCollection } from '../../../hooks/useCollection';
import { deleteFile, type UploadResult } from '../../../lib/storage';
import { PHOTO_NEEDED_PLACEHOLDER } from '../../../lib/photoPlaceholder';
import { useImageCropModal } from '../../../components/ImageUploader/useImageCropModal';

export interface SitePhotoDoc {
  id: string;
  page: string;
  section?: string; // sub-section key; missing = 'main' (pre-existing galleries)
  imageUrl: string;
  storagePath: string;
  alt: string;
  caption: string;
  order: number;
}

export const SITE_PHOTO_PAGES = [
  { value: 'campus', label: 'Campus Life' },
  { value: 'about', label: 'About VWU' },
  { value: 'academics', label: 'Academics' },
  { value: 'admissions', label: 'Admissions' },
  { value: 'governance', label: 'Governance' },
  { value: 'vision-mission', label: 'Vision & Mission' },
  { value: 'student-life', label: 'Student Life' },
  { value: 'information', label: 'Information' },
  { value: 'about-sves', label: 'About SVES' },
  { value: 'alumni-giving', label: 'Alumni & Giving' },
  { value: 'arts-culture', label: 'Arts & Culture' },
  { value: 'vishnu-tv', label: 'Vishnu TV Academy' },
  { value: 'sports-games', label: 'Sports & Games' },
  { value: 'social-services', label: 'Social Services (NSS)' },
  { value: 'iqac', label: 'IQAC' },
];

interface SlotDefault { imageUrl: string; alt: string; caption: string; label?: string; }
interface SectionDef { label: string; slots: SlotDefault[]; }

// A new (non-'main') sub-section's 5 slots, all pointing at the shared
// "Photo Needed" placeholder until a real photo is uploaded for each.
function placeholderSection(label: string, titles: string[]): SectionDef {
  return {
    label,
    slots: titles.map((title) => ({
      imageUrl: PHOTO_NEEDED_PLACEHOLDER,
      alt: title,
      caption: '',
      label: title,
    })),
  };
}

// A single-topic sub-section (e.g. one specific facility) — 5 generic photo
// slots for that one topic, rather than 5 differently-named topics.
function placeholderPhotoBank(label: string): SectionDef {
  return {
    label,
    slots: Array.from({ length: 5 }, (_, i) => ({
      imageUrl: PHOTO_NEEDED_PLACEHOLDER,
      alt: `${label} — Photo ${i + 1}`,
      caption: '',
      label: `Photo ${i + 1}`,
    })),
  };
}

// `main` holds each page's original, real photo set — unchanged from before
// sub-sections existed. Every other key is a brand-new sub-section with no
// real photos yet (see placeholderSection above).
const DEFAULT_SECTIONS: Record<string, Record<string, SectionDef>> = {
  campus: {
    main: {
      label: 'Main Gallery',
      slots: [
        { imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80', alt: 'Smart classrooms', caption: 'Smart Classrooms', label: 'Main Entrance' },
        { imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80', alt: 'Research labs', caption: 'Research Labs', label: 'Academic Blocks' },
        { imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80', alt: 'Central library', caption: 'Central Library', label: 'Central Library Building' },
        { imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80', alt: 'Campus hostel', caption: 'Student Hostels', label: 'Open Air Auditorium' },
        { imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80', alt: 'Sports facilities', caption: 'Sports Courts', label: 'Green Spaces & Gardens' },
        { imageUrl: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&q=80', alt: 'Campus dining', caption: 'Food Courts' },
        { imageUrl: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80', alt: 'Campus life', caption: 'Green Campus' },
        { imageUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&q=80', alt: 'Green environment', caption: 'Campus Gardens' },
        { imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', alt: 'Events auditorium', caption: 'Main Auditorium' },
        { imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80', alt: 'Technical events', caption: 'Technova Symposium' },
        { imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', alt: 'Students studying', caption: 'Collaborative Learning' },
        { imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80', alt: 'Campus events', caption: 'Cultural Programs' },
      ],
    },
    'facilities-infrastructure': placeholderSection('Facilities & Infrastructure', [
      'Main Entrance', 'Academic Blocks', 'Central Library Building', 'Open Air Auditorium', 'Green Spaces & Gardens',
    ]),
    'hostels-living': placeholderSection('Hostels & Living', [
      'Hostel Blocks Exterior', 'Standard Room Layout', 'Dining Hall & Mess', 'Indoor Recreation Room', 'Security & Main Gate',
    ]),
    // The 16 real "Discover > Campus Life" header dropdown items — each its
    // own 5-photo bank, matching the real nav exactly (Header.tsx navItems).
    'smart-classrooms': placeholderPhotoBank('Smart Class Rooms'),
    'state-of-the-art-labs': placeholderPhotoBank('State-of-the-art Labs'),
    'central-library': placeholderPhotoBank('Central Library'),
    'auditoriums': placeholderPhotoBank('Auditoriums'),
    'campus-book-stores': placeholderPhotoBank('Campus Book Stores'),
    'wifi-campus': placeholderPhotoBank('Wi-Fi Campus'),
    'campus-hostels': placeholderPhotoBank('Campus Hostels'),
    'food-courts': placeholderPhotoBank('Food Courts'),
    'fitness-centre': placeholderPhotoBank('VISHNU Fitness Centre'),
    'staff-quarters': placeholderPhotoBank('Staff Quarters'),
    'travel-desk': placeholderPhotoBank('Travel Desk'),
    'temples': placeholderPhotoBank('Temples'),
    'health-care': placeholderPhotoBank('Health Care'),
    'swimming-pool': placeholderPhotoBank('Swimming Pool'),
    'campus-security': placeholderPhotoBank('Campus Security'),
    'other-facilities': placeholderPhotoBank('Other Facilities'),
  },
  about: {
    main: {
      label: 'Main Gallery',
      slots: [
        { imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80', alt: 'Smart classrooms at VWU', caption: 'Smart Classrooms', label: 'Gallery Photo 1' },
        { imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80', alt: 'Research laboratories', caption: 'Research Labs', label: 'Gallery Photo 2' },
        { imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80', alt: 'Central library', caption: 'Central Library', label: 'Gallery Photo 3' },
        { imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', alt: 'Students studying', caption: 'Student Collaboration', label: 'Gallery Photo 4' },
        { imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80', alt: 'Sports facilities', caption: 'Sports Facilities', label: 'Gallery Photo 5' },
        { imageUrl: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=900&q=80', alt: 'VWU campus Bhimavaram', caption: '', label: '"Who We Are" section photo' },
        { imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=900&q=80', alt: 'VWU campus facilities', caption: '', label: '"Campus Snapshot" section photo' },
        { imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=900&q=80', alt: 'Sri Vishnu Educational Society campus', caption: '', label: '"Our Parent Society" (SVES) section photo' },
      ],
    },
    'history-heritage': placeholderSection('History & Heritage', [
      'Founders & Visionaries', 'Historical Milestones', 'Archive Photos', 'First Batch Celebration', 'Legacy Buildings',
    ]),
    'accreditation-rank': placeholderSection('Accreditation & Rank', [
      'NAAC Certificate', 'NIRF Ranking Banner', 'Outstanding Achievement Awards', 'ISO Certification', 'Global Affiliations',
    ]),
  },
  academics: {
    main: {
      label: 'Main Gallery',
      slots: [
        { imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80', alt: 'Smart lecture halls', caption: 'Smart Lecture Halls', label: 'Smart Lecture Halls' },
        { imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80', alt: 'Specialised research labs', caption: 'Research Labs', label: 'Research Labs' },
        { imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80', alt: 'Technical hackathons', caption: 'Hackathons & Projects', label: 'Hackathons & Projects' },
        { imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80', alt: 'Library resources', caption: 'Digital Library', label: 'Digital Library' },
        { imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', alt: 'Group learning sessions', caption: 'Collaborative Learning', label: 'Collaborative Learning' },
      ],
    },
    'classrooms-labs': placeholderSection('Classrooms & Labs', [
      'Smart Lecture Halls', 'Advanced Computer Lab', 'Electronics Lab', 'Physics & Chemistry Labs', 'Seminar & Discussion Rooms',
    ]),
    'research-innovation': placeholderSection('Research & Innovation', [
      'R&D Centers', 'Student Innovation Hub', 'Project Expo Day', 'Patents & Publications', 'Incubation Center',
    ]),
  },
  admissions: {
    main: {
      label: 'Main Gallery',
      slots: [
        { imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80', alt: 'VWU campus buildings', caption: 'VWU Campus', label: 'Counseling Desk' },
        { imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80', alt: 'Smart classrooms', caption: 'Smart Classrooms', label: 'Student Orientation' },
        { imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80', alt: 'Research labs', caption: 'Specialised Labs', label: 'Campus Tour Guides' },
        { imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80', alt: 'Sports court', caption: 'Sports Facilities', label: 'Helpdesk & Support' },
        { imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80', alt: 'Central library', caption: 'Central Library', label: 'Registration Day' },
      ],
    },
    ug: placeholderSection('Undergraduate (UG)', [
      'B.Tech Counseling', 'UG Orientation', 'UG Lab Demos', 'Classroom Culture', 'Campus Life Preview',
    ]),
    pg: placeholderSection('Postgraduate (PG)', [
      'PG Seminar & Orientation', 'Specialization Research', 'PG Industry Meetups', 'Advanced Computing', 'Graduation Day Prep',
    ]),
  },
  governance: {
    main: {
      label: 'Main Gallery',
      slots: [
        { imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80', alt: 'Governance and administration', caption: 'Institutional Governance', label: 'Governing Body Meet' },
        { imageUrl: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=800&q=80', alt: 'Academic council meeting', caption: 'Academic Council', label: 'Leadership Board' },
        { imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80', alt: 'Convocation ceremony', caption: 'Annual Convocation', label: 'Academic Council' },
        { imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', alt: 'Events and seminars', caption: 'Seminars & Events', label: "Principal's Office" },
        { imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', alt: 'Faculty collaboration', caption: 'Faculty Development', label: 'Committee Assembly' },
      ],
    },
    'board-of-directors': placeholderSection('Board of Directors', [
      "Chairman's Address", 'Board Meeting Hall', 'Vice Chancellor Meet', 'Trust Board', 'Annual General Meeting',
    ]),
    'academic-council': placeholderSection('Academic Council', [
      "Dean's Conference", 'Board of Studies Meeting', 'Curricular Workshop', 'Faculty Council', 'Quality Assurance Cell',
    ]),
  },
  'vision-mission': {
    main: {
      label: 'Main Gallery',
      slots: [
        { imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', alt: 'Students collaborating', caption: 'Collaboration', label: 'Empowering Women in Tech' },
        { imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80', alt: 'Research and innovation', caption: 'Research & Innovation', label: 'Innovation Center' },
        { imageUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&q=80', alt: 'Green campus environment', caption: 'Green Campus', label: 'Global Standards' },
        { imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80', alt: 'Sports and wellness', caption: 'Sports & Wellness', label: 'Research Excellence' },
        { imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80', alt: 'Smart classrooms', caption: 'Smart Classrooms', label: 'Social Responsibility' },
        { imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80', alt: 'VWU quality education', caption: '', label: '"Quality Policy" section photo' },
      ],
    },
    'core-values': placeholderSection('Our Core Values', [
      'Empowering Women in Tech', 'Tech Innovation', 'Global Standards', 'Research Excellence', 'Social Responsibility',
    ]),
  },
  'student-life': {
    main: {
      label: 'Main Gallery',
      slots: [
        { imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', alt: 'Cultural events', caption: 'Cultural Events', label: 'Sports & Athletics' },
        { imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80', alt: 'Sports activities', caption: 'Sports & Fitness', label: 'Cultural Festivals' },
        { imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80', alt: 'Campus festivals', caption: 'Campus Festivals', label: 'Hostel Life & Mess' },
        { imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80', alt: 'Student clubs and workshops', caption: 'Club Activities', label: 'Technical Clubs' },
        { imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', alt: 'Study groups and projects', caption: 'Teamwork', label: 'Cafeteria Hangouts' },
        { imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900&q=80', alt: "Women's hostel at VWU", caption: '', label: '"Housing" section photo' },
        { imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80', alt: 'VWU sports and athletics', caption: '', label: '"Athletics" section photo' },
        { imageUrl: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=900&q=80', alt: 'Campus dining hall', caption: '', label: '"Dining" section photo' },
      ],
    },
    'sports-recreation': placeholderSection('Sports & Recreation', [
      'Basketball Court', 'Track & Field Events', 'Gymnasium', 'Indoor Games Area', 'Annual Sports Meet',
    ]),
    'clubs-festivals': placeholderSection('Clubs & Festivals', [
      'Cultural Fest Stage', 'Technical Club Activities', 'Art & Drama Club', 'Flash Mob / Dance', 'Music & Band Performance',
    ]),
  },
  information: {
    main: {
      label: 'Main Gallery',
      slots: [
        { imageUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&q=80', alt: 'Green campus environment', caption: 'Green Campus', label: 'Notice Board' },
        { imageUrl: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80', alt: 'Campus aerial view', caption: 'Bhimavaram Campus', label: 'Student Help Desk' },
        { imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80', alt: 'Library resources', caption: 'e-Library', label: 'Placement Cell Office' },
        { imageUrl: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&q=80', alt: 'Campus dining', caption: 'Food Courts', label: 'Examination Cell' },
        { imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80', alt: 'Students at orientation', caption: 'Freshers Orientation', label: 'Anti-Ragging Cell' },
      ],
    },
    'placements-careers': placeholderSection('Placements & Careers', [
      'Placement Drive', 'Recruitment Interviews', 'Mock Interview Prep', 'Hall of Fame / Placed Students', 'HR Conclave',
    ]),
    'anti-ragging-safety': placeholderSection('Anti-Ragging & Safety', [
      'Student Safety Seminars', 'Grievance Cell', 'Awareness Poster Displays', 'Counseling Room', 'Campus Patrol & Security',
    ]),
  },
  'about-sves': {
    main: {
      label: 'Main Gallery',
      slots: [
        { imageUrl: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80', alt: 'Green Meadows campus Bhimavaram', caption: 'Green Meadows — Bhimavaram', label: 'SVES Central Campus' },
        { imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80', alt: 'University buildings', caption: 'Academic Blocks', label: 'Founder Chairman' },
        { imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80', alt: 'Students at campus event', caption: 'Student Events', label: 'Society Milestones' },
        { imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80', alt: 'Graduation ceremony', caption: 'Convocation', label: 'Collaborative SVES Events' },
        { imageUrl: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=800&q=80', alt: 'Academic conference', caption: 'Conferences & Seminars', label: 'SVES Leadership Team' },
        { imageUrl: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=900&q=80', alt: 'SVES campus', caption: '', label: '"About SVES" intro section photo' },
      ],
    },
    'sves-heritage': placeholderSection('SVES Campuses & Heritage', [
      'Society Central Office', 'Sister Institutions', 'Founder Chairman Vision', 'Joint Campus Events', 'Community Development Outreach',
    ]),
  },
  'alumni-giving': {
    main: {
      label: 'Main Gallery',
      slots: [
        { imageUrl: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80', alt: 'VWU campus aerial view', caption: '', label: '"Prathibha Magazine" promo photo' },
      ],
    },
  },
  'arts-culture': {
    main: {
      label: 'Main Gallery',
      slots: [
        { imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=900&q=80', alt: 'Cultural performances at VWU', caption: '', label: '"Our Philosophy" section photo' },
      ],
    },
  },
  'vishnu-tv': {
    main: {
      label: 'Main Gallery',
      slots: [
        { imageUrl: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=900&q=80', alt: 'Students in TV studio', caption: '', label: '"About" section photo' },
      ],
    },
  },
  'sports-games': {
    main: {
      label: 'Main Gallery',
      slots: [
        { imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80', alt: 'Students at VWU sports', caption: '', label: '"Our Approach" section photo' },
      ],
    },
  },
  'social-services': {
    main: {
      label: 'Main Gallery',
      slots: [
        { imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=80', alt: 'NSS community service', caption: '', label: '"NSS at VWU" section photo' },
      ],
    },
  },
  // The 8 real "Statutory > IQAC" header dropdown items (Header.tsx
  // navItems). Like the rest of Statutory, these pages share the generic
  // GovernanceDetail.tsx template, which has no photo-rendering area yet —
  // these slots are admin-side only until that template gets one built in.
  iqac: {
    main: placeholderPhotoBank('About IQAC'),
    'iqac-worksystem': placeholderPhotoBank('IQAC Worksystem'),
    'quality-parameters': placeholderPhotoBank('Quality Parameters'),
    'iqac-committee': placeholderPhotoBank('IQAC Committee'),
    'policies-procedures': placeholderPhotoBank('Policies & Procedures'),
    'annual-reports': placeholderPhotoBank('Annual Reports & Reforms'),
    'nirf-reports': placeholderPhotoBank('MHRD NIRF Reports'),
    'nba-data': placeholderPhotoBank('NBA – Data Capturing Points'),
  },
};

// Mirrors the real header nav (src/components/Header/Header.tsx `navItems`)
// exactly, so the admin's top-level grouping matches what visitors actually
// see. Not every menu has pages with an editable photo gallery yet — most
// "Statutory" committee/IQAC pages, Placements, Differentiators, and Quick
// Links are text pages with a single shared banner (already editable via
// Hero Banners) and no distinct content photos; News & Awards' Gallery is
// managed by its own separate, already-working admin section.
interface NavSubGroup { label: string; pages: string[]; }
interface NavCategory { label: string; pages: string[]; subGroups?: NavSubGroup[]; emptyNote?: string; }

const NAV_CATEGORIES: NavCategory[] = [
  {
    label: 'Discover',
    pages: ['about', 'vision-mission', 'about-sves', 'campus', 'information'],
    // Sub-grouped to match the header's "Discover" mega-menu exactly (About
    // Us / Campus Life / Information) — flattening these into one list is
    // what made it hard to find "Campus Life" and "Information" here before.
    subGroups: [
      { label: 'About Us', pages: ['about', 'vision-mission', 'about-sves'] },
      { label: 'Campus Life', pages: ['campus'] },
      { label: 'Information', pages: ['information'] },
    ],
  },
  {
    label: 'Statutory',
    // Governance = the real /governance hub page (real content, already
    // built). IQAC's 8 pages share the generic photo-less GovernanceDetail
    // template (see the comment on `iqac` in DEFAULT_SECTIONS above) — its
    // slots are admin-side only until that template has somewhere to show
    // them. The remaining Committees group (13 items) and the other 4
    // Governance-group detail pages (Governing Body, Academic Council,
    // Board of Studies, Finance Committee) use that same template too, so
    // they're intentionally not listed here yet.
    pages: ['governance', 'iqac'],
  },
  { label: 'Academics', pages: ['academics'] },
  { label: 'Admissions', pages: ['admissions'] },
  { label: 'Student Life', pages: ['student-life', 'arts-culture', 'vishnu-tv', 'sports-games', 'social-services'] },
  {
    label: 'Placements',
    pages: [],
    emptyNote: 'Placements pages currently only have a banner image (editable via Hero Banners) — there\'s no content photo gallery here yet.',
  },
  {
    label: 'Differentiators',
    pages: [],
    emptyNote: 'This page currently only has a banner image (editable via Hero Banners) — there\'s no content photo gallery here yet.',
  },
  {
    label: 'News & Awards',
    pages: [],
    emptyNote: 'Photos here are managed separately by the "Gallery" admin section (see the sidebar) — an already-working system for /news-awards/gallery, kept separate to avoid two systems editing the same photos.',
  },
  { label: 'Alumni & Giving', pages: ['alumni-giving'] },
  {
    label: 'Quick Links',
    pages: [],
    emptyNote: 'This menu is external links and simple pages (Careers, Contact) — there\'s no photo content to manage here.',
  },
];

export default function SitePhotosAdmin() {
  const { docs: allPhotos, loading } = useOrderedCollection<SitePhotoDoc>('sitePhotos', 'order');
  // URL-backed (not useState): which menu/page/sub-section is selected is
  // reflected in the address bar (?navCategory=&photoPage=&photoSection=),
  // so a specific module like "Smart Class Rooms" is directly linkable,
  // shareable, and survives a refresh — clicking a dropdown item genuinely
  // navigates rather than just flipping in-memory state.
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedNavCategory = searchParams.get('navCategory') ?? 'Discover';
  const activePage = searchParams.get('photoPage') ?? 'about';
  const selectedSection = searchParams.get('photoSection') ?? 'main';
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [textForm, setTextForm] = useState({ alt: '', caption: '' });
  const [savingText, setSavingText] = useState(false);
  const [addingExtra, setAddingExtra] = useState(false);
  // Every "Replace Image" / "Add More Photos" upload here goes through this
  // one shared crop step — previously these bypassed cropping entirely and
  // uploaded the raw file as-is, so a photo that didn't already match the
  // slot's aspect ratio would look stretched/off on the public site.
  const { openCrop, cropModal } = useImageCropModal();

  const currentCategory = NAV_CATEGORIES.find((c) => c.label === selectedNavCategory);
  const categoryPages = currentCategory?.pages ?? [];

  const pageSections = DEFAULT_SECTIONS[activePage] ?? {};
  const sectionKeys = Object.keys(pageSections);
  const currentSection = pageSections[selectedSection] ?? pageSections.main;
  const defaults = currentSection?.slots ?? [];

  const scopedPhotos = allPhotos.filter((p) => p.page === activePage && (p.section ?? 'main') === selectedSection);
  const byOrder = new Map(scopedPhotos.map((p) => [p.order, p]));
  const extras = scopedPhotos.filter((p) => p.order >= defaults.length).sort((a, b) => a.order - b.order);
  const pageLabel = (val: string) => SITE_PHOTO_PAGES.find((p) => p.value === val)?.label ?? val;

  const selectNavCategory = (label: string) => {
    const cat = NAV_CATEGORIES.find((c) => c.label === label);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('navCategory', label);
      next.set('photoPage', cat?.pages[0] ?? '');
      next.set('photoSection', 'main');
      return next;
    }, { replace: true });
    setEditingSlot(null);
  };

  const selectPage = (page: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('photoPage', page);
      next.set('photoSection', 'main');
      return next;
    }, { replace: true });
    setEditingSlot(null);
  };

  const selectSection = (section: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('photoSection', section);
      return next;
    }, { replace: true });
    setEditingSlot(null);
  };

  // Replace exactly one slot's photo. Only ever touches the doc for this
  // (page, section, slot) — every other slot, sub-section, and page is
  // untouched, so the rest of the gallery (live or still-default) never
  // disappears.
  const finishReplaceSlot = async (slotIndex: number, result: UploadResult, fileName: string) => {
    setUploadingSlot(slotIndex);
    try {
      const existing = byOrder.get(slotIndex);
      if (existing) {
        await deleteFile(existing.storagePath);
        await updateDoc(doc(db, 'sitePhotos', existing.id), {
          imageUrl: result.url,
          storagePath: result.path,
        });
      } else {
        const def = defaults[slotIndex];
        await addDoc(collection(db, 'sitePhotos'), {
          page: activePage,
          section: selectedSection,
          imageUrl: result.url,
          storagePath: result.path,
          alt: def?.alt ?? fileName,
          caption: def?.caption ?? '',
          order: slotIndex,
          createdAt: serverTimestamp(),
        });
      }
    } catch (e) {
      alert(`Couldn't replace photo: ${(e as Error).message}`);
    } finally {
      setUploadingSlot(null);
    }
  };

  const replaceSlot = (slotIndex: number, file: File) => {
    openCrop(file, `vwu/site-photos/${activePage}/${selectedSection}`, (result) =>
      finishReplaceSlot(slotIndex, result, file.name));
  };

  const resetSlot = async (slotIndex: number) => {
    const existing = byOrder.get(slotIndex);
    if (!existing) return;
    if (!confirm('Reset this slot back to its original default photo?')) return;
    try {
      await deleteFile(existing.storagePath);
      await deleteDoc(doc(db, 'sitePhotos', existing.id));
    } catch (e) {
      alert(`Couldn't reset: ${(e as Error).message}`);
    }
  };

  const startEditText = (slotIndex: number) => {
    const existing = byOrder.get(slotIndex);
    const def = defaults[slotIndex];
    setEditingSlot(slotIndex);
    setTextForm({ alt: existing?.alt ?? def?.alt ?? '', caption: existing?.caption ?? def?.caption ?? '' });
  };

  const saveText = async (slotIndex: number) => {
    setSavingText(true);
    try {
      const existing = byOrder.get(slotIndex);
      if (existing) {
        await updateDoc(doc(db, 'sitePhotos', existing.id), { alt: textForm.alt, caption: textForm.caption });
      } else {
        const def = defaults[slotIndex];
        await addDoc(collection(db, 'sitePhotos'), {
          page: activePage,
          section: selectedSection,
          imageUrl: def?.imageUrl ?? '',
          storagePath: '',
          alt: textForm.alt,
          caption: textForm.caption,
          order: slotIndex,
          createdAt: serverTimestamp(),
        });
      }
      setEditingSlot(null);
    } catch (e) {
      alert(`Couldn't save: ${(e as Error).message}`);
    } finally {
      setSavingText(false);
    }
  };

  // Appends one brand-new photo beyond the default set — additive only,
  // never touches an existing slot, another sub-section, or another page's
  // docs. One at a time (rather than the old multi-file picker) since each
  // photo needs its own crop step — click "Add a Photo" again for another.
  const addExtraPhoto = (file: File) => {
    setAddingExtra(true);
    openCrop(file, `vwu/site-photos/${activePage}/${selectedSection}`, async (result) => {
      try {
        const nextOrder = Math.max(defaults.length - 1, ...scopedPhotos.map((p) => p.order), -1) + 1;
        const alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
        await addDoc(collection(db, 'sitePhotos'), {
          page: activePage,
          section: selectedSection,
          imageUrl: result.url,
          storagePath: result.path,
          alt,
          caption: '',
          order: nextOrder,
          createdAt: serverTimestamp(),
        });
      } catch (e) {
        alert(`Couldn't add photo: ${(e as Error).message}`);
      } finally {
        setAddingExtra(false);
      }
    });
  };

  const removeExtra = async (p: SitePhotoDoc) => {
    if (!confirm('Remove this photo?')) return;
    try {
      await deleteFile(p.storagePath);
      await deleteDoc(doc(db, 'sitePhotos', p.id));
    } catch (e) {
      alert(`Couldn't delete: ${(e as Error).message}`);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-card">
        <h2 className="admin-card__title">Website Photos</h2>
        <div className="admin-page-selector">
          <p className="admin-page-selector__label">Which menu (matches the site header exactly)?</p>
          <div className="admin-page-selector__grid">
            {NAV_CATEGORIES.map((c) => (
              <button
                key={c.label}
                type="button"
                className={`admin-page-btn${selectedNavCategory === c.label ? ' active' : ''}`}
                onClick={() => selectNavCategory(c.label)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {currentCategory?.subGroups ? (
          currentCategory.subGroups.map((sg) => (
            <div className="admin-page-selector" style={{ marginTop: '1.25rem' }} key={sg.label}>
              <p className="admin-page-selector__label">{sg.label}</p>
              <div className="admin-page-selector__grid">
                {sg.pages.map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`admin-page-btn${activePage === val ? ' active' : ''}`}
                    onClick={() => selectPage(val)}
                  >
                    {pageLabel(val)}
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : categoryPages.length > 0 ? (
          <div className="admin-page-selector" style={{ marginTop: '1.25rem' }}>
            <p className="admin-page-selector__label">Which page?</p>
            <div className="admin-page-selector__grid">
              {categoryPages.map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`admin-page-btn${activePage === val ? ' active' : ''}`}
                  onClick={() => selectPage(val)}
                >
                  {pageLabel(val)}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="admin-field__hint" style={{ marginTop: '1.25rem' }}>
            {currentCategory?.emptyNote}
          </p>
        )}

        {categoryPages.length > 0 && sectionKeys.length > 0 && (
          <div className="admin-page-selector" style={{ marginTop: '1.25rem' }}>
            <p className="admin-page-selector__label">
              Which specific gallery? ({sectionKeys.length} available for {pageLabel(activePage)})
            </p>
            <div className="admin-page-selector__grid">
              {sectionKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`admin-page-btn${selectedSection === key ? ' active' : ''}`}
                  onClick={() => selectSection(key)}
                >
                  {pageSections[key].label}
                </button>
              ))}
            </div>
          </div>
        )}
        {categoryPages.length > 0 && selectedSection !== 'main' && (
          <p className="admin-field__hint" style={{ marginTop: '0.5rem' }}>
            Hidden on the public page until you add at least one real photo here.
          </p>
        )}
      </div>

      {categoryPages.length > 0 && (
      <>
      <div className="admin-card">
        <h2 className="admin-card__title">{pageLabel(activePage)} — {currentSection?.label} — {defaults.length} Photo Slots</h2>
        <p className="admin-field__hint">
          Each slot shows its original photo until you replace it. Replacing one slot never affects the others.
          You'll get to crop the photo to fit before it's saved.
        </p>
        {loading ? <p className="admin-loading">Loading…</p> : (
          <div className="admin-image-grid">
            {defaults.map((def, i) => {
              const live = byOrder.get(i);
              const img = live ?? def;
              const isCustom = !!live;
              return (
                <div key={i} className="admin-image-card">
                  <img src={img.imageUrl} alt={img.alt} />
                  {editingSlot === i ? (
                    <div className="admin-image-card__info" style={{ gap: '0.4rem' }}>
                      <input value={textForm.alt} onChange={(e) => setTextForm((f) => ({ ...f, alt: e.target.value }))} placeholder="Alt text" />
                      <input value={textForm.caption} onChange={(e) => setTextForm((f) => ({ ...f, caption: e.target.value }))} placeholder="Caption" />
                      <div className="admin-form-actions">
                        <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => setEditingSlot(null)}>Cancel</button>
                        <button className="admin-btn admin-btn--primary admin-btn--sm" onClick={() => saveText(i)} disabled={savingText}>
                          {savingText ? 'Saving…' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="admin-image-card__info">
                        {def.label && (
                          <span className="admin-field__hint" style={{ margin: 0, display: 'block' }}>{def.label}</span>
                        )}
                        <strong>{img.caption || img.alt}</strong>{' '}
                        {!isCustom && <span className="admin-badge admin-badge--gray admin-badge--sm">Default</span>}
                      </div>
                      <div className="admin-image-card__actions">
                        <label className="admin-btn admin-btn--sm" style={{ opacity: uploadingSlot !== null ? 0.5 : 1 }}>
                          {uploadingSlot === i ? 'Uploading…' : 'Replace Image'}
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            disabled={uploadingSlot !== null}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) replaceSlot(i, file);
                              e.target.value = '';
                            }}
                          />
                        </label>
                        <button className="admin-btn admin-btn--sm" onClick={() => startEditText(i)}>Edit Text</button>
                        {isCustom && (
                          <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => resetSlot(i)}>Reset</button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="admin-card">
        <div className="admin-card__toolbar">
          <h2 className="admin-card__title">Extra {currentSection?.label} Photos ({extras.length})</h2>
        </div>
        <div className="admin-form-grid">
          <div className="admin-field admin-field--full">
            <label>Add a Photo (beyond the {defaults.length} default slots) — you'll get to crop it before it's added</label>
            <input type="file" accept="image/*" disabled={addingExtra}
              onChange={(e) => { const file = e.target.files?.[0]; if (file) addExtraPhoto(file); e.target.value = ''; }} />
            {addingExtra && <p className="admin-loading">Adding…</p>}
          </div>
        </div>
        {extras.length > 0 && (
          <div className="admin-image-grid" style={{ marginTop: '1rem' }}>
            {extras.map((p) => (
              <div key={p.id} className="admin-image-card">
                <img src={p.imageUrl} alt={p.alt} />
                <div className="admin-image-card__info">
                  <strong>{p.caption || p.alt}</strong>
                </div>
                <div className="admin-image-card__actions">
                  <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => removeExtra(p)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </>
      )}

      {cropModal}
    </div>
  );
}
