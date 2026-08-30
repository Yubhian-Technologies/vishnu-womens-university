// Fallback content for the Patents item, sourced from
// https://svecw.edu.in/patents/. Firestore's researchItems doc for this slug
// already has an older, partial tableText value (a couple of 2024/2023
// entries in a flat "Patent | Inventors" table) that predates the fuller
// year -> Granted/Published -> per-patent detail from svecw.edu.in — this
// constant is used by ResearchDetail.tsx so the page renders the full list
// out of the box. Since it's shipped via projectsText rather than tableText,
// the existing tableSections render guard (`tableSections.length > 0 &&
// projectCategories.length === 0`) already makes this take over automatically
// once projectsText is non-empty — no priority override needed here. Once an
// admin fills in the Firestore field, that value takes over (see
// ResearchDetail.tsx).
//
// Only 4 of these patents have a certificate PDF on svecw.edu.in; those are
// hosted locally under public/downloads/ so their Application Number links
// download directly from our own site instead of navigating elsewhere. The
// rest have no known certificate PDF, so their Application Number is shown
// as plain text.
export const DEFAULT_PATENTS_TEXT = `## 2024 – Granted
### An IoT Garbage Segregator & Bin Level Indicator Device (Design Patent)
Applicant Names: Shri Vishnu Engineering College for Women, Dr. V V R Maheswara Rao, Dr. G Durga Prasad, N Silpa, Dr. S M Padmaja, N Praveen Kumar
Application Number: 399499-001
Date of Filing: 08-11-2023
Status: Granted (18-02-2024)
Department: CSE, AI, EEE

### Novel Display Design for Immersive Virtual Reality Systems (UK Design Patent)
Applicant Names: Dr. Kiran Sree Pokkuluri
Application Number: 6335941
Date of Filing: 28-12-2023
Status: Granted (11-01-2024)
Department: CSE

### Temperature and Humidity Sensor (UK Design Patent)
Applicant Names: Shri Vishnu Engineering College for Women, M V Subbarao, Ms. Priya Maddipati, G Challa Ram, Mr. D Ramesh Varma, D Girish Kumar
Application Number: 6337998
Date of Filing: 05-01-2024
Status: Granted (07-03-2024)
Department: ECE

### AI-Based Waste Management Alerting Device (Design Patent)
Applicant Names: P Kiran Sree
Application Number: 403365-001
Date of Filing: 28-12-2023
Status: Granted (23-02-2024)
Department: CSE

## 2024 – Published
### Novel and Reliable Sensorless Induction Motor Speed Control (Patent)
Applicant Names: Dr. G Durga Prasad, Mr. K P Swaroop, Dr. M V Srikanth, Dr. SSSR Sarathbabu Duvvuri, Mr. K Omkar, Mrs. Y.T.R. Palleswari
Application Number: 202441001272
Date of Filing: 07-01-2024
Status: Published (09-02-2024)
Department: AI, EEE

## 2023 – Granted
### A Counting Bloom Filter (Patent)
Applicant Names: Ramesh Babu Mallela
Application Number: 202205074 | https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FPatent-202205074.pdf?alt=media&token=17e45efd-7269-453e-97df-e3264a2b1303
Date of Filing: 25-01-2023
Status: Republic of South Africa – Patent Granted (25-01-2023)
Department: CSE

### Apparatus And Method For Single Motor Drive Testing For Electric Vehicle (Patent)
Applicant Names: Shri Vishnu Engineering College for Women, Dr. J Rohith Balaji
Application Number: 201941025873 | https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FPatent-201941025873.pdf?alt=media&token=32b9c936-a3ce-4cc9-8f7b-d2a814340d9b
Date of Filing: 28-06-2019
Status: Granted (23-11-2023)
Department: EEE

### Paper Scanning Machine Based on Internet of Things (Design Patent)
Applicant Names: Dr. P. Kiran Sree, Dr. M. Prasad, Mr. P Naga Raju, Mr. Ch. Phaneendra Varma, Mr. G Ramesh Babu, Mrs. K Soni Sharmila, Ms. A V S Asha, Mrs. P Archana
Application Number: 367333-001 | https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FPatent-367333-001.pdf?alt=media&token=0f485711-753e-469e-be59-7dacb200dd80
Date of Filing: 6-07-2022
Status: Granted (23-11-2023)
Department: CSE

### IoT Based Integrated Aquaculture Management System (Design Patent – German)
Applicant Names: Ms. Padma Bellapukonda
Application Number: 202023105674.1 | https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/downloads%2FPatent-202023105674.pdf?alt=media&token=f254c649-8dc8-4113-9429-d73200134c36
Date of Filing: 2022
Status: Granted
Department: IT

### Hand-Drill Auger for Concrete Floors (Design Patent)
Applicant Names: Dr. Pala Gireesh Kumar
Application Number: Not provided
Date of Filing: 14-07-2023
Status: Granted (06-10-2023)
Department: CE

## 2023 – Published
### Guided Cutting Tool (Patent)
Applicant Names: Javvadi Eswara Manikanta
Application Number: 202341006542
Date of Filing: 01-02-2023
Status: Published (17-02-2023)
Department: ME

### Smart Grids for Localising Abnormal Conditions Detection (Patent)
Applicant Names: Dr. G Durga Prasad
Application Number: 202341014287
Date of Filing: 03-03-2023
Status: Published (17-03-2023)
Department: AI

### Implementation of Identification System Using Multilevel Converters (Patent)
Applicant Names: Dr. G Durga Prasad
Application Number: 202341021299
Date of Filing: 24-03-2023
Status: Published (31-03-2023)
Department: AI

### Personalized Recommendation Systems Enhanced by Natural Language Processing (Patent)
Applicant Names: Dr. A. Sri Krishna
Application Number: 202311062490
Date of Filing: 17-09-2023
Status: Published (13-10-2023)
Department: AI

### Machine Learning Based Approach to Detect Anomalies In IOT Devices (Patent)
Applicant Names: Mr. Ch. Phaneendra Varma, Mr. Gurujukota Ramesh Babu
Application Number: 202241008733
Date of Filing: 19-02-2022
Status: Published (04-03-2022)
Department: CSE

### Device for Modulation Techniques (Design Patent)
Applicant Names: Mr. P L V D Ravi Kumar
Application Number: 47/2023
Date of Filing: 2022
Status: Published
Department: IT

### Method of Constructing Steel Reinforced Concrete (Patent)
Applicant Names: Dr. P Gireesh Kumar, Mr. B Venkatesh, Ms. M Surya Kumari, Ms. P Lavanya, Ms. Ch. Manjula, Ms. V Manasa, Mrs. A Tripura, Ms. Ch. Harika, Mr. Ramgopal L, Mr. N HariPavan
Application Number: 202341038669
Date of Filing: 06-06-2023
Status: Published (18-08-2023)
Department: CE

## 2022 – Published
### Fixture for Square Guided Apparatus (Patent)
Applicant Names: Adina Srinivasa Vara Prasad
Application Number: 202241067302
Date of Filing: 23-11-2022
Status: Published (02-12-2022)
Department: ME

### Blast Resistant Analysis And Design Of Rcc Multistorey Building (Patent)
Applicant Names: Mr. B. Venkatesh
Application Number: 2022341020115
Date of Filing: 04-04-2022
Status: Published (15-04-2022)
Department: ME

### Machine Learning-based Approach to Detect Anomalies in IoT Devices (Patent)
Applicant Names: Mr. Ch. Phannendra Varma, Mr. G. Ramesh Babu
Application Number: 202241008733
Date of Filing: 19-02-2022
Status: Published (04-03-2022)
Department: CSE

### Licence Plate Recognition with an Intelligent Camera (Copyright)
Applicant Names: Dr. M. Prasad
Application Number: 12110/2022-CO/L
Date of Filing: 07-06-2022
Status: Awaiting grant
Department: CSE

### System and Method for Cluster Optimization for Crime Analysis (Patent)
Applicant Names: Not specified
Application Number: 202231012957
Date of Filing: 10-03-2022
Status: Published (15-04-2022)
Department: IT

### System For Providing Mediating Effect Of Management Information System (Patent)
Applicant Names: Dr. M. Karthik
Application Number: 202221058963
Date of Filing: 15-10-2022
Status: Published (21-10-2022)
Department: MBA

### Fully Automatic Assistance System Based on Internet of Things for Crowd Management (Patent)
Applicant Names: Mrs. S. Vijitha, Dr. Saket Agarwal, Dr. Anjan Kumar K N, Dr. Vivek Goel, Dr. Syed Azahad, Dr. Devvret Verma, Mr. Anandaraj Shunmugam
Application Number: 202241030062
Date of Filing: 25-05-2022
Status: Published (17-06-2022)
Department: AI

## 2021 – Granted
### Women Safety Hidden Malicious Chip Using IOT Based Location Tracking (Patent)
Applicant Names: Mr. K. Ravi Teja
Application Number: 2021101341
Date of Filing: 16-03-2021
Status: Granted (Australian Patent, 16-03-2021)
Department: CSE

### AWS-Cloud Data (EC2) Performance Improvement Using Machine and Deep Learning (Patent)
Applicant Names: Mr. Anuj Rapaka
Application Number: Not provided
Date of Filing: 14-03-2021
Status: Granted (Australian Patent, 21-04-2021)
Department: CSE

### Crop Health Monitoring System Using IoT and Machine Learning (Patent)
Applicant Names: Dr. B. Suresh Babu
Application Number: 2021100538
Date of Filing: 28-01-2021
Status: Granted (31-03-2021)
Department: EEE

### Artificial Intelligence-Based Cooling System (Patent)
Applicant Names: Dr. B. Suresh Babu
Application Number: 2021100960
Date of Filing: 21-02-2021
Status: Granted (12-05-2021)
Department: EEE

### Design of Solar Energy System with Effective Extraction with Lab View Environment (Patent)
Applicant Names: Dr. Pradeep M
Application Number: 2021104394
Date of Filing: 21-07-2021
Status: Granted (02-09-2021)
Department: ECE

## 2021 – Published
### Milk Overflow Detector (Patent)
Applicant Names: N Srinivasa Rao
Application Number: 353839-001
Date of Filing: 27-11-2021
Status: Published (28-01-2022), awaiting examination
Department: ME

### Alphabetic Watch for Kids (Patent)
Applicant Names: V Lakshmi Narayana
Application Number: 353070-001
Date of Filing: 13-11-2021
Status: Published (31-12-2021), awaiting examination
Department: ME

### An Intelligent Transportation Road Accident Prediction and Prevention Device (Patent)
Applicant Names: Dr. M. S. Sudheer
Application Number: 202141061897
Date of Filing: 30-12-2021
Status: Published (07-01-2022), awaiting examination
Department: CSE

### System and Method Of Long-Range Package Delivering Drones (Patent)
Applicant Names: Dr. Pokkuluri Kiran Sree, Y Ramu, K. V. Narayana Rao, M. Narasimha Raju, V. S. S. P. Raju Gottumukkala, S Sudheer Mangalampalli, Anuj Rapaka, Ramesh Babu Mallela, Bhadrachalam Kollati, Raviteja Kocherla
Application Number: 202141012254
Date of Filing: 22-03-2021
Status: Published (26-03-2021)
Department: CSE

### IoT Based System For Instinctive Stopping Alert To Drivers Using Passenger Ticket (Patent)
Applicant Names: Dr. Pokkuluri Kiran Sree, Dr. V. Purushothama Raju, Dr. K. Ramachandra Rao, A. Seenu, P R Sudha Rani, P J R Shalem Raju, P. Raju, G. Mohan Ram, M V V Rama Rao, T. Kesava
Application Number: 202141012346
Date of Filing: 23-03-2021
Status: Published (26-03-2021)
Department: CSE

### Method of Improving Power Output of Existing Wind Farm (Patent)
Applicant Names: Dr. MRM. Veeramanickam
Application Number: 202121021978
Date of Filing: 15-06-2021
Status: Awaiting complete specification
Department: IT

### Method For Designing and Auto-Emailing E-Certificates (Patent)
Applicant Names: Dr. Nagendra Panini Challa, Dr. DV Naga Raju, Prof. PV Rama Raju
Application Number: 202141016449
Date of Filing: 07-04-2021
Status: Published (23-04-2021)
Department: IT

### Integrated Airless Wheel (Design Patent)
Applicant Names: B. Satya Krishna, Mr. K. Raghavendra Sai
Application Number: 348726-001
Date of Filing: 01-09-2021
Status: Accepted and published, Journal No. 46/2021 (12-11-2021)
Department: ME

### IoT and Machine Learning-based Navigation Device for Blind (Patent)
Applicant Names: Mrs. G. Bharathi
Application Number: 202141048070A
Date of Filing: 21-10-2021
Status: Published (05-11-2021), requesting examination
Department: EEE

### Efficient Enhanced VLSI Architecture Of Montgomery Modular Multiplication (Patent)
Applicant Names: Dr. Ratikantha Sahoo
Application Number: 202141028654
Date of Filing: 25-06-2021
Status: Published (19-07-2021), awaiting examination request
Department: ECE

### Quality Image Analysis of Cardiovascular Disease Prediction Using Deep Learning (Patent)
Applicant Names: Dr. Pokkuluri Kiran Sree
Application Number: 202111058532
Date of Filing: 31-12-2021
Status: Published, awaiting examination
Department: CSE`;
