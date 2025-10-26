import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types';
import { usersApi } from '../../api/api';

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
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
  }, []);

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
              <Link to={`/users/${user.id}`} className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-blue-600">{user.username}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="block text-sm text-gray-500">Рейтинг</span>
                    <span className="font-medium">{user.rating}</span>
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