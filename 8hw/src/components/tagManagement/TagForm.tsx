import React, { useState } from 'react';
import { Tag } from '../../types';
import { tagsApi } from '../../api/api';

interface TagFormProps {
  tagId?: string;
  initialData?: Tag;
  onSuccess: () => void;
}

const TagForm: React.FC<TagFormProps> = ({ tagId, initialData, onSuccess }) => {
  const [name, setName] = useState<string>(initialData?.name || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (tagId) {
        await tagsApi.update(tagId, { name });
      } else {
        await tagsApi.create({ name });
      }
      onSuccess();
    } catch (err) {
      setError('Не удалось сохранить тег');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Название тега
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

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded-md ${loading ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          {loading ? 'Сохранение...' : tagId ? 'Обновить тег' : 'Создать тег'}
        </button>
      </div>
    </form>
  );
};

export default TagForm;