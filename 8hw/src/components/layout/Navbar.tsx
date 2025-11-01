import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar: React.FC = () => {
  const router = useRouter();
  const isActive = (path: string) => router.pathname.startsWith(path);

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold">Интервью Платформа</Link>
          
          <div className="flex space-x-6">
            <Link 
              href="/problems"
              className={isActive('/problems') ? 'font-medium border-b-2 border-white' : 'hover:text-blue-200'}
            >
              Задачи
            </Link>
            <Link 
              href="/users"
              className={isActive('/users') ? 'font-medium border-b-2 border-white' : 'hover:text-blue-200'}
            >
              Пользователи
            </Link>
            <Link 
              href="/tags"
              className={isActive('/tags') ? 'font-medium border-b-2 border-white' : 'hover:text-blue-200'}
            >
              Теги
            </Link>
            <Link 
              href="/categories"
              className={isActive('/categories') ? 'font-medium border-b-2 border-white' : 'hover:text-blue-200'}
            >
              Категории
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;