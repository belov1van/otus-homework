import React, { useState, useEffect } from 'react';
import { Tag } from '../../types';
import { tagsApi } from '../../api/api';
import TagForm from './TagForm';

const TagsList: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [isAddingTag, setIsAddingTag] = useState<boolean>(false);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await tagsApi.getAll();
      setTags(response.data);
    } catch (err) {
      setError('Не удалось загрузить список тегов');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleDeleteTag = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот тег?')) {
      try {
        await tagsApi.delete(id);
        setTags(tags.filter(tag => tag.id !== id));
      } catch (err) {
        setError('Не удалось удалить тег');
        console.error(err);
      }
    }
  };

  const handleFormSuccess = () => {
    fetchTags();
    setEditingTagId(null);
    setIsAddingTag(false);
  };

  if (loading && tags.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && tags.length === 0) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Управление тегами</h2>
        <button
          onClick={() => setIsAddingTag(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Добавить тег
        </button>
      </div>

      {isAddingTag && (
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium mb-4">Новый тег</h3>
          <TagForm onSuccess={handleFormSuccess} />
        </div>
      )}

      <div className="divide-y">
        {tags.length > 0 ? (
          tags.map(tag => (
            <div key={tag.id} className="p-4">
              {editingTagId === tag.id ? (
                <div>
                  <h3 className="text-lg font-medium mb-4">Редактировать тег</h3>
                  <TagForm
                    tagId={tag.id}
                    initialData={tag}
                    onSuccess={handleFormSuccess}
                  />
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="font-medium">{tag.name}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => setEditingTagId(tag.id)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            Нет доступных тегов
          </div>
        )}
      </div>
    </div>
  );
};

export default TagsList;