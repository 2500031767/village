import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', '..', 'database', 'village.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Import and run schema
import { initializeDatabase } from '../config/db.js';
initializeDatabase();

console.log('Seeding database...');

// ─── Admin User ───
const passwordHash = bcrypt.hashSync('admin123', 10);
db.prepare(`DELETE FROM users`).run();
db.prepare(`INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)`)
  .run('admin', passwordHash, 'admin');
console.log('✓ Admin user created (admin / admin123)');

// ─── Village Info ───
db.prepare(`DELETE FROM village_info`).run();
db.prepare(`INSERT INTO village_info (id, name, tagline, population, households, mandal, district, state, pincode, latitude, longitude, area_sqkm, climate, avg_rainfall, history, origin, founders, important_events) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  .run(
    'Seetharamapuram Thanda',
    'A Digital Village Initiative',
    780, 150,
    'Kovur', 'Nellore', 'Andhra Pradesh', '524137',
    14.5000, 79.8800,
    3.5,
    'Tropical, Hot and Humid',
    '1050mm annually',
    'Seetharamapuram Thanda is a vibrant village community in Nellore district of Andhra Pradesh. Established over a century ago, the village has a rich cultural heritage rooted in agriculture and community living. The village has witnessed significant development over the decades, transitioning from traditional farming to embracing modern agricultural practices and digital initiatives.',
    'The village was established in the early 1900s by migrating families who settled near the fertile lands along the Penna river basin.',
    'Sri Ramaiah and Sri Seetharamaiah are credited as the founding families who first cultivated the land and established the settlement.',
    'Construction of the first school (1965), Electrification (1978), Panchayat Raj formation (1985), First paved road (1992), Digital Village Initiative launch (2024)'
  );
console.log('✓ Village info seeded');

// ─── Households ───
db.prepare(`DELETE FROM household_members`).run();
db.prepare(`DELETE FROM households`).run();

const occupations = ['Farmer', 'Private Employee', 'Government Employee', 'Labourer', 'Self Employed', 'Housewife', 'Student', 'Retired'];
const educations = ['Illiterate', 'Primary', '10th Pass', '12th Pass', 'Graduate', 'Post Graduate'];
const categories = ['SC', 'ST', 'BC', 'OC'];
const houseTypes = ['Pucca', 'Semi-Pucca', 'Kutcha'];
const fuels = ['LPG', 'Wood', 'LPG', 'LPG', 'Wood', 'LPG']; // weighted towards LPG
const waterSources = ['Borewell', 'Public Tap', 'Well', 'Borewell', 'Public Tap'];
const irrigations = ['Canal', 'Borewell', 'Rain-fed', 'Tank Water', 'Canal', 'Borewell'];
const cropsList = ['Paddy', 'Cotton', 'Groundnut', 'Sugarcane', 'Vegetables', 'Chilli', 'Maize'];
const livestockList = ['Cows', 'Buffaloes', 'Goats', 'Sheep', 'Poultry'];
const religions = ['Hindu', 'Hindu', 'Hindu', 'Hindu', 'Christian', 'Muslim'];
const rationCards = ['BPL', 'APL', 'Antyodaya', 'BPL', 'APL', 'BPL'];

const memberNames = {
  male: ['Ramesh', 'Suresh', 'Venkatesh', 'Krishna', 'Raju', 'Srinivas', 'Narayana', 'Venkaiah', 'Balaji', 'Sai', 'Rajesh', 'Mahesh', 'Ganesh', 'Mohan', 'Ravi', 'Anil', 'Vijay', 'Prasad', 'Chandra', 'Hari'],
  female: ['Lakshmi', 'Padma', 'Saraswathi', 'Anitha', 'Sunitha', 'Kavitha', 'Radha', 'Sita', 'Rukmini', 'Pushpa', 'Bharathi', 'Jyothi', 'Swathi', 'Priya', 'Divya', 'Sirisha', 'Madhavi', 'Aruna', 'Vijaya', 'Manga']
};

const surnames = ['Naidu', 'Reddy', 'Rao', 'Kumar', 'Sharma', 'Goud', 'Yadav', 'Babu', 'Prasad', 'Varma'];

const remarksList = [
  'School has only 2 teachers, children travel to nearby village for high school',
  'No proper drainage facility, waterlogging during rains',
  'Drinking water supply irregular, depends on borewell',
  'Road to main village needs repair',
  'Need more street lights in the colony area',
  'Hospital is 15km away, need PHC nearby',
  'No proper playground for children',
  'Mobile network is weak, need tower installation',
  'Anganwadi center needs renovation',
  'Need community hall for village meetings',
  'Agricultural market too far, middlemen exploit farmers',
  'Youth need skill development programs',
  'Bus service frequency is very low',
  'No veterinary doctor available locally',
  'Need more teachers in primary school',
  null, null, null, null, null // some households without remarks
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const insertHousehold = db.prepare(`
  INSERT INTO households (head_name, head_age, head_gender, head_education, head_occupation, spouse_name, spouse_education, spouse_occupation, num_members, category, religion, ration_card_type, annual_income, house_type, has_electricity, has_toilet, has_drainage, has_internet, has_solar, cooking_fuel, water_source, land_acres, irrigation_type, crops, livestock, remarks)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertMember = db.prepare(`
  INSERT INTO household_members (household_id, name, relation, age, gender, education, occupation, health_issues, is_student, school_name, is_migrant, migration_place)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const seedHouseholds = db.transaction(() => {
  for (let i = 0; i < 150; i++) {
    const surname = pick(surnames);
    const headName = `${pick(memberNames.male)} ${surname}`;
    const headAge = randInt(28, 65);
    const headGender = 'Male';
    const headEduc = pick(educations);
    const headOcc = pick(occupations.filter(o => o !== 'Housewife' && o !== 'Student'));
    const spouseName = `${pick(memberNames.female)} ${surname}`;
    const spouseEduc = pick(educations);
    const spouseOcc = Math.random() > 0.6 ? 'Housewife' : pick(['Farmer', 'Labourer', 'Self Employed']);
    const numMembers = randInt(3, 8);
    const category = pick(categories);
    const religion = pick(religions);
    const ration = pick(rationCards);
    const income = randInt(30000, 500000);
    const houseType = pick(houseTypes);
    const electricity = Math.random() > 0.02 ? 1 : 0;
    const toilet = Math.random() > 0.1 ? 1 : 0;
    const drainage = Math.random() > 0.6 ? 1 : 0;
    const internet = Math.random() > 0.65 ? 1 : 0;
    const solar = Math.random() > 0.85 ? 1 : 0;
    const fuel = pick(fuels);
    const water = pick(waterSources);
    const landAcres = Math.random() > 0.3 ? parseFloat((Math.random() * 8).toFixed(1)) : 0;
    const irrigation = landAcres > 0 ? pick(irrigations) : null;
    const numCrops = landAcres > 0 ? randInt(1, 3) : 0;
    const crops = numCrops > 0 ? JSON.stringify([...new Set(Array.from({length: numCrops}, () => pick(cropsList)))]) : null;
    const numLivestock = Math.random() > 0.4 ? randInt(1, 3) : 0;
    const livestock = numLivestock > 0 ? JSON.stringify([...new Set(Array.from({length: numLivestock}, () => pick(livestockList)))]) : null;
    const remarks = pick(remarksList);

    const result = insertHousehold.run(
      headName, headAge, headGender, headEduc, headOcc,
      spouseName, spouseEduc, spouseOcc,
      numMembers, category, religion, ration, income,
      houseType, electricity, toilet, drainage, internet, solar,
      fuel, water, landAcres, irrigation, crops, livestock, remarks
    );

    const householdId = result.lastInsertRowid;

    // Insert head as member
    insertMember.run(householdId, headName, 'Head', headAge, 'Male', headEduc, headOcc, Math.random() > 0.8 ? pick(['Diabetes', 'Hypertension', 'Arthritis', 'Back Pain']) : null, 0, null, 0, null);

    // Insert spouse
    insertMember.run(householdId, spouseName, 'Spouse', headAge - randInt(0, 5), 'Female', spouseEduc, spouseOcc, Math.random() > 0.85 ? pick(['Thyroid', 'Anemia', 'Joint Pain']) : null, 0, null, 0, null);

    // Insert other members (children, parents, etc.)
    const remaining = numMembers - 2;
    for (let j = 0; j < remaining; j++) {
      const isChild = j < remaining - 1 || Math.random() > 0.3;
      const isParent = !isChild;

      if (isChild) {
        const childAge = randInt(2, 22);
        const childGender = Math.random() > 0.5 ? 'Male' : 'Female';
        const childName = `${pick(memberNames[childGender.toLowerCase()])} ${surname}`;
        const isStudent = childAge >= 5 && childAge <= 22 && Math.random() > 0.1;
        const childEduc = childAge < 5 ? 'None' : childAge < 12 ? 'Primary' : childAge < 16 ? '10th Pass' : childAge < 18 ? '12th Pass' : pick(['12th Pass', 'Graduate', 'Student']);
        const childOcc = isStudent ? 'Student' : childAge < 5 ? 'None' : pick(['Student', 'Labourer', 'Private Employee']);
        const isMigrant = !isStudent && childAge > 18 && Math.random() > 0.7;

        insertMember.run(
          householdId, childName, childAge < 18 ? 'Child' : 'Son/Daughter',
          childAge, childGender, childEduc, childOcc,
          null,
          isStudent ? 1 : 0,
          isStudent ? (childAge <= 10 ? 'Government Primary School' : childAge <= 16 ? 'ZP High School' : 'Nellore College') : null,
          isMigrant ? 1 : 0,
          isMigrant ? pick(['Hyderabad', 'Chennai', 'Bangalore', 'Nellore', 'Tirupati', 'Mumbai']) : null
        );
      } else {
        // Parent/elder
        const parentAge = headAge + randInt(20, 30);
        const parentGender = Math.random() > 0.5 ? 'Male' : 'Female';
        const parentName = `${pick(memberNames[parentGender.toLowerCase()])} ${surname}`;
        insertMember.run(
          householdId, parentName, parentGender === 'Male' ? 'Father' : 'Mother',
          parentAge, parentGender, pick(['Illiterate', 'Primary', 'Illiterate']),
          'Retired',
          Math.random() > 0.5 ? pick(['Diabetes', 'Hypertension', 'Arthritis', 'Vision Problems', 'Heart Disease']) : null,
          0, null, 0, null
        );
      }
    }
  }
});

seedHouseholds();
console.log('✓ 150 Households with members seeded');

// ─── Government Schemes ───
db.prepare(`DELETE FROM schemes`).run();
const schemesData = [
  ['MNREGA', 'Employment', 'Mahatma Gandhi National Rural Employment Guarantee Act - provides 100 days of wage employment', 108, 150, 'https://nrega.nic.in'],
  ['PM Kisan', 'Agriculture', 'Pradhan Mantri Kisan Samman Nidhi - ₹6,000/year income support', 72, 150, 'https://pmkisan.gov.in'],
  ['Awas Yojana', 'Housing', 'Pradhan Mantri Awas Yojana - housing for all', 35, 60, 'https://pmaymis.gov.in'],
  ['Old Age Pension', 'Pension', 'National Social Assistance Programme - pension for senior citizens', 27, 65, 'https://nsap.nic.in'],
  ['Widow Pension', 'Pension', 'Financial assistance for widows', 12, 18, 'https://nsap.nic.in'],
  ['Ration Card (BPL)', 'Food Security', 'Below Poverty Line ration card for subsidized food', 82, 150, 'https://nfsa.gov.in'],
  ['Amma Vodi', 'Education', 'Financial assistance for mothers sending children to school', 45, 80, 'https://jaganannaammavodi.ap.gov.in'],
  ['Vidya Deevena', 'Education', 'Fee reimbursement for higher education students', 28, 50, 'https://jnanabhumi.ap.gov.in'],
  ['YSR Rythu Bharosa', 'Agriculture', 'Investment support for farmers', 65, 105, 'https://ysrrythubharosa.ap.gov.in'],
  ['Arogyasri', 'Health', 'Health insurance scheme for poor families', 95, 150, 'https://www.ysrarogyasri.ap.gov.in'],
  ['PM Ujjwala Yojana', 'LPG', 'Free LPG connections for BPL families', 110, 120, 'https://www.pmujjwalayojana.com'],
  ['Jagananna Vasathi Deevena', 'Education', 'Hostel and mess fees for students', 15, 30, 'https://jnanabhumi.ap.gov.in'],
];

const insertScheme = db.prepare(`INSERT INTO schemes (name, category, description, beneficiary_count, total_eligible, portal_url) VALUES (?, ?, ?, ?, ?, ?)`);
for (const s of schemesData) insertScheme.run(...s);
console.log('✓ Government schemes seeded');

// ─── Village Issues ───
db.prepare(`DELETE FROM issues`).run();
const issuesData = [
  ['Teacher Shortage', 'Education', 'Government school has only 2 teachers for 5 classes. Students have to travel to other villages for higher education.', 47, 1, 'open'],
  ['Poor Drainage System', 'Infrastructure', 'Most areas lack proper drainage. Waterlogging during monsoon causes health hazards.', 92, 2, 'open'],
  ['Irregular Drinking Water', 'Water', 'Drinking water supply is irregular. Village depends heavily on borewells which are depleting.', 68, 3, 'open'],
  ['Road Repair Needed', 'Infrastructure', 'Main road connecting to mandal headquarters has potholes and is partially damaged.', 55, 4, 'open'],
  ['No PHC Facility', 'Healthcare', 'Nearest Primary Health Center is 15km away. No local healthcare facility available.', 43, 5, 'open'],
  ['Weak Mobile Network', 'Digital', 'Mobile network coverage is poor. No mobile tower nearby, affecting communication and digital services.', 38, 6, 'open'],
  ['Street Light Shortage', 'Infrastructure', 'Several areas in the village lack street lights, causing safety concerns at night.', 31, 7, 'open'],
  ['Agricultural Market Access', 'Agriculture', 'No nearby agricultural market. Farmers forced to sell to middlemen at lower prices.', 28, 8, 'open'],
  ['Youth Unemployment', 'Employment', 'Lack of skill development and employment opportunities for village youth.', 35, 9, 'open'],
  ['Anganwadi Renovation', 'Education', 'Anganwadi center building is in poor condition and needs immediate repair.', 22, 10, 'open'],
];

const insertIssue = db.prepare(`INSERT INTO issues (title, category, description, reported_count, priority, status) VALUES (?, ?, ?, ?, ?, ?)`);
for (const issue of issuesData) insertIssue.run(...issue);
console.log('✓ Village issues seeded');

// ─── Notifications ───
db.prepare(`DELETE FROM notifications`).run();
const notificationsData = [
  ['Water Supply Notice', 'Due to pipeline repair work, water supply will be disrupted on June 20-21. Please store water accordingly.', 'notice', '2025-06-20'],
  ['Gram Sabha Meeting', 'Monthly Gram Sabha meeting scheduled at Village Panchayat Office. All residents are requested to attend.', 'event', '2025-06-25'],
  ['Health Camp', 'Free health check-up camp organized by District Hospital. Eye check-up, sugar, BP testing available.', 'event', '2025-06-28'],
  ['Vaccination Drive', 'Polio vaccination drive for children below 5 years. Anganwadi centers will serve as vaccination points.', 'notice', '2025-07-01'],
  ['PM Kisan Registration', 'Last date for PM Kisan new registration is July 15. Contact Panchayat Secretary with Aadhaar and bank details.', 'notice', '2025-07-15'],
  ['Independence Day Celebrations', 'Independence Day celebrations at Government School ground. Flag hoisting at 8 AM followed by cultural program.', 'event', '2025-08-15'],
  ['Village Festival', 'Annual Seetharamapuram village festival celebrations. All community members invited for pooja and cultural events.', 'event', '2025-09-10'],
  ['Power Shutdown Notice', 'Scheduled power shutdown for maintenance on July 5 from 9 AM to 5 PM.', 'notice', '2025-07-05'],
];

const insertNotification = db.prepare(`INSERT INTO notifications (title, message, type, event_date) VALUES (?, ?, ?, ?)`);
for (const n of notificationsData) insertNotification.run(...n);
console.log('✓ Notifications seeded');

// ─── Businesses ───
db.prepare(`DELETE FROM businesses`).run();
const businessesData = [
  ['Sri Lakshmi Kirana Store', 'Narayana Reddy', '9876543210', 'Main Road, Seetharamapuram', 'Grocery Store', 'General provisions, groceries, and daily essentials'],
  ['Venkatesh Auto Repairs', 'Venkatesh Kumar', '9876543211', 'Near Bus Stop', 'Mechanic', 'Two-wheeler and auto repair services'],
  ['Sai Medical Store', 'Sai Prasad', '9876543212', 'Near Panchayat Office', 'Medical Store', 'Medicines and basic healthcare products'],
  ['Balaji Dairy Center', 'Balaji Naidu', '9876543213', 'South Colony', 'Dairy Center', 'Milk collection and distribution center'],
  ['Padma Tailoring Center', 'Padma Devi', '9876543214', 'Temple Street', 'Tailor', 'Ladies and gents tailoring, uniform stitching'],
  ['Raju Fertilizer Shop', 'Raju Yadav', '9876543215', 'Main Road', 'Agriculture Supply', 'Fertilizers, pesticides, seeds, and farming equipment'],
  ['Sri Krishna Hair Salon', 'Krishna Babu', '9876543216', 'Market Area', 'Salon', 'Hair cutting and grooming services'],
  ['Anitha Tiffin Center', 'Anitha Kumari', '9876543217', 'School Road', 'Food Stall', 'Breakfast items - idli, dosa, vada, tea'],
  ['Bharath Welding Works', 'Bharath Kumar', '9876543218', 'Industrial Area', 'Welder', 'Metal fabrication and welding services'],
  ['Hari Electricals', 'Hari Prasad', '9876543219', 'Main Road', 'Electrician', 'Electrical wiring, motor repair, and installation'],
];

const insertBusiness = db.prepare(`INSERT INTO businesses (name, owner_name, phone, location, business_type, description) VALUES (?, ?, ?, ?, ?, ?)`);
for (const b of businessesData) insertBusiness.run(...b);
console.log('✓ Businesses seeded');

// ─── Education Facilities ───
db.prepare(`DELETE FROM education_facilities`).run();
const educData = [
  ['Government Primary School, Seetharamapuram', 'primary', 'Village Center', 2, 85, '9876000001', 0],
  ['ZP High School, Seetharamapuram', 'high', 'Near Temple', 4, 120, '9876000002', 0.5],
  ['Anganwadi Center', 'anganwadi', 'South Colony', 1, 25, '9876000003', 0.2],
  ['Government Junior College, Kovur', 'college', 'Kovur Town', 15, 500, '9876000004', 8],
  ['Sri Venkateswara Degree College, Nellore', 'college', 'Nellore City', 40, 2000, '9876000005', 25],
  ['Narayana E-Techno School, Kovur', 'high', 'Kovur', 12, 350, '9876000006', 7],
];

const insertEduc = db.prepare(`INSERT INTO education_facilities (name, type, location, num_teachers, num_students, contact, distance_km) VALUES (?, ?, ?, ?, ?, ?, ?)`);
for (const e of educData) insertEduc.run(...e);
console.log('✓ Education facilities seeded');

// ─── Healthcare Facilities ───
db.prepare(`DELETE FROM healthcare_facilities`).run();
const healthData = [
  ['Government PHC, Kovur', 'PHC', 'Kovur Town', '9876100001', '108', 8],
  ['Area Hospital, Kovur', 'Hospital', 'Kovur', '9876100002', '108', 9],
  ['ACSR Government Medical College Hospital', 'Hospital', 'Nellore', '9876100003', '108', 25],
  ['Narayana Medical College Hospital', 'Hospital', 'Nellore', '9876100004', '102', 27],
  ['Village Health Worker', 'Clinic', 'Seetharamapuram', '9876100005', '108', 0],
];

const insertHealth = db.prepare(`INSERT INTO healthcare_facilities (name, type, location, contact, ambulance_contact, distance_km) VALUES (?, ?, ?, ?, ?, ?)`);
for (const h of healthData) insertHealth.run(...h);
console.log('✓ Healthcare facilities seeded');

// ─── Funding Projects ───
db.prepare(`DELETE FROM contributions`).run();
db.prepare(`DELETE FROM funding_projects`).run();
const fundingData = [
  ['School Renovation', 'Renovation of Government Primary School including new classrooms, furniture, and a computer lab.', 500000, 210000, 'active'],
  ['Village Library', 'Establishing a community library with books, newspapers, and digital reading facility.', 200000, 85000, 'active'],
  ['Street Light Installation', 'Solar-powered street lights installation in all colonies of the village.', 300000, 120000, 'active'],
  ['Water Purification Plant', 'RO water purification plant for clean drinking water supply to all households.', 800000, 150000, 'active'],
  ['Digital Classroom', 'Setting up a digital classroom with projector, computers, and internet connectivity.', 400000, 95000, 'active'],
];

const insertFunding = db.prepare(`INSERT INTO funding_projects (title, description, target_amount, collected_amount, status) VALUES (?, ?, ?, ?, ?)`);
for (const f of fundingData) insertFunding.run(...f);
console.log('✓ Funding projects seeded');

// ─── Volunteer Opportunities ───
db.prepare(`DELETE FROM volunteer_opportunities`).run();
const volunteerData = [
  ['Career Guidance Sessions', 'Education', 'Help village students with career counseling, exam preparation tips, and higher education guidance.', 'Contact: Village Secretary - 9876543200'],
  ['Weekend Teaching', 'Education', 'Volunteer to teach English, Mathematics, or Science to village school students on weekends.', 'Contact: School HM - 9876543201'],
  ['Health Camp Organization', 'Health', 'Help organize monthly health camps with doctor consultations and health awareness programs.', 'Contact: Village Health Worker - 9876543202'],
  ['Skill Development Training', 'Employment', 'Conduct skill development workshops in computer literacy, tailoring, or other vocational skills.', 'Contact: Panchayat Office - 9876543203'],
  ['Agricultural Advisory', 'Agriculture', 'Guide farmers on modern farming techniques, organic farming, and better crop management.', 'Contact: Agricultural Officer - 9876543204'],
];

const insertVolunteer = db.prepare(`INSERT INTO volunteer_opportunities (title, category, description, contact_info) VALUES (?, ?, ?, ?)`);
for (const v of volunteerData) insertVolunteer.run(...v);
console.log('✓ Volunteer opportunities seeded');

// ─── Landmarks ───
db.prepare(`DELETE FROM landmarks`).run();
const landmarksData = [
  ['Government Primary School', 'school', 14.5005, 79.8805, 'Village primary school with classes 1-5'],
  ['ZP High School', 'school', 14.5010, 79.8810, 'High school with classes 6-10'],
  ['Anganwadi Center', 'anganwadi', 14.4998, 79.8795, 'Pre-school and nutrition center'],
  ['Sri Seetharama Swamy Temple', 'temple', 14.5002, 79.8798, 'Main village temple'],
  ['Village Water Tank', 'water_tank', 14.5015, 79.8790, 'Community water storage tank'],
  ['Panchayat Office', 'government', 14.5000, 79.8800, 'Village administrative office'],
  ['Community Hall', 'community', 14.4995, 79.8802, 'Village meeting and event hall'],
  ['Agricultural Fields', 'agriculture', 14.5025, 79.8820, 'Main paddy and cotton cultivation area'],
  ['Bus Stop', 'transport', 14.4990, 79.8810, 'Village bus stop on main road'],
];

const insertLandmark = db.prepare(`INSERT INTO landmarks (name, type, latitude, longitude, description) VALUES (?, ?, ?, ?, ?)`);
for (const l of landmarksData) insertLandmark.run(...l);
console.log('✓ Landmarks seeded');

// ─── Gallery (placeholder URLs) ───
db.prepare(`DELETE FROM gallery`).run();
const galleryData = [
  ['Village Entrance', 'village', '/images/gallery/village-entrance.jpg', 'Welcome arch at the entrance of Seetharamapuram'],
  ['Government School', 'school', '/images/gallery/school.jpg', 'Government Primary School building'],
  ['Temple Festival', 'festival', '/images/gallery/temple-festival.jpg', 'Annual temple festival celebrations'],
  ['Paddy Fields', 'agriculture', '/images/gallery/paddy-fields.jpg', 'Golden paddy fields during harvest season'],
  ['Village Road', 'infrastructure', '/images/gallery/village-road.jpg', 'Newly paved village road'],
  ['Anganwadi Center', 'school', '/images/gallery/anganwadi.jpg', 'Children at Anganwadi center'],
];

const insertGallery = db.prepare(`INSERT INTO gallery (title, category, image_url, description) VALUES (?, ?, ?, ?)`);
for (const g of galleryData) insertGallery.run(...g);
console.log('✓ Gallery seeded');

console.log('\n🎉 Database seeding completed successfully!');
console.log(`Database location: ${dbPath}`);
process.exit(0);
