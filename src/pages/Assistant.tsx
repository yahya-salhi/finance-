import { useState, useRef, useEffect, startTransition } from 'react';
import { useIncomeStore } from '../store/useIncomeStore';
import { useExpenseStore } from '../store/useExpenseStore';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import { askGemini, buildFinancialContext } from '../api/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Assistant() {
  const { entries: income } = useIncomeStore();
  const { entries: expenses } = useExpenseStore();
  const { positions } = usePortfolioStore();
  const { geminiApiKey, currencySymbol } = useSettingsStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!geminiApiKey) {
      setError('Please set your Gemini API key in Settings first.');
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setError(null);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const context = buildFinancialContext(income, expenses, positions, currencySymbol);
      const response = await askGemini(userMessage, context, geminiApiKey, currencySymbol);
      startTransition(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      });
    } catch (err: any) {
      setError(err.message || 'Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">AI Assistant</h1>
        <p className="text-slate-500">Ask questions about your finances, spending habits, or portfolio.</p>
      </div>

      {!geminiApiKey && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-amber-800">API Key Required</h3>
            <p className="text-sm text-amber-700 mt-1">
              To use the AI Assistant, you need to provide a Google Gemini API key in the <a href="/settings" className="font-bold underline">Settings</a> page.
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto card p-4 space-y-4 mb-4 bg-slate-50/30">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="p-4 bg-blue-100 rounded-full text-blue-600 mb-4">
              <Bot size={40} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Your Financial AI</h3>
            <p className="text-slate-500 max-w-sm mt-2">
              Try asking: "How much did I spend on groceries this month?" or "What's my best performing stock?"
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 opacity-70">
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {msg.role === 'user' ? 'You' : 'Assistant'}
                  </span>
                </div>
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading ? (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-4 shadow-sm">
              <div className="animate-spin">
                <Loader2 size={20} className="text-blue-600" />
              </div>
            </div>
          </div>
        ) : null}
        {error ? (
          <div className="flex justify-center">
            <div className="bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-full border border-red-100">
              {error}
            </div>
          </div>
        ) : null}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          className="input pr-12 py-4 shadow-lg border-slate-200 focus:border-blue-500"
          placeholder="Ask me anything about your finances..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!geminiApiKey || isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || !geminiApiKey || isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
