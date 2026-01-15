import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Brain, TrendingUp, Plus } from 'lucide-react';
import Header from '../components/Layout/Header';
import QuestionForm from '../components/Questions/QuestionForm';
import QuestionList from '../components/Questions/QuestionList';
import JsonUploader from '../components/Questions/JsonUploader';
import { questionsAPI, practiceAPI } from '../services/api';
import type { Question, QuestionInput, PracticeStats } from '../types';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState<PracticeStats | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [questionsRes, statsRes] = await Promise.all([
        questionsAPI.getAll(),
        practiceAPI.getStats(),
      ]);
      setQuestions(questionsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (data: QuestionInput) => {
    try {
      await questionsAPI.create(data);
      await loadData();
      alert('Thêm câu hỏi thành công!');
    } catch (error) {
      console.error('Error creating question:', error);
      alert('Lỗi khi thêm câu hỏi!');
    }
  };

  const handleUpdateQuestion = async (data: QuestionInput) => {
    if (!editingQuestion) return;
    try {
      await questionsAPI.update(editingQuestion.id, data);
      await loadData();
      setEditingQuestion(null);
      alert('Cập nhật câu hỏi thành công!');
    } catch (error) {
      console.error('Error updating question:', error);
      alert('Lỗi khi cập nhật câu hỏi!');
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      await questionsAPI.delete(id);
      await loadData();
      alert('Xóa câu hỏi thành công!');
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Lỗi khi xóa câu hỏi!');
    }
  };

  const handleBulkUpload = async (data: QuestionInput[]) => {
    try {
      await questionsAPI.bulkCreate(data);
      await loadData();
      alert(`Upload thành công ${data.length} câu hỏi!`);
    } catch (error) {
      console.error('Error uploading questions:', error);
      alert('Lỗi khi upload câu hỏi!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng câu hỏi</p>
                <p className="text-3xl font-bold text-secondary mt-1">
                  {stats?.total || 0}
                </p>
              </div>
              <BookOpen className="w-12 h-12 text-primary opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Đã làm đúng</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {stats?.correct || 0}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Còn lại</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">
                  {stats?.remaining || 0}
                </p>
              </div>
              <Brain className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => navigate('/practice')}
            disabled={!questions.length}
            className="bg-gradient-to-br from-primary to-teal-600 text-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Brain className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2 font-display">Làm bài tập</h3>
            <p className="text-teal-100">Kiểm tra kiến thức với câu hỏi random</p>
          </button>

          <button
            onClick={() => navigate('/flashcard')}
            disabled={!questions.length}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <BookOpen className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2 font-display">Flashcard</h3>
            <p className="text-blue-100">Ôn tập tuần tự từ đầu đến cuối</p>
          </button>
        </div>

        {/* Question Management */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-secondary font-display">
              Quản lý câu hỏi
            </h2>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingQuestion(null);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Thêm câu hỏi</span>
            </button>
          </div>

          {/* Question Form */}
          {(showForm || editingQuestion) && (
            <QuestionForm
              onSubmit={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}
              initialData={editingQuestion || undefined}
              onCancel={() => {
                setShowForm(false);
                setEditingQuestion(null);
              }}
            />
          )}

          {/* JSON Uploader */}
          <JsonUploader onUpload={handleBulkUpload} />

          {/* Question List */}
          <QuestionList
            questions={questions}
            onEdit={(question) => {
              setEditingQuestion(question);
              setShowForm(false);
            }}
            onDelete={handleDeleteQuestion}
          />
        </div>
      </main>
    </div>
  );
}
