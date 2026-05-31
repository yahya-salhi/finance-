import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useEffect } from 'react';
import { useIncomeStore } from './store/useIncomeStore';
import { useExpenseStore } from './store/useExpenseStore';
import { usePortfolioStore } from './store/usePortfolioStore';
import { useSettingsStore } from './store/useSettingsStore';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const { user, initialize } = useAuthStore();
  const loadIncome = useIncomeStore((state) => state.load);
  const loadExpenses = useExpenseStore((state) => state.load);
  const loadPortfolio = usePortfolioStore((state) => state.load);
  const loadSettings = useSettingsStore((state) => state.load);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      // Load data only when authenticated
      loadSettings();
      loadIncome();
      loadExpenses();
      loadPortfolio();
    }
  }, [user, loadSettings, loadIncome, loadExpenses, loadPortfolio]);

  return <RouterProvider router={router} />;
}

export default App;
