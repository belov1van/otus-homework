import React from 'react';
import type { GetServerSideProps } from 'next';
import TagsList from '../../components/tagManagement/TagsList';
import { tagsApi } from '../../api/api';
import { Tag } from '../../types';

type Props = {
  initialTags: Tag[];
};

const TagsPage: React.FC<Props> = ({ initialTags }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Управление тегами</h1>
      <TagsList initialTags={initialTags} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const response = await tagsApi.getAll();
    return {
      props: {
        initialTags: response.data,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        initialTags: [],
      },
    };
  }
};

export default TagsPage;