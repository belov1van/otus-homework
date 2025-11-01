import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User } from '../../types';
import { usersApi } from '../../api/api';
import { toast } from 'react-toastify';

const UsersList: React.FC<{ initialUsers?: User[] }> = ({ initialUsers }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newRating, setNewRating] = useState<number>(0);

  useEffect(() => {
    if (initialUsers && initialUsers.length > 0) {
      setUsers(initialUsers);
      setLoading(false);
      return;
    }
    const fetchUsers = async () => {
      try {
        const response = await usersApi.getAll();
        setUsers(response.data);
      } catch (err) {
        setError('Не удалось загрузить список пользователей');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [initialUsers]);
  
  const handleEditRating = (user: User) => {
    setEditingUserId(user.id);
    setNewRating(user.rating);
  };
  
  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRating(Number(e.target.value));
  };
  
  const saveRating = async (userId: string) => {
    try {
      const response = await usersApi.updateRating(userId, newRating);
      setUsers(users.map(user => user.id === userId ? response.data : user));
      setEditingUserId(null);
      toast.success('Рейтинг успешно обновлен');
    } catch (err) {
      toast.error('Не удалось обновить рейтинг');
      console.error(err);
    }
  };
  
  const cancelEditing = () => {
    setEditingUserId(null);
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
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Пользователи</h2>
      </div>
      
      <div className="divide-y">
        {users.length > 0 ? (
          users.map(user => (
            <div key={user.id} className="p-4 hover:bg-gray-50">
              <Link href={`/users/${user.id}`} className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-blue-600">{user.username}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="block text-sm text-gray-500">Рейтинг</span>
                    {editingUserId === user.id ? (
                      <div className="flex items-center mt-1">
                        <input
                          type="number"
                          value={newRating}
                          onChange={handleRatingChange}
                          min="0"
                          max="5000"
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="ml-2 space-x-1">
                          <button
                            onClick={() => saveRating(user.id)}
                            className="px-2 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600"
                          >
                            ✓
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="font-medium">{user.rating}</span>
                        <button
                          onClick={() => handleEditRating(user)}
                          className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md hover:bg-blue-200"
                        >
                          ✎
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="block text-sm text-gray-500">Решено задач</span>
                    <span className="font-medium">{user.solvedProblems.length}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            Нет доступных пользователей
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;