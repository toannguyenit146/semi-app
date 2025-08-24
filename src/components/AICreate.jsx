import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Upload, FileText, Settings, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { uploadAPI } from '../services/api';
import { UPLOAD_SETTINGS } from '../utils/constants';

const AICreate = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [settings, setSettings] = useState({
    questionCount: 5,
    questionType: 'multiple_choice',
    difficulty: 'medium',
    language: 'vietnamese'
  });
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setError('');
    
    if (!file) return;

    // Validate file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!['doc', 'docx'].includes(fileExtension)) {
      setError('Chỉ hỗ trợ file .doc và .docx');
      return;
    }

    // Validate file size
    if (file.size > UPLOAD_SETTINGS.MAX_FILE_SIZE) {
      setError('File không được vượt quá 10MB');
      return;
    }

    setSelectedFile(file);
    setUploadResult(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await uploadAPI.uploadFile(formData);
      setUploadResult(response.data);
      
      // Simulate AI processing
      setTimeout(() => {
        alert(`Đã upload thành công! Sẽ tạo ${settings.questionCount} câu hỏi từ file "${selectedFile.name}". Tính năng AI sẽ được hoàn thiện trong phiên bản tiếp theo.`);
      }, 1000);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Lỗi upload file');
    } finally {
      setUploading(false);
    }
  };

  const generateWithAI = () => {
    alert("Tính năng tạo câu hỏi bằng AI đang được phát triển. Sẽ sớm có trong phiên bản tiếp theo!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600">
      {/* Header */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-white hover:text-white/80 mr-6 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Quay lại trang chủ
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white">Tạo câu hỏi với AI</h1>
              <p className="text-white/90 mt-2">
                Tự động tạo câu hỏi từ tài liệu Word bằng trí tuệ nhân tạo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                AI Question Generator
              </h2>
              <p className="text-white/90">
                Upload tài liệu và để AI tạo câu hỏi tự động
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* File Upload Section */}
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <Upload className="w-5 h-5 mr-2 text-purple-600" />
                    Tải lên tài liệu
                  </h3>
                  
                  <div className="space-y-4">
                    {/* File Drop Zone */}
                    <div 
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                        selectedFile 
                          ? 'border-green-500 bg-green-50' 
                          : error 
                            ? 'border-red-500 bg-red-50 hover:border-red-600'
                            : 'border-gray-300 bg-gray-50 hover:border-purple-500 hover:bg-purple-50'
                      }`}
                      onClick={() => document.getElementById('file-input').click()}
                    >
                      {selectedFile ? (
                        <div>
                          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                          <p className="text-green-700 font-medium mb-2">
                            ✓ Đã chọn file
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-700 font-medium mb-2">
                            Kéo thả file vào đây hoặc click để chọn
                          </p>
                          <p className="text-sm text-gray-500">
                            Hỗ trợ .docx, .doc (tối đa 10MB)
                          </p>
                        </div>
                      )}
                    </div>

                    <input
                      id="file-input"
                      type="file"
                      accept=".doc,.docx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {error && (
                      <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm">{error}</span>
                      </div>
                    )}

                    {uploadResult && (
                      <div className="flex items-center text-green-600 bg-green-50 p-3 rounded-lg">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm">Upload thành công: {uploadResult.filename}</span>
                      </div>
                    )}

                    {/* Upload Button */}
                    {selectedFile && !uploadResult && (
                      <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Đang upload...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload file
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* AI Settings Section */}
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-purple-600" />
                    Cấu hình AI
                  </h3>

                  <div className="space-y-6">
                    {/* Question Count */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số lượng câu hỏi
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={settings.questionCount}
                          onChange={(e) => setSettings({...settings, questionCount: parseInt(e.target.value) || 5})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          min="1"
                          max={UPLOAD_SETTINGS.MAX_QUESTIONS}
                        />
                        <span className="absolute right-3 top-3 text-gray-500 text-sm">
                          câu hỏi
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Tối đa {UPLOAD_SETTINGS.MAX_QUESTIONS} câu hỏi
                      </p>
                    </div>

                    {/* Question Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loại câu hỏi
                      </label>
                      <select
                        value={settings.questionType}
                        onChange={(e) => setSettings({...settings, questionType: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="multiple_choice">Trắc nghiệm 4 đáp án</option>
                        <option value="true_false">Đúng/Sai</option>
                        <option value="fill_blank">Điền từ khóa</option>
                        <option value="mixed">Hỗn hợp</option>
                      </select>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Độ khó
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'easy', label: 'Dễ', color: 'green' },
                          { value: 'medium', label: 'TB', color: 'yellow' },
                          { value: 'hard', label: 'Khó', color: 'red' }
                        ].map((level) => (
                          <button
                            key={level.value}
                            onClick={() => setSettings({...settings, difficulty: level.value})}
                            className={`p-3 rounded-lg font-medium transition-all ${
                              settings.difficulty === level.value
                                ? `bg-${level.color}-500 text-white`
                                : `bg-${level.color}-100 text-${level.color}-700 hover:bg-${level.color}-200`
                            }`}
                          >
                            {level.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Language */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngôn ngữ
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => setSettings({...settings, language: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="vietnamese">Tiếng Việt</option>
                        <option value="english">English</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={generateWithAI}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Tạo câu hỏi với AI
                  </button>
                  
                  <button
                    onClick={() => navigate('/')}
                    className="flex-1 sm:flex-none bg-gray-600 hover:bg-gray-700 text-white py-4 px-6 rounded-xl font-medium transition-colors"
                  >
                    Quay lại
                  </button>
                </div>

                {/* Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Thông tin về tính năng AI:</p>
                      <ul className="space-y-1 text-blue-700">
                        <li>• Tự động phân tích nội dung tài liệu</li>
                        <li>• Tạo câu hỏi theo độ khó được chỉ định</li>
                        <li>• Hỗ trợ nhiều loại câu hỏi khác nhau</li>
                        <li>• Tính năng đang trong quá trình phát triển</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICreate;