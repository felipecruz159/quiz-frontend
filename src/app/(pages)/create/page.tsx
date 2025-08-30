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

      <h1 className="text-3xl font-bold mb-6">Create New Quiz</h1>
      <div className="max-w-2xl space-y-6">
        <div>
          <label className="block mb-2 font-medium">Quiz Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="border p-4 rounded space-y-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Question {qIndex + 1}</h2>
              <button
                type="button"
                onClick={() => handleRemoveQuestion(qIndex)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>

            <div>
              <label className="block mb-1 font-medium">Question Text</label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Question Type</label>
              <select
                value={q.type}
                onChange={(e) => handleQuestionChange(qIndex, "type", e.target.value)}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="INPUT">Input</option>
                <option value="BOOLEAN">Boolean</option>
                <option value="CHECKBOX">Checkbox</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block mb-1 font-medium">Alternatives</label>
              {q.alternatives.map((alt, aIndex) => (
                <div key={aIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={alt.text}
                    onChange={(e) => handleAlternativeChange(qIndex, aIndex, "text", e.target.value)}
                    className="flex-1 border px-3 py-2 rounded"
                    placeholder="Alternative text"
                  />
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={alt.isCorrect}
                      onChange={(e) => handleAlternativeChange(qIndex, aIndex, "isCorrect", e.target.checked)}
                    />
                    Correct
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveAlternative(qIndex, aIndex)}
                    className="text-red-600 hover:text-red-800"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddAlternative(qIndex)}
                className="text-blue-600 hover:text-blue-800 mt-1"
              >
                + Add Alternative
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddQuestion}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Question
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Create Quiz"}
        </button>
      </div>
    </div>
  );
}
