import { useState, useRef } from 'react';
import { Upload, FileJson } from 'lucide-react';
import type { QuestionInput } from '../../types';

interface JsonUploaderProps {
  onUpload: (questions: QuestionInput[]) => Promise<void>;
}

export default function JsonUploader({ onUpload }: JsonUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setLoading(true);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Validate format
      if (!Array.isArray(data)) {
        throw new Error('File phải chứa một mảng câu hỏi');
      }

      // Validate each question
      data.forEach((q: any, index: number) => {
        if (!q.question || !q.a || !q.b || !q.c || !q.d || !q.correct) {
          throw new Error(`Câu hỏi ${index + 1} thiếu thông tin`);
        }
        if (!['A', 'B', 'C', 'D'].includes(q.correct)) {
          throw new Error(`Câu hỏi ${index + 1} có đáp án đúng không hợp lệ`);
        }
      });

      await onUpload(data);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi đọc file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center space-x-3 mb-4">
        <FileJson className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold text-secondary font-display">
          Upload JSON
        </h3>
      </div>

      <p className="text-gray-600 mb-4">
        Upload file JSON chứa danh sách câu hỏi. Format:
      </p>

      <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto mb-4">
{`[
  {
    "question": "Câu hỏi?",
    "a": "Đáp án A",
    "b": "Đáp án B",
    "c": "Đáp án C",
    "d": "Đáp án D",
    "correct": "A"
  }
]`}
      </pre>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <label className="flex items-center justify-center space-x-3 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary hover:bg-primary/5 transition">
        <Upload className="w-6 h-6 text-gray-400" />
        <span className="text-gray-600 font-medium">
          {loading ? 'Đang upload...' : 'Chọn file JSON'}
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          disabled={loading}
          className="hidden"
        />
      </label>
    </div>
  );
}
