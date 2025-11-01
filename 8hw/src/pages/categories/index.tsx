import React from 'react';
import type { GetServerSideProps } from 'next';
import CategoriesList from '../../components/categoryManagement/CategoriesList';
import { categoriesApi } from '../../api/api';
import { Category } from '../../types';

type Props = {
  initialCategories: Category[];
};

const CategoriesPage: React.FC<Props> = ({ initialCategories }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Управление категориями</h1>
      <CategoriesList initialCategories={initialCategories} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const response = await categoriesApi.getAll();
    return {
      props: {
        initialCategories: response.data,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        initialCategories: [],
      },
    };
  }
};

export default CategoriesPage;