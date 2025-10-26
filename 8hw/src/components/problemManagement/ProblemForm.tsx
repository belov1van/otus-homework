import React, { useState, useEffect } from 'react';
import { Problem, Example, Tag } from '../../types';
import { problemsApi, tagsApi } from '../../api/api';

interface ProblemFormProps {
  problemId?: string;
  onSuccess: () => void;
}

const ProblemForm: React.FC<ProblemFormProps> = ({ problemId, onSuccess }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    tags: string[];
    examples: Example[];
  }>({
    title: '',
    description: '',
    difficulty: 'medium',
    tags: [],
    examples: [{ input: '', output: '', explanation: '' }],
  });

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await tagsApi.getAll();
        setTags(response.data);
      } catch (err) {
        console.error('Ошибка при загрузке тегов:', err);
      }
    };

    fetchTags();

    if (problemId) {
      const fetchProblem = async () => {
        try {
          setLoading(true);
          const response = await problemsApi.getById(problemId);
          const problem = response.data;
          setFormData({
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            tags: problem.tags,
            examples: problem.examples.length > 0 ? problem.examples : [{ input: '', output: '', explanation: '' }],
          });
        } catch (err) {
          setError('Не удалось загрузить задачу');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchProblem();
    }
  }, [problemId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (tagId: string) => {
    setFormData(prev => {
      const tag = tags.find(t => t.id === tagId)?.name || '';
      if (prev.tags.includes(tag)) {
        return { ...prev, tags: prev.tags.filter(t => t !== tag) };
      } else {
        return { ...prev, tags: [...prev.tags, tag] };
      }
    });
  };

  const handleExampleChange = (index: number, field: keyof Example, value: string) => {
    setFormData(prev => {
      const newExamples = [...prev.examples];
      newExamples[index] = { ...newExamples[index], [field]: value };
      return { ...prev, examples: newExamples };
    });
  };

  const addExample = () => {
    setFormData(prev => ({
      ...prev,
      examples: [...prev.examples, { input: '', output: '', explanation: '' }],
    }));
  };

  const removeExample = (index: number) => {
    if (formData.examples.length > 1) {
      setFormData(prev => {
        const newExamples = [...prev.examples];
        newExamples.splice(index, 1);
        return { ...prev, examples: newExamples };
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (problemId) {
        await problemsApi.update(problemId, formData);
      } else {
        await problemsApi.create(formData);
      }
      onSuccess();
    } catch (err) {
      setError('Не удалось сохранить задачу');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && problemId) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Название задачи
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Описание задачи
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
          Сложность
        </label>
        <select
          id="difficulty"
          name="difficulty"
          value={formData.difficulty}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="easy">Легкая</option>
          <option value="medium">Средняя</option>
          <option value="hard">Сложная</option>
        </select>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700 mb-2">Теги</span>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <label key={tag.id} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={formData.tags.includes(tag.name)}
                onChange={() => handleTagChange(tag.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{tag.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="block text-sm font-medium text-gray-700">Примеры</span>
          <button
            type="button"
            onClick={addExample}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
          >
            Добавить пример
          </button>
        </div>

        <div className="space-y-4">
          {formData.examples.map((example, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">Пример {index + 1}</h3>
                {formData.examples.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExample(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Удалить
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor={`input-${index}`} className="block text-sm text-gray-700 mb-1">
                    Входные данные
                  </label>
                  <textarea
                    id={`input-${index}`}
                    value={example.input}
                    onChange={(e) => handleExampleChange(index, 'input', e.target.value)}
                    required
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor={`output-${index}`} className="block text-sm text-gray-700 mb-1">
                    Выходные данные
                  </label>
                  <textarea
                    id={`output-${index}`}
                    value={example.output}
                    onChange={(e) => handleExampleChange(index, 'output', e.target.value)}
                    required
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor={`explanation-${index}`} className="block text-sm text-gray-700 mb-1">
                    Пояснение (необязательно)
                  </label>
                  <textarea
                    id={`explanation-${index}`}
                    value={example.explanation || ''}
                    onChange={(e) => handleExampleChange(index, 'explanation', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded-md ${loading ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          {loading ? 'Сохранение...' : problemId ? 'Обновить задачу' : 'Создать задачу'}
        </button>
      </div>
    </form>
  );
};

export default ProblemForm;