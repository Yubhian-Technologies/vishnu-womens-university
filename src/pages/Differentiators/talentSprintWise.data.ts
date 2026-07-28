// Rich hardcoded content for the TalentSprint – WISE differentiator page
// (slug: talentsprint-wise) — overrides that item's generic Firestore
// intro/about text in DifferentiatorDetail.tsx. The placement highlight
// cards below the objectives are fully admin-managed instead (see
// WisePlacementsAdmin.tsx / the `wisePlacements` collection) since none were
// available as static assets and each needs its own photo, name, company,
// and package — a card only appears on the public page once an admin adds it.
export interface WiseNseClipping {
  id: string;
  caption: string;
}

export interface WiseModuleItem {
  number: string;
  text: string;
}

export interface WiseModuleSubgroup {
  number: string;
  title: string;
  items: WiseModuleItem[];
}

export interface WiseModuleSection {
  number: string;
  title: string;
  items?: WiseModuleItem[];
  subgroups?: WiseModuleSubgroup[];
}

export interface WiseModuleTab {
  name: string;
  sections?: WiseModuleSection[];
  simpleList?: string[];
}

export interface WiseProjectModule {
  heading: string;
  projects: string[];
}

export interface WiseProjectBatch {
  year: string;
  modules: WiseProjectModule[];
}

export interface WiseEliteStudent {
  name: string;
  college: string;
}

export interface WiseEliteProject {
  id: string;
  name: string;
  description: string;
  students: WiseEliteStudent[];
}

export interface WisePlacementStatRow {
  company: string;
  package: string;
  count: string;
}

export interface WisePlacementRange {
  range: string;
  totalCount: string;
  rows: WisePlacementStatRow[];
}

export interface WisePlacementStatsYear {
  heading: string;
  ranges: WisePlacementRange[];
}

export interface WiseTestimonial {
  id: string;
  name: string;
  batch: string;
  company: string;
  quote: string[];
}

export interface WiseMentoringStudent {
  name: string;
  regdNo: string;
  section: string;
}

export interface WiseMentoringBatch {
  tabLabel: string;
  heading: string;
  students: WiseMentoringStudent[];
}

export interface WiseTeamMember {
  id: string;
  name: string;
  designation: string;
  bio: string[];
}

