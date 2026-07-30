// Fallback content for the Annual Reports & Reforms item, sourced from
// https://svecw.edu.in/annual-reports-reforms/. Firestore's governanceItems
// doc for this slug currently holds a generic, unrelated placeholder (a
// synthesized AQAR summary plus fabricated "Outcomes & Achievements" cards)
// instead of the actual year-by-year report archive from the source site —
// so GovernanceDetail.tsx suppresses those and renders this structure
// directly instead (see AnnualReportsSection.tsx).
//
// Each year links to a PDF under public/downloads/ following the pattern
// `{category-prefix}-{year}.pdf` — none of these files exist yet (the real
// PDFs haven't been supplied), so every link 404s until the matching file
// is added to public/downloads/ with the exact name below.
export interface AnnualReportsCategory {
  key: string;
  title: string;
  years: { label: string; href: string }[];
}

function yearLinks(prefix: string, years: string[]) {
  return years.map((year) => ({ label: year, href: `/downloads/${prefix}-${year}.pdf` }));
}

export const ANNUAL_REPORTS_CATEGORIES: AnnualReportsCategory[] = [
  {
    key: 'college-annual-reports',
    title: 'College Annual Reports',
    years: yearLinks('CollegeAnnualReport', ['2024-25', '2023-24', '2022-23', '2021-22', '2020-21', '2019-20', '2018-19', '2017-18', '2016-17']),
  },
  {
    key: 'annual-examination-reports',
    title: 'Annual Examination Reports',
    years: yearLinks('AnnualExaminationReport', ['2024-25', '2023-24', '2022-23', '2021-22', '2020-21', '2019-20', '2018-19', '2017-18', '2016-17']),
  },
  {
    key: 'examination-reforms',
    title: 'Examination Reforms',
    years: yearLinks('ExaminationReforms', ['2023-24', '2022-23', '2020-21', '2018-19', '2017-18', '2016-17']),
  },
  {
    key: 'financial-audit-statements',
    title: 'Financial Audit Statements',
    years: yearLinks('FinancialAuditStatement', ['2024-25', '2023-24', '2022-23', '2021-22', '2020-21']),
  },
];
