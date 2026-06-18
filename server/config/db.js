import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', '..', 'database', 'village.db');

// Ensure database directory exists
import fs from 'fs';
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new DatabaseSync(dbPath);

// Enable WAL mode for better concurrent read performance
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');


export function initializeDatabase() {
  db.exec(`
    -- Admin users
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Village metadata
    CREATE TABLE IF NOT EXISTS village_info (
      id INTEGER PRIMARY KEY DEFAULT 1,
      name TEXT NOT NULL,
      tagline TEXT,
      population INTEGER,
      households INTEGER,
      mandal TEXT,
      district TEXT,
      state TEXT,
      pincode TEXT,
      latitude REAL,
      longitude REAL,
      area_sqkm REAL,
      climate TEXT,
      avg_rainfall TEXT,
      history TEXT,
      origin TEXT,
      founders TEXT,
      important_events TEXT
    );

    -- Households (census)

    CREATE TABLE IF NOT EXISTS households (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      head_name TEXT NOT NULL,
      head_age INTEGER,
      head_gender TEXT,
      head_education TEXT,
      head_occupation TEXT,
      spouse_name TEXT,
      spouse_education TEXT,
      spouse_occupation TEXT,
      num_members INTEGER,
      category TEXT,
      religion TEXT,
      ration_card_type TEXT,
      annual_income REAL,
      house_type TEXT,
      has_electricity INTEGER DEFAULT 1,
      has_toilet INTEGER DEFAULT 1,
      has_drainage INTEGER DEFAULT 0,
      has_internet INTEGER DEFAULT 0,
      has_solar INTEGER DEFAULT 0,
      cooking_fuel TEXT,
      water_source TEXT,
      land_acres REAL DEFAULT 0,
      irrigation_type TEXT,
      crops TEXT,
      livestock TEXT,
      remarks TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Census statistics (yearly aggregates)
    CREATE TABLE IF NOT EXISTS census (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      total_population INTEGER,
      households INTEGER,
      male_population INTEGER,
      female_population INTEGER,
      child_population INTEGER,
      senior_population INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Village statistics (admin-editable key-value stats grouped by category)
    CREATE TABLE IF NOT EXISTS village_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      stat_key TEXT NOT NULL,
      stat_value TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(category, stat_key)
    );


    -- Household members
    CREATE TABLE IF NOT EXISTS household_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      household_id INTEGER REFERENCES households(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      relation TEXT,
      age INTEGER,
      gender TEXT,
      education TEXT,
      occupation TEXT,
      health_issues TEXT,
      is_student INTEGER DEFAULT 0,
      school_name TEXT,
      is_migrant INTEGER DEFAULT 0,
      migration_place TEXT
    );

    -- Government schemes
    CREATE TABLE IF NOT EXISTS schemes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      description TEXT,
      beneficiary_count INTEGER DEFAULT 0,
      total_eligible INTEGER DEFAULT 0,
      portal_url TEXT,
      is_active INTEGER DEFAULT 1
    );

    -- Scheme beneficiaries
    CREATE TABLE IF NOT EXISTS scheme_beneficiaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scheme_id INTEGER REFERENCES schemes(id),
      household_id INTEGER REFERENCES households(id),
      status TEXT DEFAULT 'active',
      enrolled_date DATE
    );

    -- Village issues
    CREATE TABLE IF NOT EXISTS issues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT,
      description TEXT,
      reported_count INTEGER DEFAULT 1,
      priority INTEGER DEFAULT 0,
      status TEXT DEFAULT 'open',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Notifications
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      message TEXT,
      type TEXT,
      event_date DATE,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Business directory
    CREATE TABLE IF NOT EXISTS businesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      owner_name TEXT,
      phone TEXT,
      location TEXT,
      business_type TEXT,
      description TEXT,
      is_active INTEGER DEFAULT 1
    );

    -- Gallery
    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      category TEXT,
      image_url TEXT NOT NULL,
      description TEXT,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- NRI Funding Projects
    CREATE TABLE IF NOT EXISTS funding_projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      target_amount REAL,
      collected_amount REAL DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Fund contributions
    CREATE TABLE IF NOT EXISTS contributions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER REFERENCES funding_projects(id),
      contributor_name TEXT,
      amount REAL,
      date DATE,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Volunteer opportunities
    CREATE TABLE IF NOT EXISTS volunteer_opportunities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT,
      description TEXT,
      contact_info TEXT,
      is_active INTEGER DEFAULT 1
    );

    -- Education facilities
    CREATE TABLE IF NOT EXISTS education_facilities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT,
      location TEXT,
      num_teachers INTEGER,
      num_students INTEGER,
      contact TEXT,
      distance_km REAL
    );

    -- Healthcare facilities
    CREATE TABLE IF NOT EXISTS healthcare_facilities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT,
      location TEXT,
      contact TEXT,
      ambulance_contact TEXT,
      distance_km REAL
    );

    -- Map landmarks
    CREATE TABLE IF NOT EXISTS landmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT,
      latitude REAL,
      longitude REAL,
      description TEXT
    );
  `);

  console.log('Database initialized successfully');
}

export default db;
