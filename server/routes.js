import express from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import twilio from 'twilio';
import db from './config/db.js';

// Twilio client initialization (environment variables must be set)
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  try {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  } catch (err) {
    console.error('Twilio initialization error:', err.message);
  }
} else {
  console.log('⚠️ Twilio is not configured properly (ACCOUNT_SID must start with AC). SMS OTP will be disabled.');
}
import { authenticateToken, generateToken } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// ─── FILE UPLOAD SETUP ───
// Use memoryStorage to avoid any disk stream issues, write file manually
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const err = new Error('Only image files are allowed');
      err.status = 400;
      cb(err, false);
    }
  }
});

function saveUploadedFile(file) {
  const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const filepath = path.join(UPLOADS_DIR, filename);
  fs.writeFileSync(filepath, file.buffer);
  return `/uploads/${filename}`;
}

function multerUpload(req, res, next) {
  upload.single('image')(req, res, (err) => {
    if (err) {
      err.status = 400;
      return next(err);
    }
    next();
  });
}

const router = express.Router();

// ─── HEALTH CHECK ───
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});


// ─── IMAGE UPLOAD ENDPOINT ───
router.post('/upload', authenticateToken, multerUpload, (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    const imageUrl = saveUploadedFile(req.file);
    res.json({ url: imageUrl });
  } catch (err) {
    next(err);
  }
});

// ─── AUTHENTICATION ENDPOINTS ───

