import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { flashcardAPI } from "../../services/api";
import type { Question } from "../../types";

export default function FlashcardMode() {
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlashcards();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Chỉ xử lý khi không focus vào input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case " ": // Space - Lật card
        case "enter": // Enter - Lật card
          e.preventDefault();
          handleFlip();
          break;
        case "arrowleft": // Mũi tên trái - Câu trước
          e.preventDefault();
          handlePrevious();
          break;
        case "arrowright": // Mũi tên phải - Câu tiếp
          e.preventDefault();
          handleNext();
          break;
        case "a": // Phím A - Câu trước (alternative)
          handlePrevious();
          break;
        case "d": // Phím D - Câu tiếp (alternative)
          handleNext();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex, flashcards.length, isFlipped]);

  const loadFlashcards = async () => {
    try {
      const response = await flashcardAPI.getAll();
      setFlashcards(response.data.flashcards);
      if (response.data.flashcards.length === 0) {
        alert("Bạn chưa có câu hỏi nào!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error loading flashcards:", error);
      alert("Lỗi khi tải flashcards!");
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải flashcards...</p>
        </div>
      </div>
    );
  }

  const currentFlashcard = flashcards[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2 text-gray-700 hover:text-primary transition"
          >
            <X className="w-5 h-5" />
            <span>Thoát</span>
          </button>

          <div className="bg-white px-6 py-3 rounded-lg shadow">
            <span className="text-lg font-bold text-primary">
              {currentIndex + 1} / {flashcards.length}
            </span>
          </div>
        </div>

        {/* Keyboard shortcuts hint */}

        {/* Flashcard */}
        <div className="mb-8">
          <div
            className={`flip-card h-96 ${isFlipped ? "flipped" : ""}`}
            onClick={handleFlip}
          >
            <div className="flip-card-inner h-full cursor-pointer">
              {/* Front - Question */}
              <div className="flip-card-front h-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8 h-full flex flex-col justify-center items-center">
                  <div className="text-center">
                    <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                      📚 Câu hỏi
                    </div>
                    <h2 className="text-3xl font-bold text-secondary mb-8 font-display">
                      {currentFlashcard.questionText}
                    </h2>
                    <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="font-semibold text-gray-700">A. </span>
                        <span className="text-gray-600">
                          {currentFlashcard.answerA}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="font-semibold text-gray-700">B. </span>
                        <span className="text-gray-600">
                          {currentFlashcard.answerB}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="font-semibold text-gray-700">C. </span>
                        <span className="text-gray-600">
                          {currentFlashcard.answerC}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <span className="font-semibold text-gray-700">D. </span>
                        <span className="text-gray-600">
                          {currentFlashcard.answerD}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back - Answer */}
              <div className="flip-card-back h-full">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-2xl p-8 h-full flex flex-col justify-center items-center border-4 border-green-500">
                  <div className="text-center">
                    <div className="inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                      ✓ Đáp án đúng
                    </div>
                    <h2 className="text-3xl font-bold text-secondary mb-6 font-display">
                      {currentFlashcard.questionText}
                    </h2>
                    <div className="bg-white rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
                      <div className="text-6xl font-bold text-green-600 mb-4">
                        {currentFlashcard.correctAnswer}
                      </div>
                      <div className="text-2xl text-gray-700 font-medium">
                        {
                          currentFlashcard[
                            `answer${currentFlashcard.correctAnswer}` as keyof Question
                          ] as string
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-white rounded-xl shadow hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Trước</span>
          </button>

          <button
            onClick={handleFlip}
            className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-xl shadow hover:bg-primary/90 transition"
          >
            <RotateCw className="w-5 h-5" />
            <span>Lật card</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === flashcards.length - 1}
            className="flex items-center space-x-2 px-6 py-3 bg-white rounded-xl shadow hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Tiếp</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mt-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
