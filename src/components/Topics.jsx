import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Play, Settings, FileText, Plus, Loader } from 'lucide-react';
import { useTopics } from '../hooks/useQuestions';
import { CATEGORIES } from '../utils/constants';

const Topics = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const { topics, loading, error } = useTopics(category);

  const categoryInfo = CATEGORIES[category];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải danh sách chủ đề...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-6 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Quay lại trang chủ
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {categoryInfo?.name || 'Danh sách chủ đề'}
              </h1>
              <p className="text-gray-600 mt-1">
                {categoryInfo?.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {topics.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Chưa có chủ đề nào
            </h3>
            <p className="text-gray-500">
              Hãy thêm chủ đề đầu tiên để bắt đầu học tập
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onStartQuiz={() => navigate(`/quiz/${topic.id}`)}
                onEdit={() => navigate(`/edit/${topic.id}`)}
              />
            ))}

            {/* Add Topic Placeholder */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 flex items-center justify-center h-80 cursor-not-allowed opacity-50 hover:opacity-60 transition-opacity">
              <div className="text-center">
                <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  Thêm chủ đề mới
                </h3>
                <p className="text-sm text-gray-400">
                  (Tính năng sắp ra mắt)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TopicCard = ({ topic, onStartQuiz, onEdit }) => {
  const hasQuestions = topic.question_count > 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Topic Image/Icon */}
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
        {topic.logo ? (
          <img
            src={topic.logo}
            alt={topic.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center">
            <FileText className="w-12 h-12 text-white" />
          </div>
        )}
        
        {/* Question Count Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-sm font-medium text-gray-800">
            {topic.question_count} câu hỏi
          </span>
        </div>
      </div>

      {/* Topic Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {topic.name}
        </h3>
        
        {topic.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {topic.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onStartQuiz}
            disabled={!hasQuestions}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
              hasQuestions
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4 mr-2" />
            {hasQuestions ? 'Bắt đầu' : 'Chưa có câu hỏi'}
          </button>
          
          <button
            onClick={onEdit}
            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Settings className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topics;