import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Problem, Tag } from '../../types';
import { problemsApi, tagsApi } from '../../api/api';
import { toast } from 'react-toastify';

const ProblemsList: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editingProblemId, setEditingProblemId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemsResponse, tagsResponse] = await Promise.all([
          problemsApi.getAll(),
          tagsApi.getAll()
        ]);
        setProblems(problemsResponse.data);
        setTags(tagsResponse.data);
      } catch (err) {
        setError('Не удалось загрузить данные');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      try {
        await problemsApi.delete(id);
        setProblems(prev => prev.filter(problem => problem.id !== id));
        toast.success('Задача успешно удалена');
      } catch (err) {
        setError('Не удалось удалить задачу');
        console.error(err);
        toast.error('Не удалось удалить задачу');
      }
    }
  };

  const handleEditTags = (problemId: string) => {
    setEditingProblemId(problemId);
    setSelectedTag('');
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTag(e.target.value);
  };

  const handleAddTag = async (problemId: string) => {
    if (!selectedTag) return;
    
    try {
      const problem = problems.find(p => p.id === problemId);
      if (!problem) return;
      
      // Проверяем, есть ли уже такой тег у задачи
      if (problem.tags.includes(selectedTag)) {
        toast.info('Этот тег уже добавлен к задаче');
        return;
      }
      
      const updatedTags = [...problem.tags, selectedTag];
      await problemsApi.update(problemId, { tags: updatedTags });
      
      // Обновляем локальное состояние
      setProblems(prev => prev.map(p => 
        p.id === problemId ? { ...p, tags: updatedTags } : p
      ));
      
      toast.success('Тег успешно добавлен');
      setSelectedTag('');
    } catch (err) {
      console.error(err);
      toast.error('Не удалось добавить тег');
    }
  };

  const handleRemoveTag = async (problemId: string, tagToRemove: string) => {
    try {
      const problem = problems.find(p => p.id === problemId);
      if (!problem) return;
      
      const updatedTags = problem.tags.filter(tag => tag !== tagToRemove);
      await problemsApi.update(problemId, { tags: updatedTags });
      
      // Обновляем локальное состояние
      setProblems(prev => prev.map(p => 
        p.id === problemId ? { ...p, tags: updatedTags } : p
      ));
      
      toast.success('Тег успешно удален');
    } catch (err) {
      console.error(err);
      toast.error('Не удалось удалить тег');
    }
  };

  const handleCancelEditTags = () => {
    setEditingProblemId(null);
    setSelectedTag('');
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
                    {editingProblemId === problem.id ? (
                      <div className="flex flex-col space-y-2">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {problem.tags.map((tag, index) => (
                            <div key={index} className="flex items-center px-2 py-1 text-xs bg-gray-100 rounded">
                              <span>{tag}</span>
                              <button 
                                onClick={() => handleRemoveTag(problem.id, tag)}
                                className="ml-1 text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <select
                            value={selectedTag}
                            onChange={handleTagChange}
                            className="text-sm border rounded p-1"
                          >
                            <option value="">Выберите тег</option>
                            {tags.map(tag => (
                              <option key={tag.id} value={tag.name}>{tag.name}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleAddTag(problem.id)}
                            disabled={!selectedTag}
                            className="px-2 py-1 text-xs bg-green-500 text-white rounded disabled:bg-gray-300"
                          >
                            Добавить
                          </button>
                          <button
                            onClick={handleCancelEditTags}
                            className="px-2 py-1 text-xs bg-gray-500 text-white rounded"
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1 items-center">
                        {problem.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 rounded">
                            {tag}
                          </span>
                        ))}
                        <button
                          onClick={() => handleEditTags(problem.id)}
                          className="ml-2 text-xs text-blue-500 hover:text-blue-700"
                        >
                          Изменить
                        </button>
                      </div>
                    )}
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