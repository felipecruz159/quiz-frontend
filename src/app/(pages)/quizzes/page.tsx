"use client"

import BackButton from '@/components/BackButton';
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { IoEyeOutline } from 'react-icons/io5';
import Link from 'next/link';
import api from '@/services/axios/api';

interface Quiz {
  id: string;
  title: string;
  totalQuestions: number;
}

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await api.get<Quiz[]>("/quizzes");
      setQuizzes(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      await api.delete(`/quizzes/${quizId}`);
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <BackButton href="/" />
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Quizzes</h1>
        <Link
          href="/create"
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
        >
          Create Quiz
        </Link>
      </div>

      {loading ? (
        <p>Loading quizzes...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quiz Name</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell className="font-medium">{quiz.title}</TableCell>
                  <TableCell>{quiz.totalQuestions}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/quizzes/${quiz.id}`}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        title="View Details"
                      >
                        <IoEyeOutline className="text-xl" />
                      </Link>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        title="Delete Quiz"
                      >
                        <MdDelete className="text-xl" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No quiz found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
