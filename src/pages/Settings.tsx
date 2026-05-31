import { useState, useEffect } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { Eye, EyeOff, Save, Trash2, CheckCircle2, CloudUpload, Loader2 } from 'lucide-react';
import { checkLocalDataExists, migrateDexieToSupabase } from '../utils/migration';
import { useIncomeStore } from '../store/useIncomeStore';
import { useExpenseStore } from '../store/useExpenseStore';
import { usePortfolioStore } from '../store/usePortfolioStore';

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'TND', symbol: 'DT' },
  { code: 'JPY', symbol: '¥' },
  { code: 'SAR', symbol: 'SR' },
];

export default function Settings() {
  const { 
    geminiApiKey, 
    alphaVantageApiKey, 
    currency, 
    setGeminiKey, 
    setAlphaVantageKey, 
    setCurrency 
  } = useSettingsStore();

  const loadIncome = useIncomeStore(s => s.load);
  const loadExpenses = useExpenseStore(s => s.load);
  const loadPortfolio = usePortfolioStore(s => s.load);

  const [geminiKey, setLocalGeminiKey] = useState(geminiApiKey);
  const [alphaKey, setLocalAlphaKey] = useState(alphaVantageApiKey);
  const [showGemini, setShowGemini] = useState(false);
  const [showAlpha, setShowAlpha] = useState(false);
  const [saved, setSaved] = useState(false);

  // Migration state
  const [localDataExists, setLocalDataExists] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{ income: number; expenses: number; portfolio: number } | null>(null);

  useEffect(() => {
    checkLocalDataExists().then(setLocalDataExists);
  }, []);

  const handleSaveKeys = () => {
    setGeminiKey(geminiKey);
    setAlphaVantageKey(alphaKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = CURRENCIES.find(c => c.code === e.target.value);
    if (selected) {
      setCurrency(selected.code, selected.symbol);
    }
  };

  const handleMigration = async () => {
    if (!confirm('This will upload all local data to your cloud account. Existing data in the cloud will not be overwritten.')) {
      return;
    }

    setMigrating(true);
    const results = await migrateDexieToSupabase();
    setMigrating(false);
    
    if (results.errors.length > 0) {
      alert('Migration had some errors: \n' + results.errors.join('\n'));
    } else {
      setMigrationResult(results);
      setLocalDataExists(false); // Hide the section after success
      // Reload stores to show new data
      loadIncome();
      loadExpenses();
      loadPortfolio();
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
      indexedDB.deleteDatabase('FinanceTrackerDB');
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Configure your application preferences and API keys.</p>
      </div>

      <div className="grid gap-6">
        {/* Migration Section */}
        {localDataExists && (
          <section className="card p-6 border-blue-100 bg-blue-50/50 space-y-4">
            <div className="flex items-center gap-3">
              <CloudUpload className="text-blue-600 w-6 h-6" />
              <h2 className="text-lg font-semibold text-blue-900">Cloud Migration</h2>
            </div>
            <p className="text-sm text-blue-800">
              We detected data in your local browser storage. Migrate it to your cloud account to access it from any device.
            </p>
            <button
              onClick={handleMigration}
              disabled={migrating}
              className="btn btn-primary flex items-center gap-2"
            >
              {migrating ? <Loader2 className="animate-spin" size={18} /> : <CloudUpload size={18} />}
              {migrating ? 'Migrating...' : 'Migrate Local Data to Cloud'}
            </button>
          </section>
        )}

        {migrationResult && (
          <div className="card p-4 bg-green-50 border-green-200 flex items-start gap-3">
            <CheckCircle2 className="text-green-600 mt-0.5" size={20} />
            <div>
              <h3 className="text-sm font-bold text-green-900">Migration Successful!</h3>
              <p className="text-xs text-green-700">
                Migrated: {migrationResult.income} income, {migrationResult.expenses} expenses, {migrationResult.portfolio} positions.
              </p>
            </div>
          </div>
        )}

        {/* API Keys Section */}
        <section className="card p-6 space-y-6">
          <h2 className="text-lg font-semibold text-slate-800 border-bottom pb-2">API Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="label">Gemini API Key</label>
              <div className="relative">
                <input
                  type={showGemini ? 'text' : 'password'}
                  className="input pr-10"
                  value={geminiKey}
                  onChange={(e) => setLocalGeminiKey(e.target.value)}
                  placeholder="Enter your Google Gemini API key"
                />
                <button
                  type="button"
                  onClick={() => setShowGemini(!showGemini)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showGemini ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Required for the AI Assistant. Get one at <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Google AI Studio</a>.
              </p>
            </div>

            <div>
              <label className="label">Alpha Vantage API Key</label>
              <div className="relative">
                <input
                  type={showAlpha ? 'text' : 'password'}
                  className="input pr-10"
                  value={alphaKey}
                  onChange={(e) => setLocalAlphaKey(e.target.value)}
                  placeholder="Enter your Alpha Vantage API key"
                />
                <button
                  type="button"
                  onClick={() => setShowAlpha(!showAlpha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showAlpha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Required for live stock prices. Get one at <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Alpha Vantage</a>.
              </p>
            </div>

            <button
              onClick={handleSaveKeys}
              className="btn btn-primary w-full flex items-center gap-2"
            >
              {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
              {saved ? 'Keys Saved!' : 'Save API Keys'}
            </button>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="card p-6 space-y-6">
          <h2 className="text-lg font-semibold text-slate-800 border-bottom pb-2">Preferences</h2>
          
          <div>
            <label className="label">Base Currency</label>
            <select
              className="input"
              value={currency}
              onChange={handleCurrencyChange}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="card p-6 border-red-100 bg-red-50/30 space-y-6">
          <h2 className="text-lg font-semibold text-red-800 border-bottom pb-2">Danger Zone</h2>
          
          <div>
            <p className="text-sm text-slate-600 mb-4">
              Clearing all data will permanently delete all your income, expense, and portfolio entries from this browser. This action cannot be undone.
            </p>
            <button
              onClick={handleClearData}
              className="btn bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 size={18} />
              Clear All Data
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
