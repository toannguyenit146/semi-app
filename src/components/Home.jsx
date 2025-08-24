import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, FileText, Clock, Plus } from 'lucide-react';
import { CATEGORIES } from '../utils/constants';

const Home = () => {
  const navigate = useNavigate();

  const getIcon = (iconName) => {
    const icons = {
      star: Star,
      fileText: FileText,
      clock: Clock,
      plus: Plus
    };
    return icons[iconName] || Star;
  };

  const getColorClasses = (color) => {
    const colorMap = {
      red: 'bg-red-100 text-red-600',
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-yellow-500 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            SEMI
          </h1>
          <p className="text-2xl text-white/90 mb-2">
            Ứng dụng giáo dục chính trị - pháp luật
          </p>
          <p className="text-lg text-white/80">
            Quân đội nhân dân Việt Nam
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(CATEGORIES).map(([key, category]) => {
            const IconComponent = getIcon(category.icon);
            return (
              <div
                key={key}
                onClick={() => navigate(`/topics/${key}`)}
                className="bg-white rounded-2xl p-8 shadow-2xl cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-3xl group"
              >
                <div className="text-center">
                  <div className={`w-20 h-20 ${getColorClasses(category.color)} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">
                    {category.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* AI Create Card */}
          <div
            onClick={() => navigate('/ai-create')}
            className="bg-white rounded-2xl p-8 shadow-2xl cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-3xl group border-2 border-purple-200 hover:border-purple-400"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Tạo câu hỏi với AI
              </h3>
              <p className="text-gray-600">
                Tự động tạo câu hỏi
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-white/60 text-sm">
            Phiên bản 1.0.0 | Phát triển bởi Semi Team
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;