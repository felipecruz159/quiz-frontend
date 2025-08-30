"use client";

import { useParams } from "next/navigation";
import BackButton from "@/components/BackButton";
import { useEffect, useState } from "react";
import api from "@/services/axios/api";

interface Alternative {
  id: string;
  text: string;
  isCorrect: boolean;
  questionId: string;
}

interface Question {
  id: string;
  type: string;
  question: string;
  quizId: string;
  alternatives: Alternative[];
}

interface Quiz {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}

export default function QuizPage() {
  const params = useParams();
  const quizId = params?.id;  

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quizId) return;
    const fetchQuiz = async () => {
      try {
        const response = await api.get<Quiz>(`/quizzes/${quizId}`);
        setQuiz(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (loading) return <p className="text-center mt-6">Loading quiz...</p>;
  if (!quiz) return <p className="text-center mt-6">Quiz not found.</p>;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <BackButton href="/quizzes" />
      </div>

      <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
      <p className="text-gray-500 mb-6">
        Criado em: {new Date(quiz.createdAt).toLocaleString()}
      </p>

      {quiz.questions.map((q) => (
        <div key={q.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
          <h2 className="font-semibold mb-2">{q.question}</h2>
          <ul className="pl-4 list-disc">
            {q.alternatives.map((alt) => (
              <li
                key={alt.id}
                className={alt.isCorrect ? "text-green-600 font-medium" : ""}
              >
                {alt.text}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
