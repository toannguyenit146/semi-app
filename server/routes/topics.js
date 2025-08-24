const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Lấy tất cả topics theo category
router.get('/category/:categorySlug', async (req, res) => {
  try {
    const { categorySlug } = req.params;
    
    const [topics] = await db.execute(`
      SELECT t.*, c.name as category_name,
      (SELECT COUNT(*) FROM questions WHERE topic_id = t.id) as question_count
      FROM topics t
      JOIN categories c ON t.category_id = c.id
      WHERE c.slug = ?
    `, [categorySlug]);
    
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lấy topic theo ID
router.get('/:id', async (req, res) => {
  try {
    const [topics] = await db.execute('SELECT * FROM topics WHERE id = ?', [req.params.id]);
    
    if (topics.length === 0) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    
    res.json(topics[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tạo topic mới
router.post('/', async (req, res) => {
  try {
    const { category_id, name, description, logo } = req.body;
    
    const [result] = await db.execute(
      'INSERT INTO topics (category_id, name, description, logo) VALUES (?, ?, ?, ?)',
      [category_id, name, description, logo]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Topic created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cập nhật topic
router.put('/:id', async (req, res) => {
  try {
    const { name, description, logo } = req.body;
    
    await db.execute(
      'UPDATE topics SET name = ?, description = ?, logo = ? WHERE id = ?',
      [name, description, logo, req.params.id]
    );
    
    res.json({ message: 'Topic updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Xóa topic
router.delete('/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM topics WHERE id = ?', [req.params.id]);
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;