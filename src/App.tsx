import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useEffect } from 'react';
import { useIncomeStore } from './store/useIncomeStore';
import { useExpenseStore } from './store/useExpenseStore';
import { usePortfolioStore } from './store/usePortfolioStore';

function App() {
  const loadIncome = useIncomeStore((state) => state.load);
  const loadExpenses = useExpenseStore((state) => state.load);
  const loadPortfolio = usePortfolioStore((state) => state.load);

  useEffect(() => {
    // Initial data load
    loadIncome();
    loadExpenses();
    loadPortfolio();
  }, [loadIncome, loadExpenses, loadPortfolio]);

  return <RouterProvider router={router} />;
}

export default App;
