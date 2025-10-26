import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">Интервью Платформа</Link>
          
          <div className="flex space-x-6">
            <NavLink 
              to="/problems" 
              className={({ isActive }) => 
                isActive ? 'font-medium border-b-2 border-white' : 'hover:text-blue-200'
              }
            >
              Задачи
            </NavLink>
            <NavLink 
              to="/users" 
              className={({ isActive }) => 
                isActive ? 'font-medium border-b-2 border-white' : 'hover:text-blue-200'
              }
            >
              Пользователи
            </NavLink>
            <NavLink 
              to="/tags" 
              className={({ isActive }) => 
                isActive ? 'font-medium border-b-2 border-white' : 'hover:text-blue-200'
              }
            >
              Теги
            </NavLink>
            <NavLink 
              to="/categories" 
              className={({ isActive }) => 
                isActive ? 'font-medium border-b-2 border-white' : 'hover:text-blue-200'
              }
            >
              Категории
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;