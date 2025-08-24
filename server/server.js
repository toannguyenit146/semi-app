const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const topicsRoutes = require('./routes/topics');
const questionsRoutes = require('./routes/questions');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Routes
app.use('/api/topics', topicsRoutes);
app.use('/api/questions', questionsRoutes);

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ 
    message: 'File uploaded successfully',
    filename: req.file.filename,
    path: req.file.path 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});