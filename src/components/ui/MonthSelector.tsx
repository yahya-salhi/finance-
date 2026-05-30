import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface MonthSelectorProps {
  currentDate: Date;
  onChange: (date: Date) => void;
}

export default function MonthSelector({ currentDate, onChange }: MonthSelectorProps) {
  const handlePrev = () => {
    const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    onChange(nextDate);
  };

  const handleNext = () => {
    const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    onChange(nextDate);
  };

  const handleCurrent = () => {
    onChange(new Date());
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={handlePrev}
          className="p-2 hover:bg-slate-50 text-slate-600 transition-colors border-r border-slate-200"
        >
          <ChevronLeft size={20} />
        </button>
        <div 
          onClick={handleCurrent}
          className="px-4 py-2 font-semibold text-slate-900 min-w-[140px] text-center cursor-pointer hover:bg-slate-50 flex items-center justify-center gap-2"
        >
          <Calendar size={16} className="text-blue-500" />
          {format(currentDate, 'MMMM yyyy')}
        </div>
        <button
          onClick={handleNext}
          className="p-2 hover:bg-slate-50 text-slate-600 transition-colors border-l border-slate-200"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
