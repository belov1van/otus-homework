import React from 'react';
import TagsList from '../components/tagManagement/TagsList';

const TagsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Управление тегами</h1>
      <TagsList />
    </div>
  );
};

export default TagsPage;