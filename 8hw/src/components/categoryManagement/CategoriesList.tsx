import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import { categoriesApi } from '../../api/api';
import CategoryForm from './CategoryForm';

const CategoriesList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesApi.getAll();
      setCategories(response.data);
    } catch (err) {
      setError('Не удалось загрузить список категорий');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      try {
        await categoriesApi.delete(id);
        setCategories(categories.filter(category => category.id !== id));
      } catch (err) {
        setError('Не удалось удалить категорию');
        console.error(err);
      }
    }
  };

  const handleFormSuccess = () => {
    fetchCategories();
    setEditingCategoryId(null);
    setIsAddingCategory(false);
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && categories.length === 0) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Управление категориями</h2>
        <button
          onClick={() => setIsAddingCategory(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Добавить категорию
        </button>
      </div>

      {isAddingCategory && (
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium mb-4">Новая категория</h3>
          <CategoryForm onSuccess={handleFormSuccess} />
        </div>
      )}

      <div className="divide-y">
        {categories.length > 0 ? (
          categories.map(category => (
            <div key={category.id} className="p-4">
              {editingCategoryId === category.id ? (
                <div>
                  <h3 className="text-lg font-medium mb-4">Редактировать категорию</h3>
                  <CategoryForm
                    categoryId={category.id}
                    initialData={category}
                    onSuccess={handleFormSuccess}
                  />
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-lg">{category.name}</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => setEditingCategoryId(category.id)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Задачи в категории: {category.problems.length}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            Нет доступных категорий
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesList;