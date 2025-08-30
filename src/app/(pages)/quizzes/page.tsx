import BackButton from '@/components/BackButton';

export default function Quizzes() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <BackButton href="/" />
      </div>
      <h1 className="text-3xl font-bold mb-6">All Quizzes</h1>
      <div className="grid gap-4">
      </div>
    </div>
  );
}
