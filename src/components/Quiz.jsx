import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, Check, X, Star } from 'lucide-react';
import { useQuestions } from '../hooks/useQuestions';
import { questionsAPI } from '../services/api';
import { QUIZ_SETTINGS, ANSWER_LABELS } from '../utils/constants';

const Quiz = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { questions, loading } = useQuestions(topicId);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_SETTINGS.DEFAULT_TIME_LIMIT);
  const [gameState, setGameState] = useState('playing'); // playing, answered, finished
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [topicName, setTopicName] = useState('');

  const currentQuestion = questions[currentQuestionIndex];

  // Initialize quiz
  useEffect(() => {
    if (questions.length > 0) {
      setTimeLeft(currentQuestion?.time_limit || QUIZ_SETTINGS.DEFAULT_TIME_LIMIT);
    }
  }, [questions, currentQuestionIndex]);

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleAnswer(-1); // Time's up
    }
  }, [timeLeft, gameState]);

  // Handle answer selection
  const handleAnswer = (answerIndex) => {
    if (gameState !== 'playing') return;

    const correct = answerIndex === getCorrectAnswerIndex();
    
    setSelectedAnswer(answerIndex);
    setIsCorrect(correct);
    setGameState('answered');
    setShowResult(true);

    if (correct) {
      setScore(score + 1);
    }

    // Auto advance to next question
    setTimeout(() => {
      setShowResult(false);
      if (currentQuestionIndex < questions.length - 1) {
        nextQuestion();
      } else {
        finishQuiz();
      }
    }, QUIZ_SETTINGS.RESULT_DISPLAY_TIME);
  };

  const getCorrectAnswerIndex = () => {
    if (!currentQuestion) return -1;
    const answerMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
    return answerMap[currentQuestion.correct_answer] || 0;
  };

  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    setTimeLeft(questions[nextIndex]?.time_limit || QUIZ_SETTINGS.DEFAULT_TIME_LIMIT);
    setGameState('playing');
    setSelectedAnswer(null);
  };

  const finishQuiz = async () => {
    setGameState('finished');
    
    // Save quiz result
    try {
      await questionsAPI.saveQuizResult({
        topic_id: topicId,
        total_questions: questions.length,
        correct_answers: score + (isCorrect ? 1 : 0),
        score_percentage: Math.round(((score + (isCorrect ? 1 : 0)) / questions.length) * 100)
      });
    } catch (error) {
      console.error('Failed to save quiz result:', error);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(questions[0]?.time_limit || QUIZ_SETTINGS.DEFAULT_TIME_LIMIT);
    setGameState('playing');
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="text-center text-white">
          <X className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Chưa có câu hỏi</h2>
          <p className="mb-6">Chủ đề này chưa có câu hỏi nào.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return <QuizResults 
      score={score + (isCorrect ? 1 : 0)} 
      total={questions.length} 
      onRestart={restartQuiz}
      onBack={() => navigate(-1)}
      onHome={() => navigate('/')}
    />;
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answers = [
    currentQuestion?.answer_a,
    currentQuestion?.answer_b,
    currentQuestion?.answer_c,
    currentQuestion?.answer_d
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      {/* Header */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between text-white mb-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-white/80 hover:text-white mr-6 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Thoát
              </button>
              <div>
                <h1 className="text-2xl font-bold">
                  Câu {currentQuestionIndex + 1} / {questions.length}
                </h1>
                <p className="text-white/80">{topicName}</p>
              </div>
            </div>
            
            {/* Timer */}
            <div className="text-right">
              <p className="text-sm text-white/80 mb-1">Thời gian còn lại</p>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span className={`text-2xl font-bold ${timeLeft <= 3 ? 'text-red-300 animate-pulse' : ''}`}>
                    {timeLeft}s
                  </span>
                </div>
                <div className="w-16 h-16 relative">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                    <circle 
                      cx="18" cy="18" r="16" 
                      fill="none" stroke="white" strokeWidth="2"
                      strokeDasharray={`${(timeLeft / (currentQuestion?.time_limit || QUIZ_SETTINGS.DEFAULT_TIME_LIMIT)) * 100} 100`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-3 mb-8">
            <div 
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center leading-relaxed">
              {currentQuestion?.question}
            </h2>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={gameState !== 'playing'}
                  className={`p-6 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                    gameState === 'answered'
                      ? selectedAnswer === index
                        ? isCorrect
                          ? 'bg-green-500 text-white shadow-lg'
                          : 'bg-red-500 text-white shadow-lg'
                        : index === getCorrectAnswerIndex()
                          ? 'bg-green-500 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-600'
                      : 'bg-blue-50 hover:bg-blue-100 text-gray-800 hover:shadow-lg border-2 border-transparent hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      gameState === 'answered'
                        ? selectedAnswer === index
                          ? isCorrect
                            ? 'bg-white text-green-500'
                            : 'bg-white text-red-500'
                          : index === getCorrectAnswerIndex()
                            ? 'bg-white text-green-500'
                            : 'bg-gray-400 text-white'
                        : 'bg-blue-600 text-white'
                    }`}>
                      {ANSWER_LABELS[index]}
                    </div>
                    <span className="font-medium text-lg leading-relaxed">
                      {answer}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Result Popup */}
      {showResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`bg-white rounded-2xl p-8 text-center shadow-2xl transform animate-pulse max-w-md mx-4 ${
            isCorrect ? 'border-4 border-green-500' : 'border-4 border-red-500'
          }`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isCorrect ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isCorrect ? (
                <Check className="w-10 h-10 text-green-600" />
              ) : (
                <X className="w-10 h-10 text-red-600" />
              )}
            </div>
            <h3 className={`text-3xl font-bold mb-4 ${
              isCorrect ? 'text-green-600' : 'text-red-600'
            }`}>
              {isCorrect ? 'Chính xác!' : 'Sai rồi!'}
            </h3>
            <p className="text-gray-600 text-lg">
              {isCorrect 
                ? 'Bạn đã trả lời đúng!' 
                : `Đáp án đúng là: ${ANSWER_LABELS[getCorrectAnswerIndex()]} - ${answers[getCorrectAnswerIndex()]}`
              }
            </p>
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Tự động chuyển sang câu tiếp theo...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Quiz Results Component
const QuizResults = ({ score, total, onRestart, onBack, onHome }) => {
  const percentage = Math.round((score / total) * 100);
  
  const getResultMessage = () => {
    if (percentage >= 90) return { message: "Xuất sắc!", color: "text-green-600", icon: "🏆" };
    if (percentage >= 70) return { message: "Tốt!", color: "text-blue-600", icon: "👍" };
    if (percentage >= 50) return { message: "Khá!", color: "text-yellow-600", icon: "👌" };
    return { message: "Cần cố gắng thêm!", color: "text-red-600", icon: "💪" };
  };

  const result = getResultMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-blue-700 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Star className="w-12 h-12 text-yellow-600" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Hoàn thành!</h2>
        
        <div className="text-6xl font-bold text-blue-600 mb-2">
          {score}/{total}
        </div>
        
        <p className="text-gray-600 mb-2">Số câu trả lời đúng</p>
        
        <div className={`text-3xl font-bold mb-2 ${result.color}`}>
          {percentage}%
        </div>
        
        <div className="flex items-center justify-center mb-6">
          <span className="text-2xl mr-2">{result.icon}</span>
          <span className={`text-xl font-semibold ${result.color}`}>
            {result.message}
          </span>
        </div>

        {/* Progress Ring */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="3"/>
            <circle 
              cx="18" cy="18" r="16" 
              fill="none" stroke="#3b82f6" strokeWidth="3"
              strokeDasharray={`${percentage} 100`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={onRestart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Làm lại
          </button>
          <button 
            onClick={onBack}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Quay lại danh sách
          </button>
          <button 
            onClick={onHome}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;