import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Problem } from '../../types';
import { problemsApi } from '../../api/api';

const ProblemsList: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await problemsApi.getAll();
        setProblems(response.data);
      } catch (err) {
        setError('Не удалось загрузить список задач');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      try {
        await problemsApi.delete(id);
        setProblems(prev => prev.filter(problem => problem.id !== id));
      } catch (err) {
        setError('Не удалось удалить задачу');
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Задачи</h2>
        <Link
          to="/problems/new"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Добавить задачу
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Сложность
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Теги
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {problems.length > 0 ? (
              problems.map(problem => (
                <tr key={problem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/problems/${problem.id}`} className="text-blue-600 hover:text-blue-900">
                      {problem.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      problem.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {problem.difficulty === 'easy' ? 'Легкая' :
                       problem.difficulty === 'medium' ? 'Средняя' : 'Сложная'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/problems/edit/${problem.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Редактировать
                    </Link>
                    <button
                      onClick={(e) => handleDelete(problem.id, e)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Нет доступных задач
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemsList;