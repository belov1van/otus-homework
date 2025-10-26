import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProblemForm from '../components/problemManagement/ProblemForm';

const ProblemFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/problems');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {id ? 'Редактирование задачи' : 'Создание новой задачи'}
      </h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <ProblemForm problemId={id} onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default ProblemFormPage;