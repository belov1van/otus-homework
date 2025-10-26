import React from 'react';
import ProblemsList from '../components/problem/ProblemsList';

const ProblemsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Задачи</h1>
      <ProblemsList />
    </div>
  );
};

export default ProblemsPage;