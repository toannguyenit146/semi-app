// Categories configuration
export const CATEGORIES = {
  gdct: {
    name: 'Kiến thức GDCT',
    description: 'Giáo dục chính trị',
    color: 'red',
    icon: 'star'
  },
  legal: {
    name: 'Kiến thức pháp luật',
    description: 'Luật quân đội',
    color: 'blue',
    icon: 'fileText'
  },
  permanent: {
    name: 'Kiến thức thường trực',
    description: 'Ôn tập liên tục',
    color: 'green',
    icon: 'clock'
  }
};

// Quiz settings
export const QUIZ_SETTINGS = {
  DEFAULT_TIME_LIMIT: 10,
  MIN_TIME_LIMIT: 5,
  MAX_TIME_LIMIT: 60,
  RESULT_DISPLAY_TIME: 2000
};

// Answer labels
export const ANSWER_LABELS = ['A', 'B', 'C', 'D'];

// API endpoints
export const API_ENDPOINTS = {
  BASE_URL: 'http://localhost:5000/api',
  TOPICS: '/topics',
  QUESTIONS: '/questions',
  UPLOAD: '/upload'
};

// File upload settings
export const UPLOAD_SETTINGS = {
  ALLOWED_TYPES: ['.doc', '.docx'],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_QUESTIONS: 50
};