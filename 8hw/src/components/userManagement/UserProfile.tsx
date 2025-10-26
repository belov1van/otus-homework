import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User } from '../../types';
import { usersApi } from '../../api/api';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newRating, setNewRating] = useState<number>(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (id) {
          const response = await usersApi.getById(id);
          setUser(response.data);
          setNewRating(response.data.rating);
        }
      } catch (err) {
        setError('Не удалось загрузить данные пользователя');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRating(Number(e.target.value));
  };

  const saveRating = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await usersApi.updateRating(id, newRating);
      setUser(response.data);
      setIsEditing(false);
    } catch (err) {
      setError('Не удалось обновить рейтинг');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error || 'Пользователь не найден'}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-2xl mx-auto">
        {/* Заголовок профиля */}
        <div className="p-6 bg-blue-500 text-white">
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-blue-100">{user.email}</p>
        </div>

        {/* Информация о пользователе */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Информация о пользователе</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-sm text-gray-500">ID пользователя</span>
                <span className="block font-medium">{user.id}</span>
              </div>
              
              <div>
                <span className="block text-sm text-gray-500">Решено задач</span>
                <span className="block font-medium">{user.solvedProblems.length}</span>
              </div>
              
              <div className="col-span-2">
                <span className="block text-sm text-gray-500">Рейтинг</span>
                {isEditing ? (
                  <div className="flex items-center mt-1">
                    <input
                      type="number"
                      value={newRating}
                      onChange={handleRatingChange}
                      min="0"
                      max="5000"
                      className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="ml-4 space-x-2">
                      <button
                        onClick={saveRating}
                        disabled={loading}
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        Сохранить
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setNewRating(user.rating);
                        }}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="block font-medium">{user.rating}</span>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      Изменить
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Решенные задачи */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Решенные задачи</h2>
            {user.solvedProblems.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {user.solvedProblems.map((problemId) => (
                  <li key={problemId} className="text-gray-700">
                    Задача ID: {problemId}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Пользователь еще не решил ни одной задачи.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;