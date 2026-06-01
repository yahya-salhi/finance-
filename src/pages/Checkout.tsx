import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { CheckCircle2, CreditCard } from 'lucide-react';

const Checkout: React.FC = () => {
  const { user, signOut } = useAuthStore();
  
  // In a real app, this would be an env var
  const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_5kQ9AS8ds1Zo1rg2BIcV200";
  
  // Pass the user ID to Stripe to link the subscription to the user profile
  const paymentUrl = `${STRIPE_PAYMENT_LINK}?client_reference_id=${user?.id}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Finance Tracker Pro
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Activate your monthly subscription to get started
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Plan</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">9.99 TND<span className="text-sm font-normal text-gray-500">/mo</span></span>
            </div>
            
            <ul className="space-y-3">
              {[
                'AI-Powered Financial Insights',
                'Real-time Portfolio Tracking',
                'Unlimited Income & Expense Logs',
                'Cloud Sync & Secure Backup'
              ].map((feature) => (
                <li key={feature} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <a
              href={paymentUrl}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
            >
              Subscribe Now
            </a>
            
            <button
              onClick={() => signOut()}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              Sign in with a different account
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          Secure payment processed by Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  );
};

export default Checkout;
