import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Subscriptions from './pages/Subscriptions';
import Portfolio from './pages/Portfolio';
import Assistant from './pages/Assistant';
import Settings from './pages/Settings';
import Login from './pages/Login';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          { path: '/', element: <Dashboard /> },
          { path: '/income', element: <Income /> },
          { path: '/expenses', element: <Expenses /> },
          { path: '/subscriptions', element: <Subscriptions /> },
          { path: '/portfolio', element: <Portfolio /> },
          { path: '/assistant', element: <Assistant /> },
          { path: '/settings', element: <Settings /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
