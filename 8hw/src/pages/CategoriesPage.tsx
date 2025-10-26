import React from 'react';
import CategoriesList from '../components/categoryManagement/CategoriesList';

const CategoriesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Управление категориями</h1>
      <CategoriesList />
    </div>
  );
};

export default CategoriesPage;