export const talentSprintWise = {
  paragraphs: [
    'WISE is an exclusive program in collaboration with TalentSprint Private Limited, Hyderabad, to Achieve Academic excellence through innovative learning practices.',
    'It runs in parallel with the regular academic programme to bring highly trusted DeepTech Software Engineers and Emerging Professionals. It also enables a perfect blend of high-end academics and industry-leading practitioner experience.',
    'The primary aim of WISE is to prepare women engineering students to get industry ready by developing them into highly competitive professionals for the Global Tech Industry by making them proficient in latest technologies through the implementation of parallel curriculum.',
  ],
  objectives: [
    'Enable students to develop mid-size software systems by experiential learning',
    'Develop an impressive resume for large multinational Software Organizations by incorporating relevant information',
    'Focus on building industry necessary skills to make them confident and competent professionals',
  ],
  modulesIntro: 'The WISE program will have set of five lecture and three project Modules which will be spread across the academic cycle of five semesters and three summer breaks. Each lecture and project modules will be of 30 and 50 hours duration respectively.',
  modules: [
    {
      name: 'Python Programming',
      sections: [
        {
          number: '1', title: 'First Steps:',
          items: [
            { number: '1.1', text: 'Introduction' },
            { number: '1.2', text: 'Datatypes' },
            { number: '1.3', text: 'First Program' },
            { number: '1.4', text: 'Writing Python Code' },
          ],
        },
        {
          number: '2', title: 'Decision Making',
          items: [
            { number: '2.1', text: 'Conditional Statements' },
            { number: '2.2', text: 'Simple If' },
            { number: '2.3', text: 'If...else' },
            { number: '2.4', text: 'Nested If' },
            { number: '2.5', text: 'Compound Conditions' },
            { number: '2.6', text: 'If...elif...else' },
          ],
        },
        {
          number: '3', title: 'Functions and Strings',
          subgroups: [
            {
              number: '3.1', title: 'Functions:',
              items: [
                { number: '3.1.1', text: 'Defining a Function' },
                { number: '3.1.2', text: 'Calling a Function' },
                { number: '3.1.3', text: 'Returning Multiple Values' },
              ],
            },
            {
              number: '3.2', title: 'Strings:',
              items: [
                { number: '3.2.1', text: 'String Operations' },
                { number: '3.2.2', text: 'Accessing Characters in String' },
                { number: '3.2.3', text: 'Slicing the String' },
                { number: '3.2.4', text: 'String Methods' },
              ],
            },
          ],
        },
        {
          number: '4', title: 'Lists and Dictionaries',
          subgroups: [
            {
              number: '4.1', title: 'Lists:',
              items: [
                { number: '4.1.1', text: 'Accessing an Element' },
                { number: '4.1.2', text: 'Slicing and Striding' },
                { number: '4.1.3', text: 'List Methods' },
              ],
            },
            {
              number: '4.2', title: 'Dictionaries:',
              items: [
                { number: '4.2.1', text: 'Creating Dictionaries' },
                { number: '4.2.2', text: 'Adding Items' },
                { number: '4.2.3', text: 'Accessing Values' },
                { number: '4.2.4', text: 'Modifying Dictionaries' },
                { number: '4.2.5', text: 'Deleting Items' },
              ],
            },
          ],
        },
        {
          number: '5', title: 'File Handling:',
          subgroups: [
            {
              number: '5.1', title: 'File I/O:',
              items: [
                { number: '5.1.1', text: 'Create or Open the File' },
                { number: '5.1.2', text: 'Methods of File Objects' },
                { number: '5.1.3', text: 'Reading Data from File' },
                { number: '5.1.4', text: 'Writing to File' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Everyone Can Code - Using Java',
      sections: [
        {
          number: '1', title: 'Getting Started',
          items: [
            { number: '1.1', text: 'Sum Of Digits' },
            { number: '1.2', text: 'Next Multiple of 100' },
            { number: '1.3', text: 'Three Digit Palindrome' },
            { number: '1.4', text: 'Cube Of Number' },
          ],
        },
        {
          number: '2', title: 'Generating Sequences',
          items: [
            { number: '2.1', text: 'Natural Numbers' },
            { number: '2.2', text: 'Fibonacci Series' },
            { number: '2.3', text: 'Russian Multiplication' },
            { number: '2.4', text: 'Collatz Sequence' },
          ],
        },
        {
          number: '3', title: 'Comparing and Organising',
          items: [
            { number: '3.1', text: 'Maximum of 3 Numbers' },
            { number: '3.2', text: 'Three Boolean' },
            { number: '3.3', text: 'Alarm Clock' },
            { number: '3.4', text: 'Round Sum' },
          ],
        },
        {
          number: '4', title: 'Patterns and Strings',
          items: [
            { number: '4.1', text: 'Star Pyramid 01' },
            { number: '4.2', text: 'Star Pyramid 02' },
            { number: '4.3', text: 'Four Per Line' },
          ],
        },
        {
          number: '5', title: 'Modularizing Programs',
          items: [
            { number: '5.1', text: 'Odd Palindromes' },
            { number: '5.2', text: 'Armstrong Numbers' },
            { number: '5.3', text: 'Twin Primes' },
            { number: '5.4', text: 'Type of Number' },
          ],
        },
        {
          number: '6', title: 'Manipulating Strings',
          items: [
            { number: '6.1', text: 'Date Format' },
            { number: '6.2', text: 'Lucky Number' },
            { number: '6.3', text: 'Mask Email ID' },
          ],
        },
      ],
    },
    {
      name: 'Weaving the Web',
      sections: [
        {
          number: '1', title: 'Creating Static Web Pages',
          items: [
            { number: '1.1', text: 'Designing Layout' },
            { number: '1.2', text: 'Registration Form' },
          ],
        },
        {
          number: '2', title: 'Creating Interactive Web Pages',
          items: [
            { number: '2.1', text: 'Color Paragraphs' },
            { number: '2.2', text: 'Form Validations' },
            { number: '2.3', text: 'Image Slider' },
            { number: '2.4', text: 'Add Row To Table' },
            { number: '2.5', text: 'Sort Table Data' },
            { number: '2.6', text: 'Tic Tac Toe' },
          ],
        },
        {
          number: '3', title: 'Getting Started With Bootstrap',
          items: [
            { number: '3.1', text: 'Design a Responsive Web Page' },
            { number: '3.2', text: 'Design Hello World Web Page' },
          ],
        },
        {
          number: '4', title: 'Rich User Interface',
          items: [
            { number: '4.1', text: 'Design a Responsive Web Page' },
          ],
        },
        {
          number: '5', title: 'Widgets',
          items: [
            { number: '5.1', text: 'Design a Responsive Web Page' },
          ],
        },
        {
          number: '6', title: 'Developing Servlets',
          items: [
            { number: '6.1', text: 'Introduction to Servlets' },
            { number: '6.2', text: 'Developing Web Apps using Servlets' },
            { number: '6.3', text: 'Session Management' },
            { number: '6.4', text: 'Servlet Context and Config' },
            { number: '6.5', text: 'Servlet Filters' },
            { number: '6.6', text: 'Debugging Exercise' },
          ],
        },
        {
          number: '7', title: 'Developing JSPs',
          items: [
            { number: '7.1', text: 'Introduction to JSP' },
            { number: '7.2', text: 'Developing JSP Pages' },
            { number: '7.3', text: 'Custom Tags' },
            { number: '7.4', text: 'JSTL' },
          ],
        },
        {
          number: '8', title: 'Working With JDBC and MVC',
          items: [
            { number: '8.1', text: 'Introduction To MVC Architecture' },
            { number: '8.2', text: 'Integrating Web Applications With Databases' },
          ],
        },
      ],
    },
    {
      name: 'Angular JS',
      sections: [
        {
          number: '1', title: 'Data Binding',
          items: [
            { number: '1.1', text: 'Sign Up Process' },
            { number: '1.2', text: 'Sign Up Process with Data Submission Confirmation' },
            { number: '1.3', text: 'Sign Up Process with Data Saved in Database' },
            { number: '1.4', text: 'Sign In Process' },
          ],
        },
        {
          number: '2', title: 'Form Validation',
          items: [
            { number: '2.1', text: 'Sign Up Form Input Validation' },
            { number: '2.2', text: 'Sign In Form Input Validation' },
          ],
        },
        {
          number: '3', title: 'Filters',
          items: [
            { number: '3.1', text: 'Filter Data Dynamically based on Criteria' },
            { number: '3.2', text: 'Filter Data Dynamically based on User Input' },
          ],
        },
        {
          number: '4', title: 'Routing',
          items: [
            { number: '4.1', text: 'Single Page Application with Multiple Views' },
            { number: '4.2', text: 'Single Page Application with Multiple Local Views' },
          ],
        },
        {
          number: '5', title: 'Components',
          items: [
            { number: '5.1', text: 'Components' },
            { number: '5.2', text: 'Modularizing Application' },
          ],
        },
      ],
    },
    {
      name: 'Machine Learning',
      sections: [
        {
          number: '1', title: 'Welcome to Machine Learning',
          items: [
            { number: '1.1', text: 'Welcome to Machine Learning' },
            { number: '1.2', text: 'Prerequisites' },
            { number: '1.3', text: 'Types of Machine Learning' },
            { number: '1.4', text: 'Why Machine Learning is Future' },
            { number: '1.5', text: 'Applications of Machine Learning' },
          ],
        },
        {
          number: '2', title: 'Data Preprocessing',
          items: [
            { number: '2.1', text: 'Importing Libraries' },
            { number: '2.2', text: 'Import Datasets' },
            { number: '2.3', text: 'Missing Data' },
            { number: '2.4', text: 'Categorical Data' },
            { number: '2.5', text: 'Training Set and Test Set' },
            { number: '2.6', text: 'Feature Scaling' },
            { number: '2.7', text: 'Data Preprocessing Template' },
          ],
        },
        {
          number: '3', title: 'Simple Linear Regression',
          items: [
            { number: '3.1', text: 'Regression' },
            { number: '3.2', text: 'Simple Linear Regression' },
            { number: '3.3', text: 'Multiple Linear Regression' },
            { number: '3.4', text: 'Polynomial Regression' },
            { number: '3.5', text: 'Decision Tree Regression' },
            { number: '3.6', text: 'Random Forest Regression' },
          ],
        },
        { number: '4', title: 'Polynomial Linear Regression' },
        { number: '5', title: 'Decision Tree Regression' },
        {
          number: '6', title: 'Logistic Regression',
          items: [
            { number: '6.1', text: 'Logistic Regression' },
            { number: '6.2', text: 'K-Nearest Neighbors (K-nn)' },
            { number: '6.3', text: 'Naive Bayes' },
            { number: '6.4', text: 'Decision Tree Classification' },
            { number: '6.5', text: 'Random Forest Classification' },
          ],
        },
        { number: '7', title: 'K-Nearest Neighbors' },
        { number: '8', title: 'Naive Bayes' },
        { number: '9', title: 'K-means Clustering' },
        { number: '10', title: 'Hierarchical Clustering' },
      ],
    },
    {
      name: 'Projects',
      simpleList: [
        'Summer 1 : Django Project',
        'Summer 2 : Web Project with Angular',
        'Summer 3 : Machine Learning Project',
      ],
    },
  ] as WiseModuleTab[],
  projectsIntro: 'As part of WISE program out of 8 modules 3 modules are designed as project modules to get the industry oriented working culture. In every summer vacation after completing their end examinations students will work for 3-4 weeks on projects.',
  projectBatches: [
    {
      year: '2013 Batch-Projects',
      modules: [
        {
          heading: 'Module - II :: Projects using Python:',
          projects: [
            'A project for PREDATOR PREY MODEL using Python',
            'A project for WORD GUESSING using Python',
            'A project for HANGMAN using Python',
            'A project for LINGUISTIC STYLE ANALYSIS using Python',
            'A project for TIGER and GOAT using Python',
            'A project for SNAKE AND LADDER using Python',
            'A project for CURVE FITTING using Python',
            'A project for LUDO using Python',
            'A project for WEB PAGE LINK CHECKER using Python',
            'A project for GOGGLE using Python',
          ],
        },
        {
          heading: 'Module - V :: Projects using Advanced Java Programming',
          projects: [
            'A web project for BooksDelen with web programming.',
            'A web project for Buy It with web programming',
            'A web project for Car Pooling with web programming',
            'A web project for Collaboration System with web programming',
            'A web project for Employee Payroll System with web programming',
            'A web project for JobSeekers with web programming',
            'A web project for Library Management System with web programming',
            'A web project for Olx with web programming',
            'A web project for Online BusTicket Reservation with web programming',
            'A web project for Online Examination with web programming',
            'A web project for Online Movie Ticket Booking with web programming',
            'A web project for Recruitment Panel with web programming',
            'A web project for WeConnect with web programming',
          ],
        },
        {
          heading: 'Module - VIII :: Projects using Hadoop and BigData using R Tool',
          projects: [
            'A project on Analyzing YouTube videos based on likes and comments using Hadoop with map reduce',
            'A project on Analysis of total sales of Online Store using Hadoop with map reduce',
            'A project on Traffic analysis using Hadoop with map reduce',
            'A project on Analysing android apps using Hadoop with map reduce',
            'A project on Whatsapp explore using Hadoop with map reduce',
            'A project on Online Retail store using Hadoop with map reduce',
            'A project on Twitter Analytics using Hadoop with map reduce',
            'A project on Analysing sales data of a wholesale store using R tool',
            'A project on Study of Power Consumption in SVES using R tool',
            'A project on Power Generation in different states and types of energy sources using R tool',
            'A project on Mobile call logs Analysis using R tool',
            'A project on Restaurant billing using R tool',
            'A project on Analysis on Road Accidents using R tool',
            'A project on Bike Sharing using R tool',
            'A project on Forecasting fine grained Air quality using R tool',
            'A project on Diabetics Complications using R tool',
            'A project on Mobile call logs Analysis using R tool',
            'A project on Analysing Olympics data using R tool',
            'A project on Medical Record Analysis using R tool',
            'A project on Offline product sales using R tool',
            'A project on Online Books Store using R tool',
            'A project on Electrical Revenue from sales to ultimate customers using R tool',
          ],
        },
      ],
    },
    {
      year: '2014 Batch-Projects',
      modules: [
        {
          heading: 'Module - VI :: Projects on BigData Analytics using R Tool',
          projects: [
            'A BigData Analytics project on Twitter Analysis using R tool',
            'A BigData Analytics project on IMDB using R tool',
            'A BigData Analytics project on Text Analysis using R tool',
            'A BigData Analytics project on IPL using R tool',
            'A BigData Analytics project on Movie Lens using R tool',
            'A BigData Analytics project on Top_500_Indian_Cities using R tool',
            'A BigData Analytics project on World University Ranking using R tool',
          ],
        },
        {
          heading: 'Module - VIII :: Web Application Development using Python Frameworks: Django and Pyramid',
          projects: [
            'BookWorm: A web application which used for buying books based on his interest',
            'GiftCracker: Gift cracker is a web application, to send gifts online on the occasions.',
            'FilmyFreaks: A web application which gives the details of movies based on different languages and genres',
            'CForums: A web application which is used to know about the various activities going on in college',
            'GadgetGuru: A web application which provides working information about gadgets and guides the people to take right decision about purchasing them from different online websites',
            'NewsFever: NewsFever is a web application, where we can read the top news stories about different fields and user can also share his/her news/story with us.',
            "TechExplore: TechExplore is a web applications where users can view and registers for various technical events and institutions can post their events' details.",
            'OYETravels: A web Application in which the user can reserve their tickets for flights, trains and buses',
            'Aaista: A Web Application which helps in Getting Funds for & Selling Assistive Products.',
            'GoPassion: A Web Application where users can learn different passions or can showcase their skills.',
            'Tourism&Travels: A Web Application in which a user can search & book for various Tour Packages',
            'Celebrino: A Web Application where we can organize different type of events like marriage, events etc.',
            'PrettyMe: A Web Application that suggests a suitable Dress for an occasion based on the person characteristics',
            'CookingRecipes: A Web Application which gives information about the required ingredients and preparation process for different dishes',
            'FamilyCanvas: A Web Application where the user can create a family group and share memories and moments',
            'MobAccessors: A web application where users can go through different brands and models of mobiles, tabs and laptops and can buy based on their interest.',
            'Location Slick: A Web Application which helps users to find information about location. Mainly for users who are new to place.',
            'Laundromat: A Web Application which provides laundry services for various sectors like hospitals, hostels, hotels by Door Delivery & Direct Services.',
            'Gifts For You: A Web Application which helps to select a perfect Gift for any kid of personality and different attitudes and gender and other characteristics.',
          ],
        },
      ],
    },
    {
      year: '2015 Batch-Projects',
      modules: [
        {
          heading: 'Module - II :: Projects using Python',
          projects: [
            'Snake and Ladder: To implement the code for the game of snake and ladder, a familiar game to everyone using Python3, Latexbeamer',
            'Pgn-Parser: To display the position of the each chess piece using Python Latex Beamer',
            'Best-Word: To implement the code for print best word in the scrabble game using Python, Latex Beamer, SOWPOD',
            'Predator – Prey: To show a graph between predator – prey varying with time using Python, MATLAB, LatexBeamer',
            'Master-Mind: Word Game using Python, Pygame',
          ],
        },
        {
          heading: 'Module - V :: Web Projects using Advanced Java',
          projects: [
            'A web project for "Online Bus Ticketing (Scheduling)"',
            'A web project for Online Bus Ticketing (Seating selection)',
            'A web project for Online Exam Portal (Test Taker Module)',
            'A web project for Online Exam Portal (Loading QP using Excel and Manual Entry)',
            'A web project for Online Exam Portal (User Admin QP and Scheduling)',
            'A web project for Restaurant management system',
          ],
        },
        {
          heading: 'Module - VIII :: Web projects using Core Angular',
          projects: [
            'A project for Urban Spoon using Core Angular',
            'A project for Bus Booking using Core Angular',
            'A project for Online Exam using Core Angular',
            'A project for Recipe Book using Core Angular',
            'A project for Online Music using Core Angular',
          ],
        },
      ],
    },
    {
      year: '2016 Batch-Projects',
      modules: [
        {
          heading: 'Module - II :: Projects using Python',
          projects: [
            'A Python project for Tigers and Goats',
            'A Python project for Master Mind Game',
            'A Python project for Stylometry',
            'A Python project for Hangman',
            'A Python project for Predator Prey Modelling',
            'A Python project for Chaos Generator',
            'A Python project for Scrabble Pai',
            'A Python project for Snakes and Ladders',
          ],
        },
        {
          heading: 'Module - V :: Web Projects using Advanced Java',
          projects: [
            'A web project on Versta using advanced java',
            'A web project on OLX using advanced java',
            'A web project on Siopa using advanced java',
            'A web project on WorkForce using advanced java',
            'A web project on Man Power using advanced java',
            'A web project on "Bonus Coupon Management System (Customer Module)" using advanced java',
            'A web project on "Bonus Coupon Management System (Corporate Module)" using advanced java',
            'A web project on "Bonus Coupon Management System (Manager Module)" using advanced java',
            'A web project on "Bonus Coupon Management System (Admin Module)" using advanced java',
          ],
        },
      ],
    },
    {
      year: '2017 Batch-Projects',
      modules: [
        {
          heading: 'Module - V :: Advanced Java – Web development Projects',
          projects: [
            'Web project for WISE application using Hibernate framework',
            'A web project for working person support system using Hibernate framework',
            'A web project for Car Rental System using Hibernate framework',
            'A web application for Bus Reservation System using Hibernate framework',
            'A web application for Matrimony using Hibernate framework',
            'A web project for Wise application using Hibernate framework',
            'A web project for Net Banking using Hibernate framework',
            'A web application for Building management System (Amenities) using Hibernate framework',
            'A web project for Library Management System using Hibernate framework',
            'A web project for Business Transactions using Hibernate framework',
            'A web project for Swiggy operations using Hibernate framework',
          ],
        },
        {
          heading: 'Module - VII & VIII :: Machine Learning Projects',
          projects: [
            'A machine learning project for Movie Recommender System using Unsupervised-Associations-Analysis',
            'A machine learning application for Image caption generator using Supervised-CNN-NLP-RNN',
            'A machine learning application using Uber Data Analysis using Visualisation',
            'A machine learning application for E-commerce Sales Forecast using Supervised-Clustering-RNN-Time_series',
            'A machine learning application for Credit card fraud detection using Supervised-Classification-Boosting',
            'A machine learning application for Object Recognition using Supervised-CNN',
            'A machine learning application for drug stores sales forecast using Supervised-Regression',
            'A machine learning application for Fake News Prediction using Supervised-NLP-Classification',
            'A machine learning application for Driver Drowsiness Detection using Supervised-CNN-CV',
            'A machine learning application for Grocart Analysis using Supervised-Association',
            'A machine learning application for Amazon Reviews for Sentiment Analysis using Supervised-NLP-Classification',
            'A machine learning application for Census Income Prediction using Supervised-Classification',
            'A machine learning application for TRAFFIC SIGNS RECOGNITION using Supervised-CNN',
            'A machine learning application for Catastrophe posts genuinity prediction using Supervised-NLP-Classification',
            'A machine learning application for Bike sharing prediction using Supervised-Regression',
            'A machine learning application for Handwritten digit recognition using Supervised-CNN-GUI',
          ],
        },
      ],
    },
    {
      year: '2018 Batch-Projects',
      modules: [
        {
          heading: 'Module - II :: Web Projects using Django',
          projects: [
            'A web project for Pet House using Django',
            'A web project for cooking recipe system using Django',
            'A web project for College Automation System using Django',
            'A web project for Library Management System using Django',
            'A web project for STUDENT MANAGEMENT SYSTEM using Django',
            'A web project for COLLEGE E-LECTURE ANNOTATION SYSTEM using Django',
            'A web project for BIRD HOUSE using Django',
            'A web project for BE YOUR OWN BOOKER using Django',
            'A web project for ONLINE AUCTION using Django',
            'A web project for LAUNDRY MANAGEMENT SYSTEM using Django',
            'A web project for friends.com (social networking site) using Django',
            'A web project for E-Wallet Management System using Django',
            'A web project for PARKING MANAGEMENT SYSTEM using Django',
            'A web project for College ANNOTATION System using Django',
            'A web project for NEST AWAY (Home Rental Services) using Django',
            'A web project for MOVIE DATABASE using Django',
          ],
        },
        {
          heading: 'Module - VI :: Web Projects using Angular with Hibernate Framework',
          projects: [
            'Web project for CYBER ARTIFICER using Angular with Hibernate.',
            'Web project for Qick2Learn using Angular with Hibernate.',
            'Web project for EDUMATE using Angular with Hibernate.',
            'Web project for Tour Vogue using Angular with Hibernate.',
            'Web project for RECRUITEX using Angular with Hibernate.',
            'Web project for Home Gardening using Angular with Hibernate.',
            'Web project for ART QUEST using Angular with Hibernate.',
            'Web project for HANDY SERVICES using Angular with Hibernate.',
            'Web project for TECH DELTA using Angular with Hibernate.',
            'Web project for BOOK SAVERS using Angular with Hibernate.',
            'Web project for HAPPIFY using Angular with Hibernate.',
            'Web project for PLAN YOUR DIET using Angular with Hibernate.',
            'Web project for "CLUB RADAR Event Management" using Angular with Hibernate.',
            'Web project for COVID-19 ESSENTIALS using Angular with Hibernate.',
            'Web project for TRAVEL DIARIES using Angular with Hibernate.',
            "Web project for FARMER'S NEEDS using Angular with Hibernate.",
            'Web project for ARTISANAL STORE using Angular with Hibernate.',
            'Web project for SmartDoc using Angular with Hibernate.',
            'Web project for SVECW INTERVIEW GUIDE using Angular with Hibernate.',
            'Web project for CREATIVE KART using Angular with Hibernate.',
          ],
        },
      ],
    },
  ] as WiseProjectBatch[],
  // Photos are admin-uploaded (see WiseTeamPhotosAdmin.tsx / the
  // `wiseTeamPhotos` collection, keyed by each member's `id` below) since
  // none were available as static assets.
  team: [
    {
      id: 'asokan-pichai',
      name: 'Asokan Pichai',
      designation: 'Dean · WISE',
      bio: [
        'Asokan heads Learning and Development and teaches Problem Solving Techniques and Program Design. He has more than twenty-five years of experience in hands-on software development, training and senior level management. He has held leadership positions such as CEO of MirVesta, CTO of Ma Foi, Chief Trainer at Virtusa, and Technical Director of Brilliant’s Computer Centre.',
        'Asokan is passionate about Instructional Design. He headed the Curriculum Development Department at Brilliant’s Computer Centre from 1989-1994. In his role as the Chief Trainer at Virtusa, he was responsible for selecting and training fresh graduate engineers. He oversaw the design and delivery of the courses as the Head of Technology and Career Training at Ma Foi from 2004-2006.',
        'He was a consultant with FOSSEE, Bombay where he was leading a team in designing and developing courses and teacher’s training programs for engineering curriculum. In his career, Asokan has trained more than 1000 software engineers, designed more than 25 courses, and conducted the Trainer programs for more than 300 trainers, and nearly 100 instructional designers and developers. In July 2015, Asokan was Recognized by CHRO ASIA as one of the 50 Most Influential Training & Development Professionals.',
      ],
    },
    {
      id: 'indira-priyadarsini-talasila',
      name: 'Indira Priyadarsini Talasila',
      designation: 'Instructor',
      bio: [
        'Mrs. Talasila Indira Priyadarsini, working as Sr. Consultant with 5 years’ experience in Talentsprint. She is an expert in Professional C Programming, Python, Projects in Python and Machine learning.',
      ],
    },
    {
      id: 'ghouse-pasha-mohammed',
      name: 'Ghouse Pasha Mohammed',
      designation: 'Instructor',
      bio: [
        'Mr. Gous Pasha, working as Sr.Consultant Delivery with 20 years of experience in dealing with Java, and Database, 6 years of experience in Talentsprint with dealing with Angular and Projects in Angular.',
      ],
    },
    {
      id: 'senagala-sree-harsha-reddy',
      name: 'Senagala Sree Harsha Reddy',
      designation: 'Instructor',
      bio: [
        'Mr. Harsha, working as Consultant delivery in Talentsprint with expertise in the areas of C, C++, DataStructures, Java Programming, Python and Web development.',
      ],
    },
    {
      id: 'chandra-kumar-k',
      name: 'Chandra Kumar K',
      designation: 'Instructor',
      bio: [
        'Mr. Chandra Kumar K, working as Consultant Delivery with 2 years of experience in dealing with Python, Machine learning and Deep learning modules.',
      ],
    },
    {
      id: 'gautham',
      name: 'Gautham',
      designation: 'Instructor',
      bio: [
        'Mr. Gautham Kumar, working as Consultant with an experience of 7 years and expert in dealing with C, C++, Python, Python Projects, machine Learning and Programming & Problem solving.',
      ],
    },
    {
      id: 'masegonellu-venkatesh',
      name: 'Masegonellu Venkatesh',
      designation: 'Instructor',
      bio: [
        'Mr. Venkatesh, working as Consultant Delivery with 3 years of experience in Talentsprint by providing the supporting to deal programming languages and projects in summer modules.',
      ],
    },
    {
      id: 'priyanka-gaddam',
      name: 'Priyanka Gaddam',
      designation: 'Instructor',
      bio: [
        'Ms. Priyanka Gaddam, working as Senior Executive – Content development with 2 years of experience in Talentsprint dealing with WISE-ELITE Program in both colleges.',
      ],
    },
    {
      id: 'sai-gopinadh',
      name: 'Mr. Sai Gopinadh',
      designation: 'Instructor',
      bio: [
        'Mr. Sai Gopinadh, working as Trainee Assistant with 3 years of experience with support in languages like C, Python, Java, Angular and Angular projects.',
      ],
    },
  ] as WiseTeamMember[],
  elite: {
    intro: [
      'Two Levels of selection process. As part of Women In Software Engineering (WISE) some students are additionally benefited with spectacular program named WISE-ELITE.',
      'This the program where the cream students will be more benefited under the guidance of Mr. Asokan Pichai, Dean WISE – Program.',
      'To get into this program student should go through,',
    ],
    level1: [
      'Students should have to complete both Module 1 and Module2.',
      'Students should have to score in the top 25 percentile in BOTH modules.',
      'Students should have to solve at least 3 problems out of 5 in the test.',
    ],
    level2: [
      'All the selected students in Level-1 will have a session with Mr. Asokan Pichai — he will interact with the students to check the way students explaining underlying abstractions, students solving the problem and proper explanation of the solution.',
      'Based on the above criteria finally some set of students were short listed and those students will be in the program.',
    ],
    benefits: [
      'Students will learn most advanced languages (Functional Programming) like Haskell, Clojure, Elixir, Kotlin, Rust and develop some applications or projects.',
      'This program has combined students from BVRITH and SVECW, so the students will work collaboratively to complete the tasks.',
      'Both college students combined together and work on the applications, so that they will be adopted with communication and team work.',
      'In this program students need to present their work weekly in virtual mode and monthly in physical mode. For this physical mode presentation either BVRIT people comes to Bhimavaram once and SVECW people goes to Hyderabad alternatively.',
      'Finally at the end of this program the list of students will be honoured with exclusive unique program named “Microsoft Mentoring Program”,',
      'In Microsoft mentoring program students will work with world famous company “MICROSOFT” by developing some APPs and BOTs as part of mentoring and students will get a chance to get placed in MICROSOFT.',
    ],
    projectsIntro: 'Some of the projects developed by students as part of WISE – ELITE Program:',
    // Team photos are admin-uploaded (see WiseEliteProjectPhotosAdmin.tsx /
    // the `wiseEliteProjectPhotos` collection, keyed by each project's `id`
    // below) since none were available as static assets.
    projects: [
      {
        id: 'clojure-tutor',
        name: 'Clojure Tutor',
        description: 'Equivalent of Python Tutor for Clojure, written using Clojure and ClojureScript.',
        students: [
          { name: 'Gayathri', college: 'BVRITH,CSE' },
          { name: 'Shrenika', college: 'BVRITH,IT' },
          { name: 'Neelima A', college: 'SVECW,ECE' },
          { name: 'Priyanka Y', college: 'SVECW,ECE' },
          { name: 'Harshitha T', college: 'SVECW,CSE' },
        ],
      },
      {
        id: 'aptitude-question-solver',
        name: 'Aptitude Question Solver',
        description: 'Build an NLP/ML system that will solve typical Aptitude Questions and output a solution key; using Haskell.',
        students: [
          { name: 'Imamunnisa', college: 'SVECW,ECE' },
          { name: 'Manisha Reddy T R', college: 'BVRITH,CSE' },
          { name: 'Charisma A', college: 'BVRITH,ECE' },
        ],
      },
      {
        id: 'python-tutor-replica',
        name: 'Python Tutor Replica',
        description: 'To build a replica of Philip Guo’s Python Tutor, using Django/Python.',
        students: [
          { name: 'Hema Sri B', college: 'SVECW,CSE' },
          { name: 'Vyshnavi', college: 'SVECW,CSE' },
          { name: 'BhavyaSri', college: 'SVECW,IT' },
        ],
      },
      {
        id: 'write-right-code',
        name: 'Write Right Code',
        description: 'To build a online coding assessment system, with a help system.',
        students: [
          { name: 'Priyanka K', college: 'SVECW,CSE' },
          { name: 'Sai Vaishnavi T', college: 'SVECW,IT' },
          { name: 'Lalitha K', college: 'SVECW,CSE' },
        ],
      },
      {
        id: 'speed-math-challenge',
        name: 'Speed Math Challenge',
        description: 'Check how many problems the user can solve in 3 minutes. Android App in Kotlin.',
        students: [
          { name: 'Hemalatha', college: 'SVECW,CSE' },
          { name: 'Sai Lakshmi', college: 'SVECW,ECE' },
        ],
      },
      {
        id: 'score-words',
        name: 'Score Words',
        description: 'From 12 random letters choose up to 9, to fill two interlocking 1-D grids of 5 letters each to score maximum possible. Android App in Kotlin.',
        students: [
          { name: 'Preethi Aluru', college: 'SVECW,CSE' },
          { name: 'Sindhu', college: 'SVECW,CSE' },
          { name: 'Bindu', college: 'SVECW,EEE' },
        ],
      },
    ] as WiseEliteProject[],
  },
  // Student names and regd numbers below are transcribed from a
  // low-resolution source image — several are hard to read with full
  // confidence and are worth an admin's review against the original records.
  mentoring: {
    paragraphs: [
      'As part of WISE – ELITE Program, the students who successfully completed tasks assigned in ELITE program will get a chance to work with World Famous Unique company named ‘MICROSOFT’ as a mentee with a program called Microsoft Mentoring Program.',
      'From this program students will work with several projects and get a chance to place in MNC Microsoft. Microsoft FY16 Mentoring program was initiated with one motto that you are not alone in dealing with the ‘newness’ and ‘strangeness’.',
      'Mentors divided students into groups and they provided continuous support and assistance. ‘Culture shock’ is a real phenomenon experienced by students to a new environment, culture and institutional rules and regulations.',
      'In Microsoft mentoring program Mentors Charumathi Srinivasan, Pragathi, Prerana Nayak, Shasi Tadepalli, Durga and many other people given continuous support through mails and phone contacts. Mentors treated students like friends and they given more suggestions, encouragement and co-operation to make improvements and refinements in the projects. At last our students become as Google Developers that they created One Developers account and Place their developed APP in the Google Play Store.',
      'In the second session Mentors divided the students based on their interested areas to work on either Big Data or Machine Learning and IoT or AZURE. Students selected their area of interest and they learn these new technologies on their own with mentors support. Students completed their projects in the selected areas and submitted to mentors.',
      'Microsoft Mentoring program make the students to travel in a success path under the guidance of the mentors and make the dream of working with MNC People come into true.',
    ],
    batches: [
      {
        tabLabel: '2013-17 Batch Students',
        heading: '13B0 BATCH - List of students selected for Microsoft Mentoring Program:',
        students: [
          { name: 'Gade Lelitha', regdNo: '13B01A0532', section: 'CSE- A' },
          { name: 'Sreya Kenagerie', regdNo: '13B01A0554', section: 'CSE- A' },
          { name: 'Remya Teja K', regdNo: '13B01A0562', section: 'CSE- B' },
          { name: 'Tejaswi Manchineela', regdNo: '13B01A0590', section: 'CSE- B' },
          { name: 'Voleti Sreya', regdNo: '13B01A05G2', section: 'CSE-C' },
        ],
      },
      {
        tabLabel: '2014-18 Batch Students',
        heading: '14B0 BATCH - List of students selected for Microsoft Mentoring Program:',
        students: [
          { name: 'Addlemu Sahithi', regdNo: '14B01A0504', section: 'CSE-A' },
          { name: 'Akunuri Yashitha', regdNo: '14B01A0508', section: 'CSE-A' },
          { name: 'Chenna Sai Vidya', regdNo: '14B01A0527', section: 'CSE-A' },
          { name: 'Ch Pushpa Sai Samvritha', regdNo: '14B01A0529', section: 'CSE-A' },
          { name: 'K Naga Mounika', regdNo: '14B01A0564', section: 'CSE-B' },
          { name: 'Kondeti Aiswarya', regdNo: '14B01A0584', section: 'CSE-B' },
          { name: 'Nereshsetty Swetha', regdNo: '14B01A05B5', section: 'CSE-B' },
          { name: 'Seemakurthi Susmitha', regdNo: '14B01A05E9', section: 'CSE-C' },
        ],
      },
      {
        tabLabel: '2015-19 Batch Students',
        heading: '15B0 BATCH - List of students selected for Microsoft Mentoring Program',
        students: [
          { name: 'G. Lalitha Devi', regdNo: '15B01A0530', section: 'CSE – A' },
          { name: 'G. Baby', regdNo: '15B01A0536', section: 'CSE – A' },
          { name: 'Sk. Nasreen', regdNo: '15B01A0556', section: 'CSE – B' },
          { name: 'Sk. Neha Chandini', regdNo: '15B01A0557', section: 'CSE – B' },
          { name: 'N. B N Supriya', regdNo: '15B01A0598', section: 'CSE – B' },
          { name: 'P. N Sree Teja', regdNo: '15B01A05F1', section: 'CSE – C' },
        ],
      },
      {
        tabLabel: '2016-20 Batch Students',
        heading: '16B0 BATCH - List of students selected for Microsoft Mentoring Program',
        students: [
          { name: 'A V L Sai Preethi', regdNo: '16B01A0508', section: 'CSE- A' },
          { name: 'M D N P Sindhu', regdNo: '16B01A05I2', section: 'CSE-B' },
          { name: 'P Bhavya Sri', regdNo: '16B01A1288', section: 'IT-B' },
          { name: 'T Sai Vaishnavi', regdNo: '16B01A02A9', section: 'IT-B' },
          { name: 'T. Hema Latha', regdNo: '16B01A05G4', section: 'CSE-C' },
          { name: 'T. Harshitha', regdNo: '16B01A05G2', section: 'CSE-C' },
          { name: 'Ch. Lalitha', regdNo: '16B01A0563', section: 'CSE-B' },
        ],
      },
    ] as WiseMentoringBatch[],
  },
  // Figures below are transcribed from a low-resolution source image —
  // several counts don't sum exactly to the stated "Total Count" for their
  // range, matching what the source shows; worth an admin's review against
  // the original records rather than "fixing" the arithmetic here.
  beneficiaryStats: [
    {
      heading: '2016 Admitted Students Placements Statistics',
      ranges: [
        {
          range: '3 Lakh & Below', totalCount: '5',
          rows: [
            { company: 'CADeploy', package: '1.8 LPA', count: '1' },
            { company: 'Hexaware, Quest Global', package: '3 LPA', count: '4' },
          ],
        },
        {
          range: '3-5 Lakh', totalCount: '165',
          rows: [
            { company: 'HCL, URJANET, NTT DATA, Seneca Global', package: '3.5 LPA', count: '16' },
            { company: 'WIPRO, TCSNQT, TCS Ninja', package: '3.6 LPA', count: '5' },
            { company: 'CADeploy, Hackwithinfy, Capgemini, Cognizant, INFOSYS, CTS', package: '3.8 LPA', count: '47' },
            { company: 'Accenture, L&T', package: '4.5 LPA', count: '99' },
            { company: 'IBM-GBS', package: '4.65 LPA', count: '1' },
            { company: 'State Street', package: '5 LPA', count: '1' },
          ],
        },
        {
          range: 'Above 5 Lakh', totalCount: '46',
          rows: [
            { company: 'Bank of America', package: '6 LPA', count: '13' },
            { company: 'EPAM', package: '6 LPA', count: '6' },
            { company: 'Epirus', package: '6 LPA', count: '1' },
            { company: 'Accenture (FSE)', package: '6.5 LPA', count: '10' },
            { company: 'Mahindra & Mahindra', package: '6.5 LPA', count: '1' },
            { company: 'Zemoso', package: '6.5 LPA', count: '1' },
            { company: 'NCR', package: '7 LPA', count: '3' },
            { company: 'TCS-Digital', package: '7.2 LPA', count: '3' },
            { company: 'Hackwithinfy (Power Programmer)', package: '8 LPA', count: '1' },
            { company: 'Expedia', package: '12.8 LPA', count: '1' },
            { company: 'Amazon', package: '27 LPA', count: '1' },
            { company: 'Adobe', package: '34 LPA', count: '1' },
          ],
        },
      ],
    },
    {
      heading: '2015 Admitted Students Placements Statistics',
      ranges: [
        {
          range: 'Below 3 Lakh', totalCount: '4',
          rows: [
            { company: 'Haritha TechServ, Open Text', package: '1.8 LPA', count: '3' },
            { company: 'Tecnicare Reunidas', package: '2.1 LPA', count: '1' },
          ],
        },
        {
          range: '3-5 Lakh', totalCount: '189',
          rows: [
            { company: 'WIPRO, ATOS SYNTEL, Ibeix Subil, Kony, Opentext', package: '3 LPA', count: '3' },
            { company: 'MindTree, HCL', package: '3.25 LPA', count: '1' },
            { company: 'Value Momentum', package: '3.3 LPA', count: '3' },
            { company: 'COGNIZANT', package: '3.38 LPA', count: '4' },
            { company: 'Urjanet', package: '3.5 LPA', count: '60' },
            { company: 'Infosys, Infy, TCSNinja, HCL, Seneca Global', package: '3.6 LPA', count: '26' },
            { company: 'Talentsprint, Valueksa, SoCitronics, Tornyhertx, AshoKleyland, Renault Nissan, Mahindra & Mahindra, L&T, Host Analytics', package: '4 LPA', count: '49' },
            { company: 'IBM, Infy, HCL, TCSNinja', package: '4.1 LPA', count: '5' },
            { company: 'TIVO', package: '4.5 LPA', count: '5' },
            { company: 'MAQ, Thermox, Coviam', package: '5 LPA', count: '1' },
          ],
        },
        {
          range: 'Above 5 Lakh', totalCount: '23',
          rows: [
            { company: 'NCR', package: '5.5 LPA', count: '1' },
            { company: 'MAQ', package: '7 LPA', count: '1' },
            { company: 'TCS (Digital)', package: '7 LPA', count: '9' },
            { company: 'TIVO', package: '7 LPA', count: '1' },
            { company: 'DBS Bank', package: '7 LPA', count: '2' },
            { company: 'IBM-ISL', package: '8 LPA', count: '2' },
            { company: 'Athena Health', package: '9.6 LPA', count: '2' },
            { company: 'Expedia', package: '11.67 LPA', count: '1' },
            { company: 'Adobe', package: '14 LPA', count: '3' },
            { company: 'Amazon', package: '16.5 LPA', count: '1' },
          ],
        },
      ],
    },
    {
      heading: '2014 Admitted Students Placements Statistics',
      ranges: [
        {
          range: '3 Lakh and Below', totalCount: '57',
          rows: [
            { company: 'Haritha TechServe', package: '1.8 LPA', count: '2' },
            { company: 'Amazon', package: '1.95 LPA', count: '1' },
            { company: 'SCII', package: '2.04 LPA', count: '1' },
            { company: 'Amazon', package: '2.2 LPA', count: '1' },
            { company: 'MAQSoftware, FrenusTech, RBC', package: '2.4 LPA', count: '12' },
            { company: 'QSpiders', package: '2.5 LPA', count: '5' },
            { company: 'Cadeploy, Cetsim, Imaginate, Torryllamies, Infivity, Kory, Mpheda, NTT Data, Slliconous, Softronics, Talentsprint', package: '3 LPA', count: '35' },
          ],
        },
        {
          range: '3 Lakh Above to 5 Lakh Below', totalCount: '156',
          rows: [
            { company: 'Capital Via', package: '3.03 LPA', count: '10' },
            { company: 'Capgemini, Course Cube, IBM, NTT Data, SCII', package: '3.2 LPA', count: '93' },
            { company: 'Infosys, Virtusa, SenecaGlobal, CTS, QSpiders', package: '3.25 LPA', count: '34' },
            { company: 'TCS', package: '3.36 LPA', count: '1' },
            { company: 'Urjanet (QA), NDOT (QI), GGK Tech, SeniorSemi, Renault Nissan', package: '3.5 LPA', count: '12' },
            { company: 'Milople', package: '3.84 LPA', count: '3' },
            { company: 'Urjanet (D)', package: '4 LPA', count: '1' },
          ],
        },
        {
          range: '5 Lakh & Above', totalCount: '20',
          rows: [
            { company: 'Latent View', package: '5 LPA', count: '1' },
            { company: 'Host Analytics', package: '5 LPA', count: '1' },
            { company: 'John Deere', package: '6.46 LPA', count: '12' },
            { company: 'Ozo_Remp', package: '6.5 LPA', count: '2' },
            { company: 'Zoho', package: '6.6 LPA', count: '3' },
            { company: 'Caterpillar', package: '6.97 LPA', count: '1' },
          ],
        },
      ],
    },
    {
      heading: '2013 Admitted Students Placements Statistics',
      ranges: [
        {
          range: 'Below 2 Lakh', totalCount: '8',
          rows: [
            { company: 'Qspiders', package: '2 LPA', count: '8' },
          ],
        },
        {
          range: '2-3 Lakh', totalCount: '2',
          rows: [
            { company: 'Nextie', package: '2.4 LPA', count: '1' },
            { company: 'D Square Tech Labs', package: '2.6 LPA', count: '1' },
          ],
        },
        {
          range: '3-4 Lakh', totalCount: '354',
          rows: [
            { company: 'CapGemini', package: '3.15 LPA', count: '141' },
            { company: 'IBM', package: '3.2 LPA', count: '92' },
            { company: 'INFOSYS', package: '3.25 LPA', count: '48' },
            { company: 'NTT Data', package: '3.25 LPA', count: '1' },
            { company: 'Seneca Global', package: '3.25 LPA', count: '3' },
            { company: 'TechMahindra', package: '3.25 LPA', count: '52' },
            { company: 'Virtusa', package: '3.4 LPA', count: '1' },
            { company: 'MindTree', package: '3.4 LPA', count: '5' },
            { company: 'KONY', package: '3.6 LPA', count: '6' },
            { company: 'Talent Sprint', package: '4 LPA', count: '3' },
            { company: 'BOSCH', package: '4 LPA', count: '2' },
          ],
        },
        {
          range: 'Above 4 Lakh', totalCount: '6',
          rows: [
            { company: 'John Deere', package: '4.5 LPA', count: '3' },
            { company: 'Urjanet', package: '4.5 LPA', count: '2' },
            { company: 'Zoho', package: '5.6 LPA', count: '1' },
          ],
        },
      ],
    },
  ] as WisePlacementStatsYear[],
  // Photos are admin-uploaded (see WiseTestimonialPhotosAdmin.tsx / the
  // `wiseTestimonialPhotos` collection, keyed by each testimonial's `id`
  // below) since none were available as static assets.
  testimonials: [
    {
      id: 'akunuri-sai-sree-yoshitha',
      name: 'Akunuri Sai Sree Yoshitha',
      batch: 'CSE, 2014-2018 Batch',
      company: 'LatentView Analytics, Chennai.',
      quote: [
        'WISE, as a program was intensive in programming and technical aspects of the software environment. I entered the program as a newbie with little to no information about programming. But by end of the program, I was and am confident about the way I can solve the problems given to me.',
        'I cannot thank enough the trainers and mentors of this program for grooming me into the current me. Apart from the technical aspects of the program, I would say this is a best platform to develop confidence, ability to self learn, corporate culture, problem solving skills and soft skills.',
        'I’m proud to be a part of this excellent initiative taken by SVECW.',
      ],
    },
    {
      id: 'k-n-mounika',
      name: 'K. N. Mounika',
      batch: 'CSE, 2014-2018 Batch',
      company: 'Urjanet Energy Solutions Ltd, Chennai',
      quote: [
        'Initially I was less confident to believe that I can complete learning new things. While learning, the mentors thought the way of communicating and the thinking while handling a project and also self-learning become a habit.',
        'After completing the wise program I had the confidence to speak up and also having the courage to take up new things.',
        'In the entire Wise program we learned office culture i.e mainly addressing, mingling and discussions and doubt raising which when interned will result in increasing our confidence when working in new places since we already got accustomed to such environment.',
      ],
    },
    {
      id: 'sree-teja',
      name: 'Sree Teja',
      batch: 'CSE, 2015-2019 Batch',
      company: 'TCS, Full Stack Developer',
      quote: [
        'I’m Sreeteja from CSE (2015-2019). I work for TCS as a full stack developer. My current technologies are Angular6 and Java8. I’ve learned angular as part of WISE only and Java I had a very good hands on experience in WISE. My team has angular developer’s who has 4-5 years of experience but as a fresher I’ve joined as an Angular developer.',
        'I’ve seen a huge difference between people who has a very good hands-on experience in any technology than the people who has only theoretical knowledge. So, Basically WISE helps you in doing projects on Latest technologies and getting good practical knowledge by doing hands on’s. I believe that I’ve been selected for digital only because of the projects that I did. I suggest everyone to join WISE gain good knowledge on latest technologies.',
        'I wish everyone good luck on your future endeavors.',
      ],
    },
    {
      id: 'susmitha-seemakurthi',
      name: 'Susmitha Seemakurthi',
      batch: 'CSE, 2014-2018 Batch',
      company: 'Capgemini',
      quote: [
        'With the experience from wise modules, able to grasp any new technology very quickly since we have good basic foundations on self learning.',
        'At glance of problem statement, can quickly decide on which style of coding/coding language, approach brings the solution.',
      ],
    },
    {
      id: 'garapati-latitha-devi',
      name: 'Garapati Latitha Devi',
      batch: 'CSE, 2015-2019 Batch',
      company: 'Infosys',
      quote: [
        'During the wise sessions that we attended, we get to interact with the members in the class and also with the faculty members who used to help us in learning the modules. They helped us improve a lot in the way we think while trying to solve the use cases or problem statements. They not only thought the programming but also self learning.',
        'This program helped me improve my coding standards. Communication skills & presentation skills (While trying to explain the code/functionality that we implemented or project presentations).',
      ],
    },
    {
      id: 'sk-neha-chandini',
      name: 'Sk. Neha Chandini',
      batch: 'CSE, 2015-2019 Batch',
      company: 'TCS',
      quote: [
        'Wise Program helped a lot in working environment especially self learning, project work. The project I am working in TCS is on node.js as an application developer. I learned node.js along with unit testing on my own as no training will be provided by company internally. As I already undergone self learning and making proof of concepts in WISE. It made me not to feel stressed and be confident and helped me to interact with supervisors without any fear.',
      ],
    },
  ] as WiseTestimonial[],
  // Clipping images are admin-uploaded (see WiseNseClippingsAdmin.tsx / the
  // `wiseNseClippings` collection, keyed by each clipping's `id` below)
  // since the newsprint scans weren't available as static assets and their
  // small body text isn't reliably legible to transcribe from a screenshot.
  nse: {
    paragraphs: [
      'We are pleased to inform you that the National Stock Exchange Limited (NSE), through its education subsidiary NSE Academy Limited, has become the majority shareholder in TalentSprint.',
      'NSE Limited runs India’s largest stock exchange, is among the TOP 10 stock exchanges in the world, and a very formidable and prestigious brand in the fields of both finance and technology. In the last few years, NSE Academy has been exploring ways to offer deeptech education on a large scale, and their decision to acquire a majority stake in TalentSprint is the result of this union.',
      'We are very happy to reassure you that TalentSprint’s brand, leadership, management and execution teams will continue just as before, with added support from the NSE Group. The current senior management team will continue to lead the company. We will be in an even better position to rapidly expand our relationship and achieve more success together.',
      'We are very proud of our association, and we look forward to continuing and enhancing our partnership in the times ahead!',
    ],
    clippings: [
      { id: 'next-chapter', caption: 'Next Chapter' },
      { id: 'nse-academy-acquires-talentsprint', caption: 'NSE Academy Ltd acquires edu-tech player TalentSprint' },
    ] as WiseNseClipping[],
  },
};
