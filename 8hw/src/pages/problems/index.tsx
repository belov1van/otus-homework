import React from 'react';
import type { GetServerSideProps } from 'next';
import ProblemsList from '../../components/problem/ProblemsList';
import { problemsApi, tagsApi } from '../../api/api';
import { Problem, Tag } from '../../types';

type Props = {
  initialProblems: Problem[];
  initialTags: Tag[];
};

const ProblemsPage: React.FC<Props> = ({ initialProblems, initialTags }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Задачи</h1>
      <ProblemsList initialProblems={initialProblems} initialTags={initialTags} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const [problemsResponse, tagsResponse] = await Promise.all([
      problemsApi.getAll(),
      tagsApi.getAll(),
    ]);

    return {
      props: {
        initialProblems: problemsResponse.data,
        initialTags: tagsResponse.data,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        initialProblems: [],
        initialTags: [],
      },
    };
  }
};

export default ProblemsPage;