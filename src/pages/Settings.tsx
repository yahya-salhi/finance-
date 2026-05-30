import { useState } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { Eye, EyeOff, Save, Trash2, CheckCircle2 } from 'lucide-react';

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

  const [geminiKey, setLocalGeminiKey] = useState(geminiApiKey);
  const [alphaKey, setLocalAlphaKey] = useState(alphaVantageApiKey);
  const [showGemini, setShowGemini] = useState(false);
  const [showAlpha, setShowAlpha] = useState(false);
  const [saved, setSaved] = useState(false);

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
