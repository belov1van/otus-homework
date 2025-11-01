import React from 'react';
import type { GetServerSideProps } from 'next';
import UsersList from '../../components/userManagement/UsersList';
import { usersApi } from '../../api/api';
import { User } from '../../types';

type Props = {
  initialUsers: User[];
};

const UsersPage: React.FC<Props> = ({ initialUsers }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Пользователи</h1>
      <UsersList initialUsers={initialUsers} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const response = await usersApi.getAll();
    return {
      props: {
        initialUsers: response.data,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        initialUsers: [],
      },
    };
  }
};

export default UsersPage;