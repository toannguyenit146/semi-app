import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Upload, X, Save, Loader, Trash2, Edit } from 'lucide-react';
import { useQuestions } from '../hooks/useQuestions';
import { topicsAPI } from '../services/api';
import { ANSWER_LABELS, QUIZ_SETTINGS } from '../utils/constants';

const EditTopic = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { questions, loading, error, addQuestion, updateQuestion, deleteQuestion } = useQuestions(topicId);
  
  const [topic, setTopic] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [aiQuestions, setAiQuestions] = useState({ count: 5, file: null });

  // Fetch topic details
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await topicsAPI.getById(topicId);
        setTopic(response.data);
      } catch (err) {
        console.error('Failed to fetch topic:', err);
      }
    };

    if (topicId) {
      fetchTopic();
    }
  }, [topicId]);

  const handleAddQuestion = async (questionData) => {
    const result = await addQuestion(questionData);
    if (result.success) {
      setShowAddForm(false);
    }
    return result;
  };

  const handleUpdateQuestion = async (id, questionData) => {
    const result = await updateQuestion(id, questionData);
    if (result.success) {
      setEditingQuestion(null);
    }
    return result;
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      await deleteQuestion(id);
    }
  };

  const generateAIQuestions = async () => {
    alert("Tính năng tạo câu hỏi bằng AI sẽ được phát triển trong phiên bản tiếp theo!");
  };

  if (loading && !topic) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-blue-600 hover:text-blue-800 mr-6 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Quay lại
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Chỉnh sửa: {topic?.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  {questions.length} câu hỏi
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm câu hỏi
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* AI Question Generation */}
        <AIQuestionGenerator onGenerate={generateAIQuestions} />

        {/* Questions List */}
        <div className="space-y-6">
          {questions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Chưa có câu hỏi nào
              </h3>
              <p className="text-gray-500 mb-6">
                Hãy thêm câu hỏi đầu tiên cho chủ đề này
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Thêm câu hỏi mới
              </button>
            </div>
          ) : (
            questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                isEditing={editingQuestion === question.id}
                onEdit={() => setEditingQuestion(question.id)}
                onSave={handleUpdateQuestion}
                onCancel={() => setEditingQuestion(null)}
                onDelete={() => handleDeleteQuestion(question.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Add Question Modal */}
      {showAddForm && (
        <QuestionForm
          onSave={handleAddQuestion}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

// AI Question Generator Component
const AIQuestionGenerator = ({ onGenerate }) => {
  const [file, setFile] = useState(null);
  const [count, setCount] = useState(5);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Upload className="w-5 h-5 mr-2 text-purple-600" />
        Tạo câu hỏi bằng AI
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tải file Word (.docx, .doc)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">Kéo thả file hoặc click để chọn</p>
            <p className="text-sm text-gray-500">Hỗ trợ .docx, .doc (tối đa 10MB)</p>
            <input
              type="file"
              accept=".doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
          </div>
          {file && (
            <p className="text-sm text-green-600 mt-2">
              ✓ Đã chọn: {file.name}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lượng câu hỏi tạo
            </label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 5)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              min="1"
              max="50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại câu hỏi
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option>Trắc nghiệm 4 đáp án</option>
              <option>Đúng/Sai</option>
              <option>Điền từ khóa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Độ khó
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option>Dễ</option>
              <option>Trung bình</option>
              <option>Khó</option>
              <option>Hỗn hợp</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={onGenerate}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-medium text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Tạo câu hỏi với AI
        </button>
        <p className="text-sm text-gray-500 mt-3">
          Tính năng này sẽ được tích hợp với AI để tự động tạo câu hỏi từ nội dung tài liệu
        </p>
      </div>
    </div>
  );
};

// Question Card Component
const QuestionCard = ({ question, index, isEditing, onEdit, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState({
    question: question.question,
    answer_a: question.answer_a,
    answer_b: question.answer_b,
    answer_c: question.answer_c,
    answer_d: question.answer_d,
    correct_answer: question.correct_answer,
    time_limit: question.time_limit
  });

  const handleSave = async () => {
    const result = await onSave(question.id, formData);
    if (!result.success) {
      alert('Lỗi: ' + result.error);
    }
  };

  const getCorrectAnswerIndex = () => {
    const answerMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
    return answerMap[question.correct_answer] || 0;
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Chỉnh sửa câu hỏi {index + 1}</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Lưu
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Hủy
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Câu hỏi</label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Nhập nội dung câu hỏi..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['answer_a', 'answer_b', 'answer_c', 'answer_d'].map((key, answerIndex) => (
              <div key={key} className="flex items-center space-x-3">
                <input
                  type="radio"
                  checked={formData.correct_answer === ['a', 'b', 'c', 'd'][answerIndex]}
                  onChange={() => setFormData({...formData, correct_answer: ['a', 'b', 'c', 'd'][answerIndex]})}
                  className="text-green-600 focus:ring-green-500"
                />
                <input
                  value={formData[key]}
                  onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Đáp án ${ANSWER_LABELS[answerIndex]}`}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Thời gian (giây):</label>
            <input
              type="number"
              value={formData.time_limit}
              onChange={(e) => setFormData({...formData, time_limit: parseInt(e.target.value) || QUIZ_SETTINGS.DEFAULT_TIME_LIMIT})}
              className="w-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={QUIZ_SETTINGS.MIN_TIME_LIMIT}
              max={QUIZ_SETTINGS.MAX_TIME_LIMIT}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Câu hỏi {index + 1}</h3>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-800 text-lg leading-relaxed">{question.question}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {[question.answer_a, question.answer_b, question.answer_c, question.answer_d].map((answer, answerIndex) => (
          <div
            key={answerIndex}
            className={`p-3 rounded-lg border-2 flex items-center space-x-3 ${
              answerIndex === getCorrectAnswerIndex()
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              answerIndex === getCorrectAnswerIndex()
                ? 'bg-green-500 text-white'
                : 'bg-gray-400 text-white'
            }`}>
              {ANSWER_LABELS[answerIndex]}
            </div>
            <span className="font-medium">{answer}</span>
            {answerIndex === getCorrectAnswerIndex() && (
              <span className="text-green-600 text-sm font-medium ml-auto">✓ Đúng</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Thời gian: {question.time_limit}s</span>
        <span>Đáp án đúng: {ANSWER_LABELS[getCorrectAnswerIndex()]}</span>
      </div>
    </div>
  );
};

// Question Form Component
const QuestionForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    question: '',
    answer_a: '',
    answer_b: '',
    answer_c: '',
    answer_d: '',
    correct_answer: 'a',
    time_limit: QUIZ_SETTINGS.DEFAULT_TIME_LIMIT
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.question.trim()) {
      alert('Vui lòng nhập câu hỏi');
      return;
    }
    
    if (!formData.answer_a.trim() || !formData.answer_b.trim() || 
        !formData.answer_c.trim() || !formData.answer_d.trim()) {
      alert('Vui lòng nhập đầy đủ 4 đáp án');
      return;
    }

    setLoading(true);
    const result = await onSave(formData);
    setLoading(false);
    
    if (!result.success) {
      alert('Lỗi: ' + result.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Thêm câu hỏi mới</h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Câu hỏi *
              </label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Nhập nội dung câu hỏi..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Đáp án * (Chọn đáp án đúng)
              </label>
              <div className="grid grid-cols-1 gap-3">
                {['answer_a', 'answer_b', 'answer_c', 'answer_d'].map((key, answerIndex) => (
                  <div key={key} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="correct_answer"
                      checked={formData.correct_answer === ['a', 'b', 'c', 'd'][answerIndex]}
                      onChange={() => setFormData({...formData, correct_answer: ['a', 'b', 'c', 'd'][answerIndex]})}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {ANSWER_LABELS[answerIndex]}
                    </div>
                    <input
                      value={formData[key]}
                      onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Nhập đáp án ${ANSWER_LABELS[answerIndex]}...`}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian trả lời (giây)
              </label>
              <input
                type="number"
                value={formData.time_limit}
                onChange={(e) => setFormData({...formData, time_limit: parseInt(e.target.value) || QUIZ_SETTINGS.DEFAULT_TIME_LIMIT})}
                className="w-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={QUIZ_SETTINGS.MIN_TIME_LIMIT}
                max={QUIZ_SETTINGS.MAX_TIME_LIMIT}
              />
              <p className="text-sm text-gray-500 mt-1">
                Từ {QUIZ_SETTINGS.MIN_TIME_LIMIT} đến {QUIZ_SETTINGS.MAX_TIME_LIMIT} giây
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Lưu câu hỏi
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTopic;