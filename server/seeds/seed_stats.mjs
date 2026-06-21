import db from '../config/db.js';
import { initializeDatabase } from '../config/db.js';

initializeDatabase();

// Clear existing village_stats
db.prepare('DELETE FROM village_stats').run();

const stats = [
  // ── Overview ──
  { category: 'overview', stat_key: 'Total Population', stat_value: '318', sort_order: 1 },
  { category: 'overview', stat_key: 'Total Households', stat_value: '98', sort_order: 2 },
  { category: 'overview', stat_key: 'Average Family Size', stat_value: '4.41', sort_order: 3 },
  { category: 'overview', stat_key: 'Average Age', stat_value: '31.7', sort_order: 4 },

  // ── Demographics ──
  { category: 'demographics', stat_key: 'Male Population', stat_value: '168', sort_order: 1 },
  { category: 'demographics', stat_key: 'Female Population', stat_value: '150', sort_order: 2 },
  { category: 'demographics', stat_key: 'Children (0-14)', stat_value: '59', sort_order: 3 },
  { category: 'demographics', stat_key: 'Seniors (60+)', stat_value: '22', sort_order: 4 },
  { category: 'demographics', stat_key: 'Working Age (15-60)', stat_value: '196', sort_order: 5 },
  { category: 'demographics', stat_key: 'ST Population', stat_value: '269', sort_order: 6 },
  { category: 'demographics', stat_key: 'OC Population', stat_value: '42', sort_order: 7 },
  { category: 'demographics', stat_key: 'SC Population', stat_value: '5', sort_order: 8 },
  { category: 'demographics', stat_key: 'BC Population', stat_value: '2', sort_order: 9 },

  // ── Age Groups ──
  { category: 'age_groups', stat_key: '0-5 (Infants)', stat_value: '21', sort_order: 1 },
  { category: 'age_groups', stat_key: '6-14 (School Age)', stat_value: '38', sort_order: 2 },
  { category: 'age_groups', stat_key: '15-18 (Adolescents)', stat_value: '28', sort_order: 3 },
  { category: 'age_groups', stat_key: '19-25 (Young Adults)', stat_value: '42', sort_order: 4 },
  { category: 'age_groups', stat_key: '26-60 (Working Age)', stat_value: '154', sort_order: 5 },
  { category: 'age_groups', stat_key: '60+ (Seniors)', stat_value: '22', sort_order: 6 },

  // ── Education ──
  { category: 'education', stat_key: 'Illiterate', stat_value: '163', sort_order: 1 },
  { category: 'education', stat_key: '8th Pass', stat_value: '25', sort_order: 2 },
  { category: 'education', stat_key: '10th Pass', stat_value: '28', sort_order: 3 },
  { category: 'education', stat_key: '12th Pass', stat_value: '33', sort_order: 4 },
  { category: 'education', stat_key: 'Graduate', stat_value: '40', sort_order: 5 },
  { category: 'education', stat_key: 'Currently Studying', stat_value: '29', sort_order: 6 },
  { category: 'education', stat_key: 'Adult Literacy Rate (%)', stat_value: '44.1', sort_order: 7 },
  { category: 'education', stat_key: 'School Enrollment Rate (%)', stat_value: '77.3', sort_order: 8 },
  { category: 'education', stat_key: 'Male Illiterate', stat_value: '70', sort_order: 9 },
  { category: 'education', stat_key: 'Female Illiterate', stat_value: '93', sort_order: 10 },
  { category: 'education', stat_key: 'Male Graduates', stat_value: '29', sort_order: 11 },
  { category: 'education', stat_key: 'Female Graduates', stat_value: '11', sort_order: 12 },

  // ── Occupation ──
  { category: 'occupation', stat_key: 'Farmer', stat_value: '84', sort_order: 1 },
  { category: 'occupation', stat_key: 'Student', stat_value: '57', sort_order: 2 },
  { category: 'occupation', stat_key: 'Homemaker', stat_value: '39', sort_order: 3 },
  { category: 'occupation', stat_key: 'Daily Wage Worker', stat_value: '22', sort_order: 4 },
  { category: 'occupation', stat_key: 'IT / Private Employee', stat_value: '4', sort_order: 5 },
  { category: 'occupation', stat_key: 'Others', stat_value: '8', sort_order: 6 },
  { category: 'occupation', stat_key: 'Migration Count', stat_value: '17', sort_order: 7 },

  // ── Housing ──
  { category: 'housing', stat_key: 'Own House', stat_value: '89', sort_order: 1 },
  { category: 'housing', stat_key: 'Pucca (Concrete)', stat_value: '84', sort_order: 2 },
  { category: 'housing', stat_key: 'Semi-Pucca', stat_value: '7', sort_order: 3 },
  { category: 'housing', stat_key: 'Kutcha (Mud/Thatch)', stat_value: '4', sort_order: 4 },
  { category: 'housing', stat_key: 'Electricity Connected', stat_value: '96', sort_order: 5 },
  { category: 'housing', stat_key: 'Electricity %', stat_value: '98.0', sort_order: 6 },
  { category: 'housing', stat_key: 'LPG Usage %', stat_value: '95.9', sort_order: 7 },
  { category: 'housing', stat_key: 'Private Toilet', stat_value: '81', sort_order: 8 },
  { category: 'housing', stat_key: 'Open Defecation', stat_value: '15', sort_order: 9 },
  { category: 'housing', stat_key: 'Drainage Available', stat_value: '40', sort_order: 10 },
  { category: 'housing', stat_key: 'No Drainage %', stat_value: '59.2', sort_order: 11 },
  { category: 'housing', stat_key: 'Internet Access', stat_value: '0', sort_order: 12 },
  { category: 'housing', stat_key: 'Solar Panels', stat_value: '0', sort_order: 13 },

  // ── Water Access ──
  { category: 'water', stat_key: 'Tap Water', stat_value: '40', sort_order: 1 },
  { category: 'water', stat_key: 'Mineral Water (Buying)', stat_value: '35', sort_order: 2 },
  { category: 'water', stat_key: 'Not Available', stat_value: '16', sort_order: 3 },
  { category: 'water', stat_key: 'Tanker Water', stat_value: '6', sort_order: 4 },
  { category: 'water', stat_key: 'Water Purifier', stat_value: '1', sort_order: 5 },
  { category: 'water', stat_key: 'Government Pipe Water', stat_value: '79', sort_order: 6 },
  { category: 'water', stat_key: 'Hand Pump', stat_value: '17', sort_order: 7 },
  { category: 'water', stat_key: 'Open Well', stat_value: '2', sort_order: 8 },

  // ── Agriculture ──
  { category: 'agriculture', stat_key: 'Cotton', stat_value: '41', sort_order: 1 },
  { category: 'agriculture', stat_key: 'Chilli', stat_value: '17', sort_order: 2 },
  { category: 'agriculture', stat_key: 'Maize', stat_value: '15', sort_order: 3 },
  { category: 'agriculture', stat_key: 'Paddy', stat_value: '8', sort_order: 4 },
  { category: 'agriculture', stat_key: 'Turmeric', stat_value: '3', sort_order: 5 },
  { category: 'agriculture', stat_key: 'Palm Oil', stat_value: '3', sort_order: 6 },
  { category: 'agriculture', stat_key: 'Avg Land Holding (acres)', stat_value: '4.32', sort_order: 7 },
  { category: 'agriculture', stat_key: 'Households With Land', stat_value: '59', sort_order: 8 },
  { category: 'agriculture', stat_key: 'Livestock Households', stat_value: '37', sort_order: 9 },
  { category: 'agriculture', stat_key: 'Bore Well Irrigation', stat_value: '32', sort_order: 10 },

  // ── Health ──
  { category: 'health', stat_key: 'Members With Health Issues', stat_value: '57', sort_order: 1 },
  { category: 'health', stat_key: 'Under Treatment', stat_value: '68', sort_order: 2 },
  { category: 'health', stat_key: 'Under Treatment %', stat_value: '21.4', sort_order: 3 },
  { category: 'health', stat_key: 'Orthopedic/Joint', stat_value: '14', sort_order: 4 },
  { category: 'health', stat_key: 'Diabetes', stat_value: '9', sort_order: 5 },
  { category: 'health', stat_key: 'Blood Pressure', stat_value: '8', sort_order: 6 },
  { category: 'health', stat_key: 'Kidney Problem', stat_value: '6', sort_order: 7 },
  { category: 'health', stat_key: 'Heart Problem', stat_value: '5', sort_order: 8 },

  // ── Economics ──
  { category: 'economics', stat_key: 'Average Annual Income (₹)', stat_value: '64265', sort_order: 1 },
  { category: 'economics', stat_key: 'Median Income (₹)', stat_value: '50000', sort_order: 2 },
  { category: 'economics', stat_key: 'BPL Households', stat_value: '58', sort_order: 3 },
  { category: 'economics', stat_key: 'BPL %', stat_value: '59.2', sort_order: 4 },
  { category: 'economics', stat_key: 'APL Households', stat_value: '40', sort_order: 5 },
  { category: 'economics', stat_key: 'Gini Coefficient', stat_value: '0.393', sort_order: 6 },

  // ── Income Buckets ──
  { category: 'income_buckets', stat_key: 'Below ₹25,000', stat_value: '9', sort_order: 1 },
  { category: 'income_buckets', stat_key: '₹25,000–50,000', stat_value: '13', sort_order: 2 },
  { category: 'income_buckets', stat_key: '₹50,000–1 Lakh', stat_value: '37', sort_order: 3 },
  { category: 'income_buckets', stat_key: '₹1–2 Lakh', stat_value: '7', sort_order: 4 },
  { category: 'income_buckets', stat_key: 'Above ₹2 Lakh', stat_value: '2', sort_order: 5 },

  // ── Financial Inclusion ──
  { category: 'financial', stat_key: 'Government Account', stat_value: '143', sort_order: 1 },
  { category: 'financial', stat_key: 'Private Account', stat_value: '72', sort_order: 2 },
  { category: 'financial', stat_key: 'No Bank Account', stat_value: '103', sort_order: 3 },
  { category: 'financial', stat_key: 'No Bank Account %', stat_value: '32.4', sort_order: 4 },
  { category: 'financial', stat_key: 'MNREGA Job Card', stat_value: '51', sort_order: 5 },

  // ── Government Schemes Coverage ──
  { category: 'schemes_coverage', stat_key: 'PM-KISAN', stat_value: '32', sort_order: 1 },
  { category: 'schemes_coverage', stat_key: 'Pension Scheme', stat_value: '22', sort_order: 2 },
  { category: 'schemes_coverage', stat_key: 'MNREGA', stat_value: '14', sort_order: 3 },
  { category: 'schemes_coverage', stat_key: 'Ration Card', stat_value: '10', sort_order: 4 },
  { category: 'schemes_coverage', stat_key: 'Rythu Bharosa', stat_value: '8', sort_order: 5 },
  { category: 'schemes_coverage', stat_key: 'Amma Vodi', stat_value: '4', sort_order: 6 },
  { category: 'schemes_coverage', stat_key: 'PM Awas Yojana', stat_value: '3', sort_order: 7 },
  { category: 'schemes_coverage', stat_key: 'Thalli ki Vandanam', stat_value: '2', sort_order: 8 },
  { category: 'schemes_coverage', stat_key: 'Widow Pension', stat_value: '1', sort_order: 9 },

  // ── Vulnerability ──
  { category: 'vulnerability', stat_key: 'High Risk (60-100)', stat_value: '33', sort_order: 1 },
  { category: 'vulnerability', stat_key: 'Vulnerable (35-59)', stat_value: '44', sort_order: 2 },
  { category: 'vulnerability', stat_key: 'Stable (15-34)', stat_value: '13', sort_order: 3 },
  { category: 'vulnerability', stat_key: 'Prosperous (0-14)', stat_value: '8', sort_order: 4 },

  // ── Development Scores ──
  { category: 'scores', stat_key: 'Overall Score', stat_value: '78', sort_order: 1 },
  { category: 'scores', stat_key: 'Agriculture', stat_value: '100', sort_order: 2 },
  { category: 'scores', stat_key: 'Infrastructure', stat_value: '90', sort_order: 3 },
  { category: 'scores', stat_key: 'Water Access', stat_value: '84', sort_order: 4 },
  { category: 'scores', stat_key: 'Health', stat_value: '79', sort_order: 5 },
  { category: 'scores', stat_key: 'Financial Inclusion', stat_value: '68', sort_order: 6 },
  { category: 'scores', stat_key: 'Education', stat_value: '44', sort_order: 7 },

  // ── Infrastructure ──
  { category: 'Infrastructure', stat_key: 'Pucca (Concrete) Houses', stat_value: '84', sort_order: 1 },
  { category: 'Infrastructure', stat_key: 'Semi-Pucca Houses', stat_value: '7', sort_order: 2 },
  { category: 'Infrastructure', stat_key: 'Kutcha Houses', stat_value: '4', sort_order: 3 },
  { category: 'Infrastructure', stat_key: 'Electricity Connected (%)', stat_value: '98.0', sort_order: 4 },
  { category: 'Infrastructure', stat_key: 'Solar Panels Connected (%)', stat_value: '0.0', sort_order: 5 },
  { category: 'Infrastructure', stat_key: 'Private Toilet Access (%)', stat_value: '82.6', sort_order: 6 },
  { category: 'Infrastructure', stat_key: 'Tap Water Access (%)', stat_value: '40.8', sort_order: 7 },
  { category: 'Infrastructure', stat_key: 'Drainage Available (%)', stat_value: '40.8', sort_order: 8 },
  { category: 'Infrastructure', stat_key: 'LPG Usage (%)', stat_value: '95.9', sort_order: 9 },
  { category: 'Infrastructure', stat_key: 'Vehicle Ownership (%)', stat_value: '78.6', sort_order: 10 },
  { category: 'Infrastructure', stat_key: 'Internet Access (%)', stat_value: '0.0', sort_order: 11 },

  // ── Secondary Stats ──
  { category: 'Secondary Stats', stat_key: 'TV Count', stat_value: '70', sort_order: 1 },
  { category: 'Secondary Stats', stat_key: 'Fridge Count', stat_value: '55', sort_order: 2 },
  { category: 'Secondary Stats', stat_key: 'Cooler Count', stat_value: '4', sort_order: 3 },
  { category: 'Secondary Stats', stat_key: 'Washing Machine Count', stat_value: '4', sort_order: 4 },
  { category: 'Secondary Stats', stat_key: 'AC Count', stat_value: '2', sort_order: 5 },
  { category: 'Secondary Stats', stat_key: '2-Wheelers Count', stat_value: '77', sort_order: 6 },
  { category: 'Secondary Stats', stat_key: 'Cars Count', stat_value: '2', sort_order: 7 },
  { category: 'Secondary Stats', stat_key: 'Airtel Users', stat_value: '64', sort_order: 8 },
  { category: 'Secondary Stats', stat_key: 'Jio Users', stat_value: '14', sort_order: 9 },
  { category: 'Secondary Stats', stat_key: 'VI Users', stat_value: '9', sort_order: 10 },

  // ── Vehicles ──
  { category: 'vehicles', stat_key: 'Petrol 2-Wheelers', stat_value: '73', sort_order: 1 },
  { category: 'vehicles', stat_key: 'Electric 2-Wheelers', stat_value: '4', sort_order: 2 },
  { category: 'vehicles', stat_key: 'Cycles', stat_value: '16', sort_order: 3 },
  { category: 'vehicles', stat_key: 'Petrol Cars', stat_value: '1', sort_order: 4 },
  { category: 'vehicles', stat_key: 'Diesel Cars', stat_value: '1', sort_order: 5 },
  { category: 'vehicles', stat_key: 'Other Vehicles', stat_value: '7', sort_order: 6 },

  // ── Appliances ──
  { category: 'appliances', stat_key: 'TV', stat_value: '70', sort_order: 1 },
  { category: 'appliances', stat_key: 'Fridge', stat_value: '55', sort_order: 2 },
  { category: 'appliances', stat_key: 'Cooler', stat_value: '4', sort_order: 3 },
  { category: 'appliances', stat_key: 'Washing Machine', stat_value: '4', sort_order: 4 },
  { category: 'appliances', stat_key: 'AC', stat_value: '2', sort_order: 5 },
  { category: 'appliances', stat_key: 'Fan', stat_value: '1', sort_order: 6 },
  { category: 'appliances', stat_key: 'Radio', stat_value: '1', sort_order: 7 },

  // ── Village Problems ──
  { category: 'problems', stat_key: 'Water', stat_value: '28', sort_order: 1 },
  { category: 'problems', stat_key: 'Drainage', stat_value: '23', sort_order: 2 },
  { category: 'problems', stat_key: 'Transport', stat_value: '21', sort_order: 3 },
  { category: 'problems', stat_key: 'Roads', stat_value: '8', sort_order: 4 },
  { category: 'problems', stat_key: 'Education', stat_value: '7', sort_order: 5 },
  { category: 'problems', stat_key: 'Housing', stat_value: '6', sort_order: 6 },
  { category: 'problems', stat_key: 'Health', stat_value: '4', sort_order: 7 },
  { category: 'problems', stat_key: 'Agriculture', stat_value: '3', sort_order: 8 },
  { category: 'problems', stat_key: 'Employment', stat_value: '3', sort_order: 9 },
  { category: 'problems', stat_key: 'Other', stat_value: '2', sort_order: 10 },
  { category: 'problems', stat_key: 'Communication', stat_value: '1', sort_order: 11 },
  { category: 'problems', stat_key: 'Electricity', stat_value: '1', sort_order: 12 },
];

const stmt = db.prepare(`
  INSERT INTO village_stats (category, stat_key, stat_value, sort_order)
  VALUES (?, ?, ?, ?)
  ON CONFLICT(category, stat_key) DO UPDATE SET
    stat_value = excluded.stat_value,
    sort_order = excluded.sort_order,
    updated_at = CURRENT_TIMESTAMP
`);

for (const s of stats) {
  stmt.run(s.category, s.stat_key, s.stat_value, s.sort_order);
}

console.log(`✅ Seeded ${stats.length} village stats across ${[...new Set(stats.map(s => s.category))].length} categories`);
