import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, RotateCcw, TrendingUp } from "lucide-react";
import { practiceAPI } from "../../services/api";
import type {
  Question,
  SubmitAnswerResponse,
  PracticeStats,
} from "../../types";

export default function PracticeMode() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<
    "A" | "B" | "C" | "D" | null
  >(null);
  const [feedback, setFeedback] = useState<SubmitAnswerResponse | null>(null);
  const [stats, setStats] = useState<PracticeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [shake, setShake] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    loadStats();
    loadNextQuestion();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Không xử lý khi focus vào input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Không xử lý khi modal completion đang hiện
      if (showCompletionModal) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "enter": // Enter - Submit hoặc Next
          e.preventDefault();
          if (feedback) {
            // Đã có feedback → Chuyển câu tiếp
            loadNextQuestion();
          } else if (selectedAnswer) {
            // Chưa submit → Submit đáp án
            handleSubmit();
          }
          break;
        case "a": // A - Chọn đáp án A
          if (!feedback) setSelectedAnswer("A");
          break;
        case "b": // B - Chọn đáp án B
          if (!feedback) setSelectedAnswer("B");
          break;
        case "c": // C - Chọn đáp án C
          if (!feedback) setSelectedAnswer("C");
          break;
        case "d": // D - Chọn đáp án D
          if (!feedback) setSelectedAnswer("D");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedAnswer, feedback, showCompletionModal, currentQuestion]);

  const loadStats = async () => {
    try {
      const response = await practiceAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadNextQuestion = async () => {
    setLoading(true);
    setSelectedAnswer(null);
    setFeedback(null);

    try {
      const response = await practiceAPI.getNext();
      if (response.data.question) {
        setCurrentQuestion(response.data.question);
      } else {
        // No more questions - show completion modal
        setShowCompletionModal(true);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error loading question:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswer || !currentQuestion) return;

    try {
      const response = await practiceAPI.submit({
        questionId: currentQuestion.id,
        answer: selectedAnswer,
      });
      setFeedback(response.data);

      if (!response.data.isCorrect) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }

      await loadStats();
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        "Bạn có chắc muốn làm lại tất cả? Tiến độ hiện tại sẽ bị xóa."
      )
    ) {
      return;
    }

    try {
      await practiceAPI.reset();
      setShowCompletionModal(false);
      await loadStats();
      await loadNextQuestion();
      alert("Đã reset thành công! Bắt đầu làm lại từ đầu.");
    } catch (error) {
      console.error("Error resetting:", error);
      alert("Lỗi khi reset!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2 text-gray-700 hover:text-primary transition"
          >
            <X className="w-5 h-5" />
            <span>Thoát</span>
          </button>

          <div className="flex items-center space-x-4">
            {stats && (
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="font-medium text-gray-700">
                  {stats.remaining} câu còn lại
                </span>
              </div>
            )}
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-50 transition"
              title="Làm lại tất cả"
            >
              <RotateCcw className="w-5 h-5 text-gray-700" />
              <span>Làm lại</span>
            </button>
          </div>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mb-4 bg-white/80 backdrop-blur rounded-lg px-4 py-3 shadow-sm">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 font-mono text-xs">
                A/B/C/D
              </kbd>
              <span>Chọn đáp án</span>
            </div>
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 font-mono text-xs">
                Enter
              </kbd>
              <span>Xác nhận</span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <div
            className={`bg-white rounded-2xl shadow-xl p-8 ${
              shake ? "shake" : ""
            }`}
          >
            <h2 className="text-2xl font-bold text-secondary mb-6 font-display">
              {currentQuestion.questionText}
            </h2>

            <div className="space-y-3 mb-6">
              {(["A", "B", "C", "D"] as const).map((option) => {
                const answerKey = `answer${option}` as keyof Question;
                const isSelected = selectedAnswer === option;
                const isCorrect = feedback?.correctAnswer === option;
                const showCorrect = feedback && isCorrect;
                const showWrong = feedback && isSelected && !feedback.isCorrect;

                return (
                  <button
                    key={option}
                    onClick={() => !feedback && setSelectedAnswer(option)}
                    disabled={!!feedback}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      showCorrect
                        ? "border-green-500 bg-green-50"
                        : showWrong
                        ? "border-red-500 bg-red-50"
                        : isSelected
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                    } ${feedback ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                          showCorrect
                            ? "bg-green-500 text-white"
                            : showWrong
                            ? "bg-red-500 text-white"
                            : isSelected
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {option}
                      </span>
                      <span className="text-gray-700 flex-1">
                        {currentQuestion[answerKey] as string}
                      </span>
                      {showCorrect && (
                        <span className="text-green-600 font-medium">
                          ✓ Đúng
                        </span>
                      )}
                      {showWrong && (
                        <span className="text-red-600 font-medium">✗ Sai</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {feedback && (
              <div
                className={`p-4 rounded-lg mb-6 ${
                  feedback.isCorrect
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <p className="font-medium mb-1">
                  {feedback.isCorrect ? "✓ Chính xác!" : "✗ Sai rồi!"}
                </p>
                <p>{feedback.explanation}</p>
                {!feedback.isCorrect && (
                  <p className="mt-2 text-sm">
                    Số lần sai: {feedback.incorrectCount}
                  </p>
                )}
              </div>
            )}

            {/* Action Button */}
            {!feedback ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="w-full bg-primary text-white py-4 rounded-xl font-medium text-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Xác nhận{" "}
                {selectedAnswer && (
                  <span className="text-sm opacity-80">(Enter)</span>
                )}
              </button>
            ) : (
              <button
                onClick={loadNextQuestion}
                className="w-full bg-primary text-white py-4 rounded-xl font-medium text-lg hover:bg-primary/90 transition"
              >
                Câu tiếp theo{" "}
                <span className="text-sm opacity-80">(Enter)</span> →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-[scale-in_0.3s_ease-out]">
            <div className="text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-secondary mb-3 font-display">
                🎉 Hoàn thành!
              </h2>

              {/* Message */}
              <p className="text-gray-600 mb-6">
                Chúc mừng! Bạn đã làm đúng tất cả các câu hỏi.
              </p>

              {/* Stats */}
              {stats && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {stats.correct}
                      </div>
                      <div className="text-sm text-gray-600">Câu đúng</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        {stats.totalIncorrectAttempts}
                      </div>
                      <div className="text-sm text-gray-600">Lần sai</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleReset}
                  className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 transition flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Làm lại từ đầu</span>
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition"
                >
                  Về Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
