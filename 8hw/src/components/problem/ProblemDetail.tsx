import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Problem } from '../../types';
import { problemsApi } from '../../api/api';
import CodeEditor from './CodeEditor';

const ProblemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        if (id) {
          const response = await problemsApi.getById(id);
          setProblem(response.data);
        }
      } catch (err) {
        setError('Не удалось загрузить задачу');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error || 'Задача не найдена'}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Заголовок задачи */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{problem.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              problem.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {problem.difficulty === 'easy' ? 'Легкая' :
               problem.difficulty === 'medium' ? 'Средняя' : 'Сложная'}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {problem.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Описание задачи */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-4">Описание</h2>
          <div className="prose max-w-none">
            {problem.description}
          </div>
        </div>

        {/* Примеры */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-4">Примеры</h2>
          <div className="space-y-4">
            {problem.examples.map((example, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md">
                <div className="mb-2">
                  <span className="font-semibold">Пример {index + 1}</span>
                </div>
                <div className="mb-2">
                  <span className="font-medium">Входные данные:</span>
                  <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">{example.input}</pre>
                </div>
                <div className="mb-2">
                  <span className="font-medium">Выходные данные:</span>
                  <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">{example.output}</pre>
                </div>
                {example.explanation && (
                  <div>
                    <span className="font-medium">Пояснение:</span>
                    <div className="mt-1">{example.explanation}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Редактор кода */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Решение</h2>
          <CodeEditor problemId={problem.id} />
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;