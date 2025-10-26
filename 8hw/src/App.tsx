import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Компоненты макета
import Layout from './components/layout/Layout';

// Страницы
import HomePage from './pages/HomePage';
import ProblemsPage from './pages/ProblemsPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import ProblemFormPage from './pages/ProblemFormPage';
import UsersPage from './pages/UsersPage';
import UserProfilePage from './pages/UserProfilePage';
import TagsPage from './pages/TagsPage';
import CategoriesPage from './pages/CategoriesPage';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="problems" element={<ProblemsPage />} />
          <Route path="problems/:id" element={<ProblemDetailPage />} />
          <Route path="problems/new" element={<ProblemFormPage />} />
          <Route path="problems/edit/:id" element={<ProblemFormPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<UserProfilePage />} />
          <Route path="tags" element={<TagsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
