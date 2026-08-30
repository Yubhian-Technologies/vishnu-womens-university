// Rich hardcoded content for the Rural Women Technology Park – WTP
// differentiator page (slug: rural-women-tech-park) — overrides that item's
// generic Firestore intro/about text in DifferentiatorDetail.tsx. The two
// PDF reports are static files under public/downloads (linked directly, not
// admin-uploaded, since they're fixed historical reports).
export interface RwtpIntervention {
  title: string;
  paragraphs: string[];
}

export interface RwtpActivity {
  activity: string;
  trainings: string;
  beneficiaries: string;
  shgs: string;
}

export interface RwtpReportLink {
  label: string;
  href: string;
}

export const ruralWomenTechPark = {
  paragraphs: [
    'The RWTP contributes to a greater understanding of the linkages between women’s roles, responsibilities and their use of technology in rural communities. This programme presents selected findings from the evaluation of a feminist action that aimed to enhance rural women’s access to RWTP in SVECW, BHIMAVARAM. Project interventions aimed to be empowering and include level of knowledge, attitude and practice. The training was implemented for the women in five areas.',
    'Over the period 2015-2018 RWTP trained around 1200 rural women at an extensive network of Bhimavaram. The study reveals that the use of technologies are highly gendered and differentiated among women. Rural women utilize a range of technologies in both productive and reproductive activities which are central to their livelihood strategies, especially at the household level. Some of the women trainees have started up their own business. And many of beneficiaries are employed in bakeries and tailoring shops and felt they benefited from the training. Moreover, initiatives based on small scale, village level production approach vulnerable to mass production and rapidly changing into market conditions.',
  ],
  interventionsHeading: 'Interventions Identified:',
  interventions: [
    {
      title: 'Production of Virgin Coconut Oil',
      paragraphs: [
        'First, we gathered in this inspiring space and shared in some benefits of VCO. Then we demonstrate some ways to use the coconut oil. Finally we started rolling up our sleeves in to process and make our own scrub, soap, oil etc,. The attraction is in the different processes for producing VCO with going a possible source for improving livelihoods and incomes.',
      ],
    },
    {
      title: 'Computer Aided Design Stiching and Handloom Weaving',
      paragraphs: [
        'We could approach the Art of Sewing and make them learn the basics of tailoring and embroidery techniques. In this course we have provided the participants with basics of cutting and sewing designs and embroidery designs and knowledge of tools and materials used for realisation of clothing according to the choice and needs of the customer.',
        'Our weaving program covers the technical weaving, pattern drafting and concepts in colors. We offered courses for all ages and abilities.',
      ],
    },
    {
      title: 'Women Health & Nutrition',
      paragraphs: [
        '“Small changes can make a large difference” — a healthy Balance programs that are conducted to engage, educate and motivate. We highlighted on healthy choices and understanding and using nutrition facts.',
      ],
    },
    {
      title: 'Food Processing and Value Added Products',
      paragraphs: [
        '“HANDS ON TRAINING” to baking enthusiasts to provide tools and equipments. This program covers familiarization and using of ingredients for breads, cookies, cakes, icing. We understand and demonstrated on functional properties and use of baking ingredients and methods in creation of variety products.',
      ],
    },
    {
      title: 'Paper Making by Recycling of Waste Paper',
      paragraphs: [
        'We interacted with the group and introduced to women the idea of recycling waste paper. The next day, we focused on spreading awareness about the harmful health effects of plastic and taught them how to make usable bags and baskets out of waste materials.',
        'The women excited and happy to channelize their abundant energies to create something new every day. After this, they learned making envelopes out of wedding invitation cards. Through these fun activities, women in turn learned how to save the environment by not letting the waste products make it to the landfills and how they can be turned into beautiful usable items.',
      ],
    },
  ] as RwtpIntervention[],
  // From the DST Science & Society Programme project completion report
  // (see rwtp-project-completion-report.pdf) — Section 8, "People's
  // Participation from Planning to Implementation Stage".
  activitiesHeading: 'Training Activities & Impact',
  activities: [
    { activity: 'Training on extraction of virgin coconut oil', trainings: '64', beneficiaries: '325', shgs: '12' },
    { activity: 'Training on handlooms', trainings: '25', beneficiaries: '60', shgs: '22' },
    { activity: 'Training on sewing and Embroidery', trainings: '80', beneficiaries: '334', shgs: '22' },
    { activity: 'Outreach program on women health & nutrition', trainings: '30', beneficiaries: '510', shgs: '25' },
    { activity: 'Training on biomass dryers & Food Processing', trainings: '30', beneficiaries: '107', shgs: '10' },
    { activity: 'Training on waste paper recycling', trainings: '40', beneficiaries: '85', shgs: '10' },
  ] as RwtpActivity[],
  activitiesTotalBeneficiaries: '1421',
  reportLinks: [
    { label: 'Click here for Detailed Report', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2Frwtp-project-completion-report.pdf?alt=media&token=4774609e-cf26-4363-9c1b-8f8ce995129a' },
    { label: 'Click here for Report on Printing Workshop', href: 'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2Frwtp-screen-printing-workshop-report.pdf?alt=media&token=f0697eb5-2a7d-4d6a-b8a6-26f0625a7519' },
  ] as RwtpReportLink[],
};
