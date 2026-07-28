// Rich hardcoded content for the High Performance Computing (HPC) Lab
// differentiator page (slug: hpc-lab) — overrides that item's generic
// Firestore intro/about text in DifferentiatorDetail.tsx.
export interface HpcMember {
  name: string;
  designation?: string;
  email?: string;
  mobile?: string;
  interests?: string;
  profileLink?: string;
}

export const highPerformanceComputingLab = {
  paragraphs: [
    'Centre of Excellence in High Performance Computing (HPC) Lab was established in 2021 at Department of Artificial Intelligence, with initial support from Shri Vishnu Engineering College for Women (SVECW). The use of High-Performance Computing (HPC) is significant to technological advancement and enhancing a nation’s economic competitiveness.',
    'When it comes to solving massive issues in research, HPC often refers to the practice of pooling computing capacity in a manner that gives far more performance than one might obtain out of a regular desktop computer or workstation. HPC enables the acceleration of scientific and other applications like Cloud Computing, Grid Computing, Supercomputing Solutions, including the study of automobiles and Aeroplane’s, drug development, weather forecasting, and various other domains.',
  ],
  vision: 'Our vision is to enable researchers to undertake cutting-edge computation science and artificial intelligence studies by offering high-speed infrastructure.',
  mission: [
    'To carry out state-of-the-art research and development with collaborators with maximized synergy and pooled, leveraged resources.',
    'The HPC focuses on applying Artificial Intelligence, Data Science, Machine Learning, data mining, and network analysis to real-world problems in society and industry.',
    'Exploring the creation of novel statistical and computational methods for scalable data mining, machine learning, optimization as well as statistical modelling with complex data sets.',
    'To integrate research into practical, relevant solutions to address business and societal challenges.',
    'To apply new advancements in high performance computing hardware and software.',
  ],
  objectives: [
    'Explore and understand artificial intelligence, including machine learning, deep learning, computer vision and natural language processing to perform research on their applicability in various domains.',
    'Providing cutting-edge GPU computing resources to the faculty and student for building machine learning, deep learning, and computer vision models specifically handling large real-world datasets.',
    'To address the skill gap in computational science in the targeted domains by specialized trainings for increased adoption of advanced HPC in industry and academia.',
  ],
  team: {
    inCharge: [
      {
        name: 'Dr. A Senthil Kumar',
        designation: 'Professor',
        email: 'drsenthilkumar@svecw.edu.in',
        mobile: '99651 02017',
        interests: 'Deep Learning, Computer Networks',
        profileLink: 'https://svecw.irins.org/profile/392618',
      },
    ] as HpcMember[],
    facultyMembers: [
      {
        name: 'Dr. G Durga Prasad',
        designation: 'Professor',
        email: 'durgaprasad_garapati@svecw.edu.in',
        mobile: '9833409326',
        interests: 'Machine Learning applications',
        profileLink: 'https://svecw.irins.org/profile/447798',
      },
      {
        name: 'Mr. N Praveen Kumar',
        designation: 'Assistant Professor',
        email: 'praveenkumar.nelli@svecw.edu.in',
        mobile: '9441170567',
        interests: 'Machine Learning applications',
        profileLink: 'https://svecw.irins.org/profile/148004',
      },
    ] as HpcMember[],
  },
  fundedProjects: [
    'Dr A Sri Krishna, completed a DST Sponsored project (No.DST /SEED/SCSP/STI/ 2019/140/G) with the outcome of “To Develop a data base of general health of target population and take appropriate measures for sustenance of health based on regression analysis”',
  ],
  facultyResearch: [
    'Mr. N Praveen Kumar worked on identifying Rice varieties using Deep Neural Networks CNN, AlexNet, SqueezeNet, VGG architectures with three different optimizers.',
    'Mr. N Praveen Kumar worked on Identification of Corn Leaf Disease using DNN architectures like CNN, AlexNet, SqueezeNet, VGG, DarkNet19, DarkNet53, InceptionResNetV2, Xception with three different optimizers at different training rates.',
    'Mr. N Praveen Kumar worked on Identification of Tomato Leaf disease, Potato leaf disease and Corn leaf disease using different DNNs with three different optimizers with 80% training rate.',
    'Dr. A Senthil Kumar working on Voice enabled deep learning based image captioning solution for guided navigation using Image Processing and Deep Learning.',
    'Dr. A Senthil Kumar working on Detection of Leaf Black Sigatoka Disease in Enset using Convolutional Neural Network.',
  ],
  outcomes: [
    'Adusumalli, S.K. Sign Language Recognition for Needy People Using Machine Learning Model, Smart Innovation, Systems and Technologies, 2023, 315, pp. 227–233',
    'Adusumalli, S.K. Shrimp Surfacing Recognition System in the Pond Using Deep Computer Vision, Smart Innovation, Systems and Technologies, 2023, 315, pp. 217–226',
    'Dr. A. Senthil Kumar, “A Fusion Classification Prototypical for Eye State Recognition in Stroke Patients Using Electroencephalogram (EEG) Data”, International Journal of Intelligent Systems and Applications in Engineering, ISSN:2147-67952, 11(6s), 499–507, 2023.',
    'Senthil Kumar A, “An effective Leveraging Ensembling Methods for High-Enactment Chronic Disease Prediction Systems”, International Journal of Intelligent Systems and Applications in Engineering, ISSN:2147-67952, 11(6s), 568–575, 2023.',
    'Dr. Senthil Kumar “IoT based ECG Signal Feature Extraction and Analysis for Heart Disease Risk Assessment”, at IEEE Conference ICSCSS 2023, organized by Hindustan College of Engineering and Technology, Coimbatore, Indexed in IEEE Xplore on 14-16 June 2023. https://ieeexplore.ieee.org/document/10169414',
    'Senthil Kumar A, Sri Krishna “Enhancing Data Confidentiality in Wireless Networks with Uni-Coordinate Function of Elliptic Curve Cryptography”, presented at an International Congress, “International Hasarikoy Scientific Research and Innovation Congress”, BATMAN / TURKEY, during 29-30 APRIL 2023. ISBN: 978-625-367-079-0',
    'Krishna, A.S. Transfer Learning-based Optimal Feature Selection with DLCNN for Shrimp Recognition and Classification, International Journal of Intelligent Systems and Applications in Engineering, 2023, 15(5), pp. 91–102',
    'Krishna, A.S. Handling emotional speech: a prosody based data augmentation technique for improving neural speech trained ASR systems, International Journal of Speech Technology, 2022, 25(1), pp. 197–204',
    'Krishna, A.S. SDNet: Integrated Unsupervised Learning with DLCNN for Shrimp Disease Detection and Classification, IEEE International Conference on Data Science and Information Technology, ICDSIS 2022, 2022',
  ],
  activities: [
    'A training program on Writing Research Article will be organized on 17th and 18th July 2023 with Dr. M V Subba Rao, Associate Professor, ECE Dept, Shri Vishnu Engineering College for Women.',
    'Statistical Training program with Excel and IBM SPSS by Dr. R.Venkateswarlu, a distinguished Professor from Andhra University on 16-07-2023 and 23-07-2023.',
    'Expert Talk on “How to Stand out in the Competitive Market Landscape” by Ms. Supreet Kaur, Products and strategy head at Morgan Stanley on 5-07-2023.',
    'Training Program on Python for Data Science by Dr Venkateswara Rao Trumalaraju, Adviser for AP State Skill Development Corporation on 25-06-2023.',
    'Training on the Data Visualization for III-I AI&DS students with Mr. Snehith Aliamraju during 5-09-2022 to 2-11-2022.',
    'Industrial / field visits by the faculty and students.',
  ],
};
