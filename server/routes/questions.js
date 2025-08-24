const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Lấy tất cả questions theo topic
router.get('/topic/:topicId', async (req, res) => {
  try {
    const [questions] = await db.execute(
      'SELECT * FROM questions WHERE topic_id = ? ORDER BY created_at ASC',
      [req.params.topicId]
    );
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tạo question mới
router.post('/', async (req, res) => {
  try {
    const { 
      topic_id, question, answer_a, answer_b, 
      answer_c, answer_d, correct_answer, time_limit 
    } = req.body;
    
    const [result] = await db.execute(`
      INSERT INTO questions 
      (topic_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, time_limit)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [topic_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, time_limit]);
    
    res.status(201).json({ id: result.insertId, message: 'Question created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cập nhật question
router.put('/:id', async (req, res) => {
  try {
    const { 
      question, answer_a, answer_b, answer_c, 
      answer_d, correct_answer, time_limit 
    } = req.body;
    
    await db.execute(`
      UPDATE questions SET 
      question = ?, answer_a = ?, answer_b = ?, answer_c = ?, 
      answer_d = ?, correct_answer = ?, time_limit = ?
      WHERE id = ?
    `, [question, answer_a, answer_b, answer_c, answer_d, correct_answer, time_limit, req.params.id]);
    
    res.json({ message: 'Question updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Xóa question
router.delete('/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM questions WHERE id = ?', [req.params.id]);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lưu kết quả quiz
router.post('/quiz-result', async (req, res) => {
  try {
    const { topic_id, total_questions, correct_answers, score_percentage } = req.body;
    
    await db.execute(
      'INSERT INTO quiz_sessions (topic_id, total_questions, correct_answers, score_percentage) VALUES (?, ?, ?, ?)',
      [topic_id, total_questions, correct_answers, score_percentage]
    );
    
    res.status(201).json({ message: 'Quiz result saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;