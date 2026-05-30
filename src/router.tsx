import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Subscriptions from './pages/Subscriptions';
import Portfolio from './pages/Portfolio';
import Assistant from './pages/Assistant';
import Settings from './pages/Settings';

export const router = createBrowserRouter([
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
]);
