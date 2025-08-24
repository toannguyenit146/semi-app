import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Topics from './components/Topics';
import Quiz from './components/Quiz';
import EditTopic from './components/EditTopic';
import AICreate from './components/AICreate';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/topics/:category" element={<Topics />} />
          <Route path="/quiz/:topicId" element={<Quiz />} />
          <Route path="/edit/:topicId" element={<EditTopic />} />
          <Route path="/ai-create" element={<AICreate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;