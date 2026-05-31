import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Github, Mail } from 'lucide-react';

const Login: React.FC = () => {
  const { signInWithGithub, signInWithGoogle } = useAuthStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Finance Tracker
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account to sync your data
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={() => signInWithGithub()}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <Github className="h-5 w-5 text-gray-400 group-hover:text-gray-300" aria-hidden="true" />
            </span>
            Continue with GitHub
          </button>
          
          <button
            onClick={() => signInWithGoogle()}
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-gray-400 group-hover:text-gray-300" aria-hidden="true" />
            </span>
            Continue with Google
          </button>
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
