import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Subscriptions from './pages/Subscriptions';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import { Loader2 } from 'lucide-react';

// Lazy load heavy routes (bundle-dynamic-imports)
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Assistant = lazy(() => import('./pages/Assistant'));

const LoadingFallback = () => (
  <div className="h-full w-full flex items-center justify-center p-12">
    <div className="animate-spin">
      <Loader2 size={32} className="text-blue-600" />
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/checkout',
    element: <ProtectedRoute allowUnpaid />,
    children: [{ path: '', element: <Checkout /> }],
  },
  {
    path: '/payment-success',
    element: <ProtectedRoute allowUnpaid />,
    children: [{ path: '', element: <PaymentSuccess /> }],
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
          { 
            path: '/portfolio', 
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <Portfolio />
              </Suspense>
            ) 
          },
          { 
            path: '/assistant', 
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <Assistant />
              </Suspense>
            ) 
          },
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
