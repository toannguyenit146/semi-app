import { useState, useEffect } from 'react';
import { questionsAPI } from '../services/api';

export const useQuestions = (topicId) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuestions = async () => {
    if (!topicId) return;
    
    setLoading(true);
    try {
      const response = await questionsAPI.getByTopic(topicId);
      setQuestions(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [topicId]);

  const addQuestion = async (questionData) => {
    try {
      setLoading(true);
      await questionsAPI.create({ ...questionData, topic_id: topicId });
      await fetchQuestions(); // Refresh list
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = async (id, questionData) => {
    try {
      setLoading(true);
      await questionsAPI.update(id, questionData);
      await fetchQuestions(); // Refresh list
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id) => {
    try {
      setLoading(true);
      await questionsAPI.delete(id);
      await fetchQuestions(); // Refresh list
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    questions,
    loading,
    error,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    refetch: fetchQuestions
  };
};

// Custom hook for topics
export const useTopics = (category) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTopics = async () => {
    if (!category) return;
    
    setLoading(true);
    try {
      const { topicsAPI } = await import('../services/api');
      const response = await topicsAPI.getByCategory(category);
      setTopics(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [category]);

  return {
    topics,
    loading,
    error,
    refetch: fetchTopics
  };
};