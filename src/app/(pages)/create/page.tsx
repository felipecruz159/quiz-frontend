/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import BackButton from "@/components/BackButton";
import api from "@/services/axios/api";
import { useRouter } from "next/navigation";

interface Alternative {
  text: string;
  isCorrect: boolean;
}

interface Question {
  type: "INPUT" | "BOOLEAN" | "CHECKBOX";
  question: string;
  alternatives: Alternative[];
}

export default function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { type: "INPUT", question: "", alternatives: [{ text: "", isCorrect: true }] },
  ]);
  const [loading, setLoading] = useState(false);

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { type: "INPUT", question: "", alternatives: [{ text: "", isCorrect: true }] },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updated = [...questions];
    (updated[index] as any)[field] = value;
    setQuestions(updated);
  };

  const handleAddAlternative = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].alternatives.push({ text: "", isCorrect: false });
    setQuestions(updated);
  };

  const handleRemoveAlternative = (qIndex: number, aIndex: number) => {
    const updated = [...questions];
    updated[qIndex].alternatives = updated[qIndex].alternatives.filter((_, i) => i !== aIndex);
    setQuestions(updated);
  };

  const handleAlternativeChange = (qIndex: number, aIndex: number, field: string, value: any) => {
    const updated = [...questions];
    (updated[qIndex].alternatives[aIndex] as any)[field] = value;
    setQuestions(updated);
  };

  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post("/quizzes", { title, questions });
      setTitle("");
      setQuestions([{ type: "INPUT", question: "", alternatives: [{ text: "", isCorrect: true }] }]);
      router.push("/quizzes");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <BackButton href="/" />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Quiz</h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <label className="block mb-2 font-medium text-gray-700">Quiz Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter quiz title..."
          />
        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Question {qIndex + 1}</h2>
              <button
                type="button"
                onClick={() => handleRemoveQuestion(qIndex)}
                className="px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                Remove Question
              </button>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Question Text</label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your question..."
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Question Type</label>
              <select
                value={q.type}
                onChange={(e) => handleQuestionChange(qIndex, "type", e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="INPUT">Input</option>
                <option value="BOOLEAN">Boolean</option>
                <option value="CHECKBOX">Checkbox</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="block mb-2 font-medium text-gray-700">Alternatives</label>
              {q.alternatives.map((alt, aIndex) => (
                <div key={aIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={alt.text}
                    onChange={(e) => handleAlternativeChange(qIndex, aIndex, "text", e.target.value)}
                    className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Alternative text..."
                  />
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={alt.isCorrect}
                      onChange={(e) => handleAlternativeChange(qIndex, aIndex, "isCorrect", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    Correct
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveAlternative(qIndex, aIndex)}
                    className="px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddAlternative(qIndex)}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors font-medium"
              >
                + Add Alternative
              </button>
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleAddQuestion}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Question
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg transition-colors font-medium inline-flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Create Quiz
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
