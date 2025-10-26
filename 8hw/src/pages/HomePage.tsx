import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Платформа для технических интервью</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Решайте задачи, проходите интервью, оценивайте кандидатов
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Задачи</h2>
            <p className="text-gray-600 mb-6">
              Просматривайте и решайте задачи различной сложности. Отправляйте свои решения и получайте мгновенную обратную связь.
            </p>
            <Link
              to="/problems"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Перейти к задачам
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Управление задачами</h2>
            <p className="text-gray-600 mb-6">
              Создавайте, редактируйте и удаляйте задачи. Добавляйте примеры, устанавливайте уровень сложности и теги.
            </p>
            <Link
              to="/problems/new"
              className="inline-block px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Создать задачу
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Пользователи</h2>
            <p className="text-gray-600 mb-6">
              Просматривайте профили пользователей, отслеживайте их прогресс и редактируйте рейтинг.
            </p>
            <Link
              to="/users"
              className="inline-block px-6 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
            >
              Управление пользователями
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;