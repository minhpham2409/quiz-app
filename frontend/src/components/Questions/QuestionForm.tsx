import { useState } from 'react';
import type { QuestionInput, Question } from '../../types';

interface QuestionFormProps {
  onSubmit: (data: QuestionInput) => Promise<void>;
  initialData?: Question;
  onCancel?: () => void;
}

export default function QuestionForm({ onSubmit, initialData, onCancel }: QuestionFormProps) {
  const [formData, setFormData] = useState<QuestionInput>({
    question: initialData?.questionText || '',
    a: initialData?.answerA || '',
    b: initialData?.answerB || '',
    c: initialData?.answerC || '',
    d: initialData?.answerD || '',
    correct: initialData?.correctAnswer || 'A',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      if (!initialData) {
        // Reset form if creating new
        setFormData({
          question: '',
          a: '',
          b: '',
          c: '',
          d: '',
          correct: 'A',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
      <h3 className="text-xl font-bold text-secondary font-display mb-4">
        {initialData ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Câu hỏi
        </label>
        <textarea
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
          rows={3}
          placeholder="Nhập câu hỏi của bạn..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Đáp án A
          </label>
          <input
            type="text"
            value={formData.a}
            onChange={(e) => setFormData({ ...formData, a: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            placeholder="Đáp án A"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Đáp án B
          </label>
          <input
            type="text"
            value={formData.b}
            onChange={(e) => setFormData({ ...formData, b: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            placeholder="Đáp án B"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Đáp án C
          </label>
          <input
            type="text"
            value={formData.c}
            onChange={(e) => setFormData({ ...formData, c: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            placeholder="Đáp án C"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Đáp án D
          </label>
          <input
            type="text"
            value={formData.d}
            onChange={(e) => setFormData({ ...formData, d: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            placeholder="Đáp án D"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Đáp án đúng
        </label>
        <div className="flex space-x-4">
          {(['A', 'B', 'C', 'D'] as const).map((option) => (
            <label key={option} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value={option}
                checked={formData.correct === option}
                onChange={(e) => setFormData({ ...formData, correct: e.target.value as any })}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50"
        >
          {loading ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Thêm câu hỏi'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}
