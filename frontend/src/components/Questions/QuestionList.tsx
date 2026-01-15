import { Edit2, Trash2 } from 'lucide-react';
import type { Question } from '../../types';

interface QuestionListProps {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
}

export default function QuestionList({ questions, onEdit, onDelete }: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-500">Chưa có câu hỏi nào. Hãy thêm câu hỏi mới!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md divide-y divide-gray-200">
      {questions.map((question, index) => (
        <div key={question.id} className="p-6 hover:bg-gray-50 transition">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full font-semibold text-sm">
                  {index + 1}
                </span>
                <h4 className="text-lg font-medium text-secondary">
                  {question.questionText}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3 ml-11">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded ${
                    question.correctAnswer === 'A' 
                      ? 'bg-green-100 text-green-700 font-medium' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    A
                  </span>
                  <span className="text-gray-700">{question.answerA}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded ${
                    question.correctAnswer === 'B' 
                      ? 'bg-green-100 text-green-700 font-medium' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    B
                  </span>
                  <span className="text-gray-700">{question.answerB}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded ${
                    question.correctAnswer === 'C' 
                      ? 'bg-green-100 text-green-700 font-medium' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    C
                  </span>
                  <span className="text-gray-700">{question.answerC}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded ${
                    question.correctAnswer === 'D' 
                      ? 'bg-green-100 text-green-700 font-medium' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    D
                  </span>
                  <span className="text-gray-700">{question.answerD}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => onEdit(question)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Sửa"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
                    onDelete(question.id);
                  }
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Xóa"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