// Login
router.post('/auth/login', (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    return res.json({
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (err) {
    next(err);
  }
});

// ---- OTP LOGIN ---- //
// Request OTP endpoint
router.post('/auth/request-otp', async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number is required' });

    // Generate a 6‑digit numeric OTP
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    // Insert or replace existing OTP for this phone
    db.prepare('INSERT INTO otp_codes (phone, code, expires_at) VALUES (?, ?, ?)')
      .run(phone, code, expiresAt);

    // Send OTP via Twilio SMS
    try {
      if (twilioClient) {
        await twilioClient.messages.create({
          body: `Your OTP code is ${code}. It expires in 5 minutes.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone.startsWith('+') ? phone : `+${phone}`
        });
      } else {
        console.log('Twilio client not configured. Simulated OTP sending.');
      }
    } catch (smsErr) {
      console.error('Failed to send OTP SMS:', smsErr);
      // Continue without aborting; still respond that OTP was sent (or could indicate failure)
    }
    console.log(`Generated OTP for ${phone}: ${code}`);

    return res.json({ message: 'OTP sent', otp: code });
  } catch (err) {
    next(err);
  }
});

// Verify OTP endpoint
router.post('/auth/verify-otp', (req, res, next) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ error: 'Phone and code are required' });

    const otpRow = db.prepare('SELECT * FROM otp_codes WHERE phone = ? AND code = ?').get(phone, code);
    if (!otpRow) return res.status(401).json({ error: 'Invalid OTP' });

    const now = new Date();
    if (new Date(otpRow.expires_at) < now) {
      return res.status(401).json({ error: 'OTP has expired' });
    }

    // OTP is valid – find or create the member
    let member = db.prepare('SELECT * FROM village_members WHERE phone = ?').get(phone);
    if (!member) {
      const result = db.prepare('INSERT INTO village_members (name, phone) VALUES (?, ?)')
        .run('Guest', phone);
      member = db.prepare('SELECT * FROM village_members WHERE id = ?').get(result.lastInsertRowid);
    }

    // Generate a JWT token for the member (role: member)
    const token = generateToken({ id: member.id, username: member.name, role: 'member' });

    // Optionally delete the used OTP
    db.prepare('DELETE FROM otp_codes WHERE id = ?').run(otpRow.id);

    return res.json({ token, user: { id: member.id, name: member.name, phone: member.phone, role: 'member' } });
  } catch (err) {
    next(err);
  }
});

// Verify Token
router.get('/auth/verify', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});


// ─── BUSINESS DIRECTORY ENDPOINTS ───

// Get all businesses
router.get('/businesses', (req, res, next) => {
  try {
    const rows = db.prepare('SELECT * FROM businesses ORDER BY id DESC').all();
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Create business
router.post('/businesses', authenticateToken, (req, res, next) => {
  try {
    const { name, owner_name, phone, location, business_type, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Business name is required' });
    }
    const stmt = db.prepare(
      'INSERT INTO businesses (name, owner_name, phone, location, business_type, description) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(name, owner_name || null, phone || null, location || null, business_type || null, description || null);
    const newRow = db.prepare('SELECT * FROM businesses WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newRow);
  } catch (err) {
    next(err);
  }
});

// Update business
router.put('/businesses/:id', authenticateToken, (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, owner_name, phone, location, business_type, description, is_active } = req.body;
    
    const business = db.prepare('SELECT * FROM businesses WHERE id = ?').get(id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const stmt = db.prepare(`
      UPDATE businesses 
      SET name = ?, owner_name = ?, phone = ?, location = ?, business_type = ?, description = ?, is_active = ?
      WHERE id = ?
    `);
    stmt.run(
      name !== undefined ? name : business.name,
      owner_name !== undefined ? owner_name : business.owner_name,
      phone !== undefined ? phone : business.phone,
      location !== undefined ? location : business.location,
      business_type !== undefined ? business_type : business.business_type,
      description !== undefined ? description : business.description,
      is_active !== undefined ? is_active : business.is_active,
      id
    );

    const updatedRow = db.prepare('SELECT * FROM businesses WHERE id = ?').get(id);
    res.json(updatedRow);
  } catch (err) {
    next(err);
  }
});

// Delete business
router.delete('/businesses/:id', authenticateToken, (req, res, next) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM businesses WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.json({ message: 'Business deleted successfully', id });
  } catch (err) {
    next(err);
  }
});


// ─── AWARDS ENDPOINTS ───

// Get all awards
router.get('/awards', (req, res, next) => {
  try {
    const rows = db.prepare('SELECT * FROM awards ORDER BY id DESC').all();
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Create award
router.post('/awards', authenticateToken, (req, res, next) => {
  try {
    const { title, category, description, year, icon_name, color } = req.body;
    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }
    const stmt = db.prepare(
      'INSERT INTO awards (title, category, description, year, icon_name, color) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(title, category, description || null, year || null, icon_name || null, color || null);
    const newRow = db.prepare('SELECT * FROM awards WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newRow);
  } catch (err) {
    next(err);
  }
});

// Update award
router.put('/awards/:id', authenticateToken, (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category, description, year, icon_name, color } = req.body;
    
    const award = db.prepare('SELECT * FROM awards WHERE id = ?').get(id);
    if (!award) {
      return res.status(404).json({ error: 'Award not found' });
    }

    const stmt = db.prepare(`
      UPDATE awards 
      SET title = ?, category = ?, description = ?, year = ?, icon_name = ?, color = ?
      WHERE id = ?
    `);
    stmt.run(
      title !== undefined ? title : award.title,
      category !== undefined ? category : award.category,
      description !== undefined ? description : award.description,
      year !== undefined ? year : award.year,
      icon_name !== undefined ? icon_name : award.icon_name,
      color !== undefined ? color : award.color,
      id
    );

    const updatedRow = db.prepare('SELECT * FROM awards WHERE id = ?').get(id);
    res.json(updatedRow);
  } catch (err) {
    next(err);
  }
});

// Delete award
router.delete('/awards/:id', authenticateToken, (req, res, next) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM awards WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Award not found' });
    }
    res.json({ message: 'Award deleted successfully', id });
  } catch (err) {
    next(err);
  }
});


// ─── NOTIFICATIONS ENDPOINTS ───

// Get all notifications
router.get('/notifications', (req, res, next) => {
  try {
    const rows = db.prepare('SELECT * FROM notifications ORDER BY event_date DESC, created_at DESC').all();
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Create notification
router.post('/notifications', authenticateToken, (req, res, next) => {
  try {
    const { title, message, type, event_date } = req.body;
    if (!title || !type) {
      return res.status(400).json({ error: 'Title and type are required' });
    }
    const stmt = db.prepare(
      'INSERT INTO notifications (title, message, type, event_date) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(title, message || null, type, event_date || null);
    const newRow = db.prepare('SELECT * FROM notifications WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newRow);
  } catch (err) {
    next(err);
  }
});

// Update notification
router.put('/notifications/:id', authenticateToken, (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, message, type, event_date, is_active } = req.body;
    
    const notification = db.prepare('SELECT * FROM notifications WHERE id = ?').get(id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const stmt = db.prepare(`
      UPDATE notifications 
      SET title = ?, message = ?, type = ?, event_date = ?, is_active = ?
      WHERE id = ?
    `);
    stmt.run(
      title !== undefined ? title : notification.title,
      message !== undefined ? message : notification.message,
      type !== undefined ? type : notification.type,
      event_date !== undefined ? event_date : notification.event_date,
      is_active !== undefined ? is_active : notification.is_active,
      id
    );

    const updatedRow = db.prepare('SELECT * FROM notifications WHERE id = ?').get(id);
    res.json(updatedRow);
  } catch (err) {
    next(err);
  }
});

// Delete notification
router.delete('/notifications/:id', authenticateToken, (req, res, next) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM notifications WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted successfully', id });
  } catch (err) {
    next(err);
  }
});


// ─── GALLERY ENDPOINTS ───

// Get all gallery items
router.get('/gallery', (req, res, next) => {
  try {
    const rows = db.prepare('SELECT * FROM gallery ORDER BY uploaded_at DESC').all();
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Create gallery item
router.post('/gallery', authenticateToken, multerUpload, (req, res, next) => {
  try {
    const { title, category, description } = req.body;
    let image_url = req.body.image_url || null;

    if (req.file) {
      image_url = saveUploadedFile(req.file);
    }

    if (!image_url) {
      return res.status(400).json({ error: 'An image file is required' });
    }
    const stmt = db.prepare(
      'INSERT INTO gallery (title, category, image_url, description) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(title || null, category || 'other', image_url, description || null);
    const newRow = db.prepare('SELECT * FROM gallery WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newRow);
  } catch (err) {
    next(err);
  }
});

// Update gallery item — accepts multipart/form-data (with new image) or JSON (text fields only)
router.put('/gallery/:id', authenticateToken, (req, res, next) => {
  const contentType = req.headers['content-type'] || '';

  if (contentType.includes('multipart/form-data')) {
    // File upload path — use multer
    multerUpload(req, res, (err) => {
      if (err) {
        err.status = 400;
        return next(err);
      }
      handleGalleryUpdate(req, res, next);
    });
  } else {
    // JSON / text-only update — no file involved
    handleGalleryUpdate(req, res, next);
  }
});

function handleGalleryUpdate(req, res, next) {
  try {
    const { id } = req.params;
    const { title, category, description, image_url } = req.body;

    const photo = db.prepare('SELECT * FROM gallery WHERE id = ?').get(id);
    if (!photo) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    // If a new file was uploaded, use its path; otherwise keep existing image_url
    const newImageUrl = req.file
      ? saveUploadedFile(req.file)
      : (image_url !== undefined ? image_url : photo.image_url);

    const stmt = db.prepare(`
      UPDATE gallery
      SET title = ?, category = ?, image_url = ?, description = ?
      WHERE id = ?
    `);
    stmt.run(
      title !== undefined ? title : photo.title,
      category !== undefined ? category : photo.category,
      newImageUrl,
      description !== undefined ? description : photo.description,
      id
    );

    const updatedRow = db.prepare('SELECT * FROM gallery WHERE id = ?').get(id);
    res.json(updatedRow);
  } catch (err) {
    next(err);
  }
}

// Delete gallery item
router.delete('/gallery/:id', authenticateToken, (req, res, next) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM gallery WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }
    res.json({ message: 'Gallery item deleted successfully', id });
  } catch (err) {
    next(err);
  }
});


// ─── GOVERNMENT SCHEMES ENDPOINTS ───

// Get all schemes
router.get('/schemes', (req, res, next) => {
  try {
    const rows = db.prepare('SELECT * FROM schemes ORDER BY id DESC').all();
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Create scheme
router.post('/schemes', authenticateToken, (req, res, next) => {
  try {
    const { name, category, description, beneficiary_count, total_eligible, portal_url, is_active } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Scheme name is required' });
    }
    const stmt = db.prepare(
      'INSERT INTO schemes (name, category, description, beneficiary_count, total_eligible, portal_url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(
      name, 
      category || null, 
      description || null, 
      beneficiary_count !== undefined ? Number(beneficiary_count) : 0, 
      total_eligible !== undefined ? Number(total_eligible) : 0, 
      portal_url || null, 
      is_active !== undefined ? is_active : 1
    );
    const newRow = db.prepare('SELECT * FROM schemes WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newRow);
  } catch (err) {
    next(err);
  }
});

// Update scheme
router.put('/schemes/:id', authenticateToken, (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, description, beneficiary_count, total_eligible, portal_url, is_active } = req.body;
    
    const scheme = db.prepare('SELECT * FROM schemes WHERE id = ?').get(id);
    if (!scheme) {
      return res.status(404).json({ error: 'Scheme not found' });
    }

    const stmt = db.prepare(`
      UPDATE schemes 
      SET name = ?, category = ?, description = ?, beneficiary_count = ?, total_eligible = ?, portal_url = ?, is_active = ?
      WHERE id = ?
    `);
    stmt.run(
      name !== undefined ? name : scheme.name,
      category !== undefined ? category : scheme.category,
      description !== undefined ? description : scheme.description,
      beneficiary_count !== undefined ? Number(beneficiary_count) : scheme.beneficiary_count,
      total_eligible !== undefined ? Number(total_eligible) : scheme.total_eligible,
      portal_url !== undefined ? portal_url : scheme.portal_url,
      is_active !== undefined ? is_active : scheme.is_active,
      id
    );

    const updatedRow = db.prepare('SELECT * FROM schemes WHERE id = ?').get(id);
    res.json(updatedRow);
  } catch (err) {
    next(err);
  }
});

// Delete scheme
router.delete('/schemes/:id', authenticateToken, (req, res, next) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM schemes WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Scheme not found' });
    }
    res.json({ message: 'Scheme deleted successfully', id });
  } catch (err) {
    next(err);
  }
});


// ─── VILLAGE MEMBER AUTH ───

// Register or login a village member (no password — name + phone)
router.post('/member/login', (req, res, next) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });

    // Find or create member
    let member = db.prepare('SELECT * FROM village_members WHERE phone = ?').get(phone);
    if (!member) {
      const result = db.prepare(
        'INSERT INTO village_members (name, phone) VALUES (?, ?)'
      ).run(name.trim(), phone.trim());
      member = db.prepare('SELECT * FROM village_members WHERE id = ?').get(result.lastInsertRowid);
    }
    res.json({ member });
  } catch (err) {
    next(err);
  }
});

// Get member's own issues
router.get('/member/:phone/issues', async (req, res, next) => {
  try {
    const { phone } = req.params;
    const rows = db.prepare(
      "SELECT * FROM issues WHERE reporter_phone = ? ORDER BY id DESC"
    ).all(phone);
    const response = await otpAuthAPI.requestOtp(phone);
    if (response && response.otp) {
      setSentOtp(response.otp);
    }
    res.json(rows);
  } catch (err) {
    next(err);
  }
});



// ─── VILLAGE RATINGS ───

router.get('/ratings', (req, res, next) => {
  try {
    const rows = db.prepare('SELECT * FROM village_ratings ORDER BY id DESC').all();
    const avg  = db.prepare('SELECT AVG(rating) as avg, COUNT(*) as total FROM village_ratings').get();
    res.json({ ratings: rows, average: avg.avg ? Number(avg.avg).toFixed(1) : null, total: avg.total });
  } catch (err) { next(err); }
});

router.post('/ratings', (req, res, next) => {
  try {
    const { rating, comment, reviewer_name, reviewer_type } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1–5' });
    const result = db.prepare(
      'INSERT INTO village_ratings (rating, comment, reviewer_name, reviewer_type) VALUES (?, ?, ?, ?)'
    ).run(Number(rating), comment || null, reviewer_name || 'Anonymous', reviewer_type || 'visitor');
    const row = db.prepare('SELECT * FROM village_ratings WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(row);
  } catch (err) { next(err); }
});

// Get all issues (public — shows only approved/open/resolved, not pending)
router.get('/issues', (req, res, next) => {
  try {
    const rows = db.prepare(
      "SELECT * FROM issues WHERE status != 'pending' ORDER BY priority ASC, id DESC"
    ).all();
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Public issue report — no auth needed, status starts as 'pending'
router.post('/issues/report', (req, res, next) => {
  try {
    const { title, category, description, reporter_name, reporter_phone } = req.body;
    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    const desc = description
      ? `${description}${reporter_name ? '\n\nReported by: ' + reporter_name : ''}${reporter_phone ? ' | Phone: ' + reporter_phone : ''}`
      : (reporter_name ? `Reported by: ${reporter_name}${reporter_phone ? ' | ' + reporter_phone : ''}` : null);

    const stmt = db.prepare(
      'INSERT INTO issues (title, category, description, reported_count, priority, status) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(title, category, desc, 1, 99, 'pending');
    const newRow = db.prepare('SELECT * FROM issues WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newRow);
  } catch (err) {
    next(err);
  }
});

// "Me too" — increment reported_count on an existing open issue and recalculate priorities
router.post('/issues/:id/upvote', (req, res, next) => {
  try {
    const { id } = req.params;
    const issue = db.prepare("SELECT * FROM issues WHERE id = ? AND status != 'pending'").get(id);
    if (!issue) return res.status(404).json({ error: 'Issue not found or not yet published' });

    // Increment count on this issue
    db.prepare('UPDATE issues SET reported_count = reported_count + 1 WHERE id = ?').run(id);

    // Sum reported_count per category across all non-pending issues
    const categoryTotals = db.prepare(`
      SELECT category, SUM(reported_count) as total
      FROM issues
      WHERE status != 'pending' AND category IS NOT NULL
      GROUP BY category
      ORDER BY total DESC
    `).all();

    // Assign priority rank per category (1 = most reported category)
    const categoryRank = {};
    categoryTotals.forEach((row, index) => {
      categoryRank[row.category] = index + 1;
    });

    // Update every non-pending issue's priority based on its category rank
    const allIssues = db.prepare("SELECT id, category FROM issues WHERE status != 'pending'").all();
    const updatePriority = db.prepare('UPDATE issues SET priority = ? WHERE id = ?');
    allIssues.forEach(row => {
      const rank = categoryRank[row.category] ?? 99;
      updatePriority.run(rank, row.id);
    });

    const updated = db.prepare('SELECT * FROM issues WHERE id = ?').get(id);
    res.json({ updated, categoryTotals });
  } catch (err) {
    next(err);
  }
});

// Recalculate all priorities by category total (admin trigger)
router.post('/issues/recalculate-priorities', authenticateToken, (req, res, next) => {
  try {
    const categoryTotals = db.prepare(`
      SELECT category, SUM(reported_count) as total
      FROM issues
      WHERE status != 'pending' AND category IS NOT NULL
      GROUP BY category
      ORDER BY total DESC
    `).all();

    const categoryRank = {};
    categoryTotals.forEach((row, index) => {
      categoryRank[row.category] = index + 1;
    });

    const allIssues = db.prepare("SELECT id, category FROM issues WHERE status != 'pending'").all();
    const updatePriority = db.prepare('UPDATE issues SET priority = ? WHERE id = ?');
    allIssues.forEach(row => {
      updatePriority.run(categoryRank[row.category] ?? 99, row.id);
    });

    res.json({ message: 'Priorities recalculated', categoryTotals });
  } catch (err) {
    next(err);
  }
});

// Get all issues including pending (admin only)
router.get('/issues/all', authenticateToken, (req, res, next) => {
  try {
    const rows = db.prepare('SELECT * FROM issues ORDER BY status ASC, priority ASC, id DESC').all();
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Create issue (admin)
router.post('/issues', authenticateToken, (req, res, next) => {
  try {
    const { title, category, description, reported_count, priority, status } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Issue title is required' });
    }
    const stmt = db.prepare(
      'INSERT INTO issues (title, category, description, reported_count, priority, status) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(
      title, 
      category || null, 
      description || null, 
      reported_count !== undefined ? Number(reported_count) : 1, 
      priority !== undefined ? Number(priority) : 0, 
      status || 'open'
    );
    const newRow = db.prepare('SELECT * FROM issues WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newRow);
  } catch (err) {
    next(err);
  }
});

// Update issue
router.put('/issues/:id', authenticateToken, (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category, description, reported_count, priority, status } = req.body;
    
    const issue = db.prepare('SELECT * FROM issues WHERE id = ?').get(id);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const stmt = db.prepare(`
      UPDATE issues 
      SET title = ?, category = ?, description = ?, reported_count = ?, priority = ?, status = ?
      WHERE id = ?
    `);
    stmt.run(
      title !== undefined ? title : issue.title,
      category !== undefined ? category : issue.category,
      description !== undefined ? description : issue.description,
      reported_count !== undefined ? Number(reported_count) : issue.reported_count,
      priority !== undefined ? Number(priority) : issue.priority,
      status !== undefined ? status : issue.status,
      id
    );

    const updatedRow = db.prepare('SELECT * FROM issues WHERE id = ?').get(id);
    res.json(updatedRow);
  } catch (err) {
    next(err);
  }
});

// Delete issue
router.delete('/issues/:id', authenticateToken, (req, res, next) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM issues WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    res.json({ message: 'Issue deleted successfully', id });
  } catch (err) {
    next(err);
  }
});


// ─── NRI FUND PROJECTS ENDPOINTS ───

// Get all projects
router.get('/nri/projects', (req, res, next) => {
  try {
    const rows = db.prepare('SELECT * FROM funding_projects ORDER BY id DESC').all();
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Create project
router.post('/nri/projects', authenticateToken, (req, res, next) => {
  try {
    const { title, description, target_amount, collected_amount, status } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Project title is required' });
    }
    const stmt = db.prepare(
      'INSERT INTO funding_projects (title, description, target_amount, collected_amount, status) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(
      title,
      description || null,
      target_amount !== undefined ? Number(target_amount) : 0,
      collected_amount !== undefined ? Number(collected_amount) : 0,
      status || 'active'
    );
    const newRow = db.prepare('SELECT * FROM funding_projects WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newRow);
  } catch (err) {
    next(err);
  }
});

// Update project
router.put('/nri/projects/:id', authenticateToken, (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, target_amount, collected_amount, status } = req.body;
    
    const proj = db.prepare('SELECT * FROM funding_projects WHERE id = ?').get(id);
    if (!proj) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const stmt = db.prepare(`
      UPDATE funding_projects 
      SET title = ?, description = ?, target_amount = ?, collected_amount = ?, status = ?
      WHERE id = ?
    `);
    stmt.run(
      title !== undefined ? title : proj.title,
      description !== undefined ? description : proj.description,
      target_amount !== undefined ? Number(target_amount) : proj.target_amount,
      collected_amount !== undefined ? Number(collected_amount) : proj.collected_amount,
      status !== undefined ? status : proj.status,
      id
    );

    const updatedRow = db.prepare('SELECT * FROM funding_projects WHERE id = ?').get(id);
    res.json(updatedRow);
  } catch (err) {
    next(err);
  }
});

// Delete project
router.delete('/nri/projects/:id', authenticateToken, (req, res, next) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM funding_projects WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully', id });
  } catch (err) {
    next(err);
  }
});


// ─── VOLUNTEER OPPORTUNITIES ENDPOINTS ───

// Get all volunteers
router.get('/nri/volunteers', (req, res, next) => {
  try {
    const rows = db.prepare('SELECT * FROM volunteer_opportunities ORDER BY id DESC').all();
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Create volunteer opportunity
router.post('/nri/volunteers', authenticateToken, (req, res, next) => {
  try {
    const { title, category, description, contact_info, is_active } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Volunteer title is required' });
    }
    const stmt = db.prepare(
      'INSERT INTO volunteer_opportunities (title, category, description, contact_info, is_active) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(
      title,
      category || null,
      description || null,
      contact_info || null,
      is_active !== undefined ? is_active : 1
    );
    const newRow = db.prepare('SELECT * FROM volunteer_opportunities WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newRow);
  } catch (err) {
    next(err);
  }
});

// Update volunteer opportunity
router.put('/nri/volunteers/:id', authenticateToken, (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category, description, contact_info, is_active } = req.body;
    
    const vol = db.prepare('SELECT * FROM volunteer_opportunities WHERE id = ?').get(id);
    if (!vol) {
      return res.status(404).json({ error: 'Volunteer opportunity not found' });
    }

    const stmt = db.prepare(`
      UPDATE volunteer_opportunities 
      SET title = ?, category = ?, description = ?, contact_info = ?, is_active = ?
      WHERE id = ?
    `);
    stmt.run(
      title !== undefined ? title : vol.title,
      category !== undefined ? category : vol.category,
      description !== undefined ? description : vol.description,
      contact_info !== undefined ? contact_info : vol.contact_info,
      is_active !== undefined ? is_active : vol.is_active,
      id
    );

    const updatedRow = db.prepare('SELECT * FROM volunteer_opportunities WHERE id = ?').get(id);
    res.json(updatedRow);
  } catch (err) {
    next(err);
  }
});

// Delete volunteer opportunity
router.delete('/nri/volunteers/:id', authenticateToken, (req, res, next) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM volunteer_opportunities WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Volunteer opportunity not found' });
    }
    res.json({ message: 'Volunteer opportunity deleted successfully', id });
  } catch (err) {
    next(err);
  }
});

// ─── CENSUS (HOUSEHOLDS) ENDPOINTS ───
router.get('/census', (req, res, next) => {
  try {
    const rows = db.prepare('SELECT * FROM census ORDER BY id DESC').all();
    const camelRows = rows.map(r => ({
      id: r.id,
      year: r.year,
      totalPopulation: r.total_population,
      households: r.households,
      malePopulation: r.male_population,
      femalePopulation: r.female_population,
      childPopulation: r.child_population,
      seniorPopulation: r.senior_population
    }));
    res.json(camelRows);
  } catch (err) {
    next(err);
  }
});

// POST endpoint for census statistics
router.post('/census', authenticateToken, (req, res, next) => {
  try {
    // Only admin users can create census records
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }
    const {
      year,
      totalPopulation,
      households,
      malePopulation,
      femalePopulation,
      childPopulation,
      seniorPopulation
    } = req.body;
    if (year === undefined) {
      return res.status(400).json({ error: 'Year is required' });
    }
    const stmt = db.prepare(`
      INSERT INTO census (
        year, total_population, households, male_population,
        female_population, child_population, senior_population
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      year,
      totalPopulation ?? null,
      households ?? null,
      malePopulation ?? null,
      femalePopulation ?? null,
      childPopulation ?? null,
      seniorPopulation ?? null
    );
    const newRow = db.prepare('SELECT * FROM census WHERE id = ?').get(result.lastInsertRowid);
    // Convert to camelCase for frontend compatibility
    const camelRow = {
      id: newRow.id,
      year: newRow.year,
      totalPopulation: newRow.total_population,
      households: newRow.households,
      malePopulation: newRow.male_population,
      femalePopulation: newRow.female_population,
      childPopulation: newRow.child_population,
      seniorPopulation: newRow.senior_population
    };
    res.status(201).json(camelRow);
  } catch (err) {
    next(err);
  }
});

// PUT endpoint for census statistics
router.put('/census/:id', authenticateToken, (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM census WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Census record not found' });
    }
    const {
      year,
      totalPopulation,
      households,
      malePopulation,
      femalePopulation,
      childPopulation,
      seniorPopulation
    } = req.body;
    const stmt = db.prepare(`
      UPDATE census SET
        year = ?, total_population = ?, households = ?,
        male_population = ?, female_population = ?, child_population = ?, senior_population = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(
      year !== undefined ? year : existing.year,
      totalPopulation !== undefined ? totalPopulation : existing.total_population,
      households !== undefined ? households : existing.households,
      malePopulation !== undefined ? malePopulation : existing.male_population,
      femalePopulation !== undefined ? femalePopulation : existing.female_population,
      childPopulation !== undefined ? childPopulation : existing.child_population,
      seniorPopulation !== undefined ? seniorPopulation : existing.senior_population,
      id
    );
    const updatedRow = db.prepare('SELECT * FROM census WHERE id = ?').get(id);
    const camelRow = {
      id: updatedRow.id,
      year: updatedRow.year,
      totalPopulation: updatedRow.total_population,
      households: updatedRow.households,
      malePopulation: updatedRow.male_population,
      femalePopulation: updatedRow.female_population,
      childPopulation: updatedRow.child_population,
      seniorPopulation: updatedRow.senior_population
    };
    res.json(camelRow);
  } catch (err) {
    next(err);
  }
});

router.put('/households/:id', authenticateToken, (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM households WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Household not found' });
    }
    const {
      head_name,
      head_age,
      head_gender,
      head_education,
      head_occupation,
      spouse_name,
      spouse_education,
      spouse_occupation,
      num_members,
      category,
      religion,
      ration_card_type,
      annual_income,
      house_type,
      has_electricity,
      has_toilet,
      has_drainage,
      has_internet,
      has_solar,
      cooking_fuel,
      water_source,
      land_acres,
      irrigation_type,
      crops,
      livestock,
      remarks
    } = req.body;
    const stmt = db.prepare(`
      UPDATE households SET
        head_name = ?, head_age = ?, head_gender = ?, head_education = ?, head_occupation = ?,
        spouse_name = ?, spouse_education = ?, spouse_occupation = ?, num_members = ?,
        category = ?, religion = ?, ration_card_type = ?, annual_income = ?, house_type = ?,
        has_electricity = ?, has_toilet = ?, has_drainage = ?, has_internet = ?, has_solar = ?,
        cooking_fuel = ?, water_source = ?, land_acres = ?, irrigation_type = ?, crops = ?,
        livestock = ?, remarks = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(
      head_name !== undefined ? head_name : existing.head_name,
      head_age !== undefined ? head_age : existing.head_age,
      head_gender !== undefined ? head_gender : existing.head_gender,
      head_education !== undefined ? head_education : existing.head_education,
      head_occupation !== undefined ? head_occupation : existing.head_occupation,
      spouse_name !== undefined ? spouse_name : existing.spouse_name,
      spouse_education !== undefined ? spouse_education : existing.spouse_education,
      spouse_occupation !== undefined ? spouse_occupation : existing.spouse_occupation,
      num_members !== undefined ? num_members : existing.num_members,
      category !== undefined ? category : existing.category,
      religion !== undefined ? religion : existing.religion,
      ration_card_type !== undefined ? ration_card_type : existing.ration_card_type,
      annual_income !== undefined ? annual_income : existing.annual_income,
      house_type !== undefined ? house_type : existing.house_type,
      has_electricity !== undefined ? has_electricity : existing.has_electricity,
      has_toilet !== undefined ? has_toilet : existing.has_toilet,
      has_drainage !== undefined ? has_drainage : existing.has_drainage,
      has_internet !== undefined ? has_internet : existing.has_internet,
      has_solar !== undefined ? has_solar : existing.has_solar,
      cooking_fuel !== undefined ? cooking_fuel : existing.cooking_fuel,
      water_source !== undefined ? water_source : existing.water_source,
      land_acres !== undefined ? land_acres : existing.land_acres,
      irrigation_type !== undefined ? irrigation_type : existing.irrigation_type,
      crops !== undefined ? crops : existing.crops,
      livestock !== undefined ? livestock : existing.livestock,
      remarks !== undefined ? remarks : existing.remarks,
      id
    );
    const updatedRow = db.prepare('SELECT * FROM households WHERE id = ?').get(id);
    res.json(updatedRow);
  } catch (err) {
    next(err);
  }
});

// DELETE endpoint for census statistics
router.delete('/census/:id', authenticateToken, (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM census WHERE id = ?');
    const result = stmt.run(id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Census record not found' });
    }
    res.json({ message: 'Census record deleted successfully', id });
  } catch (err) {
    next(err);
  }
});

// ─── VILLAGE STATS ENDPOINTS ───

// Get all stats (optionally filtered by category)
router.get('/village-stats', (req, res, next) => {
  try {
    const { category } = req.query;
    const rows = category
      ? db.prepare('SELECT * FROM village_stats WHERE category = ? ORDER BY sort_order ASC, stat_key ASC').all(category)
      : db.prepare('SELECT * FROM village_stats ORDER BY category ASC, sort_order ASC, stat_key ASC').all();
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Get all distinct categories
router.get('/village-stats/categories', (req, res, next) => {
  try {
    const rows = db.prepare('SELECT DISTINCT category FROM village_stats ORDER BY category ASC').all();
    res.json(rows.map(r => r.category));
  } catch (err) {
    next(err);
  }
});

// Create or update a stat (upsert by category+stat_key)
router.post('/village-stats', authenticateToken, (req, res, next) => {
  try {
    const { category, stat_key, stat_value, sort_order } = req.body;
    if (!category || !stat_key || stat_value === undefined) {
      return res.status(400).json({ error: 'category, stat_key and stat_value are required' });
    }
    const stmt = db.prepare(`
      INSERT INTO village_stats (category, stat_key, stat_value, sort_order, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(category, stat_key) DO UPDATE SET
        stat_value = excluded.stat_value,
        sort_order = excluded.sort_order,
        updated_at = CURRENT_TIMESTAMP
    `);
    stmt.run(category, stat_key, String(stat_value), sort_order ?? 0);
    const row = db.prepare('SELECT * FROM village_stats WHERE category = ? AND stat_key = ?').get(category, stat_key);
    res.status(201).json(row);
  } catch (err) {
    next(err);
  }
});

// Update a stat by id
router.put('/village-stats/:id', authenticateToken, (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, stat_key, stat_value, sort_order } = req.body;
    const existing = db.prepare('SELECT * FROM village_stats WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Stat not found' });
    db.prepare(`
      UPDATE village_stats SET category=?, stat_key=?, stat_value=?, sort_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?
    `).run(
      category ?? existing.category,
      stat_key ?? existing.stat_key,
      stat_value !== undefined ? String(stat_value) : existing.stat_value,
      sort_order ?? existing.sort_order,
      id
    );
    res.json(db.prepare('SELECT * FROM village_stats WHERE id = ?').get(id));
  } catch (err) {
    next(err);
  }
});

// Delete a stat
router.delete('/village-stats/:id', authenticateToken, (req, res, next) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM village_stats WHERE id = ?').run(id);
    if (result.changes === 0) return res.status(404).json({ error: 'Stat not found' });
    res.json({ message: 'Stat deleted', id });
  } catch (err) {
    next(err);
  }
});

export default router;
