import React, { useState, useEffect } from 'react';
import { Category, Problem } from '../../types';
import { categoriesApi, problemsApi } from '../../api/api';

interface CategoryFormProps {
  categoryId?: string;
  initialData?: Category;
  onSuccess: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ categoryId, initialData, onSuccess }) => {
  const [name, setName] = useState<string>(initialData?.name || '');
  const [selectedProblems, setSelectedProblems] = useState<string[]>(initialData?.problems || []);
  const [availableProblems, setAvailableProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await problemsApi.getAll();
        setAvailableProblems(response.data);
      } catch (err) {
        console.error('Ошибка при загрузке задач:', err);
      }
    };

    fetchProblems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const categoryData = { name, problems: selectedProblems };
      
      if (categoryId) {
        await categoriesApi.update(categoryId, categoryData);
      } else {
        await categoriesApi.create(categoryData);
      }
      onSuccess();
    } catch (err) {
      setError('Не удалось сохранить категорию');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProblemToggle = (problemId: string) => {
    setSelectedProblems(prev => {
      if (prev.includes(problemId)) {
        return prev.filter(id => id !== problemId);
      } else {
        return [...prev, problemId];
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Название категории
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700 mb-2">Задачи в категории</span>
        <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
          {availableProblems.length > 0 ? (
            availableProblems.map(problem => (
              <label key={problem.id} className="flex items-center p-2 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedProblems.includes(problem.id)}
                  onChange={() => handleProblemToggle(problem.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2">{problem.title}</span>
                <span className="ml-2 text-xs text-gray-500">
                  ({problem.difficulty === 'easy' ? 'Легкая' :
                    problem.difficulty === 'medium' ? 'Средняя' : 'Сложная'})
                </span>
              </label>
            ))
          ) : (
            <div className="p-2 text-gray-500">Нет доступных задач</div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded-md ${loading ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          {loading ? 'Сохранение...' : categoryId ? 'Обновить категорию' : 'Создать категорию'}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;