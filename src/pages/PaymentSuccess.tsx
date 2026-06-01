import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../store/useSettingsStore';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const loadSettings = useSettingsStore((state) => state.load);

  useEffect(() => {
    // Refresh settings to get the new subscription status
    const timer = setTimeout(() => {
      loadSettings();
    }, 2000); // Give the webhook a moment to process

    return () => clearTimeout(timer);
  }, [loadSettings]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center space-y-6 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Payment Successful!
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400">
          Thank you for subscribing to Finance Tracker Pro. Your account is being activated.
        </p>

        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Go to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
