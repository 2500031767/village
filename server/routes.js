import express from 'express';
import bcrypt from 'bcryptjs';
import db from './config/db.js';
import { authenticateToken, generateToken } from './middleware/auth.js';

const router = express.Router();

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
router.post('/gallery', authenticateToken, (req, res, next) => {
  try {
    const { title, category, image_url, description } = req.body;
    if (!image_url) {
      return res.status(400).json({ error: 'Image URL is required' });
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

// Update gallery item
router.put('/gallery/:id', authenticateToken, (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category, image_url, description } = req.body;
    
    const photo = db.prepare('SELECT * FROM gallery WHERE id = ?').get(id);
    if (!photo) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    const stmt = db.prepare(`
      UPDATE gallery 
      SET title = ?, category = ?, image_url = ?, description = ?
      WHERE id = ?
    `);
    stmt.run(
      title !== undefined ? title : photo.title,
      category !== undefined ? category : photo.category,
      image_url !== undefined ? image_url : photo.image_url,
      description !== undefined ? description : photo.description,
      id
    );

    const updatedRow = db.prepare('SELECT * FROM gallery WHERE id = ?').get(id);
    res.json(updatedRow);
  } catch (err) {
    next(err);
  }
});

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


// ─── VILLAGE ISSUES ENDPOINTS ───

// Get all issues
router.get('/issues', (req, res, next) => {
  try {
    const rows = db.prepare('SELECT * FROM issues ORDER BY priority ASC, id DESC').all();
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Create issue
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

export default router;
