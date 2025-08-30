import BackButton from '@/components/BackButton';

interface QuizPageProps {
  params: {
    id: string;
  };
}

export default function QuizPage({ params }: QuizPageProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <BackButton href="/quizzes" />
      </div>
      <h1 className="text-3xl font-bold mb-6">Quiz Details</h1>
      <div className="bg-gray-100 p-6 rounded-lg">
        <p className="text-gray-600">Quiz ID: {params.id}</p>
      </div>
    </div>
  );
}