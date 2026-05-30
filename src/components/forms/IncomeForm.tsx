import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { IncomeEntry } from '../../types';
import { INCOME_CATEGORIES } from '../../utils/categories';

const schema = z.object({
  amount: z.number().positive('Amount must be positive'),
  label: z.string().min(1, 'Label is required'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  recurrence: z.enum(['none', 'weekly', 'monthly', 'annually']),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface IncomeFormProps {
  initialData?: Partial<IncomeEntry>;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

export default function IncomeForm({ initialData, onSubmit, onCancel }: IncomeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: initialData?.amount || 0,
      label: initialData?.label || '',
      category: initialData?.category || 'salary',
      date: initialData?.date || new Date().toISOString().split('T')[0],
      recurrence: initialData?.recurrence || 'none',
      notes: initialData?.notes || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Amount</label>
          <input
            type="number"
            step="0.01"
            className={`input ${errors.amount ? 'border-red-500' : ''}`}
            {...register('amount', { valueAsNumber: true })}
          />
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
        </div>
        <div>
          <label className="label">Date</label>
          <input
            type="date"
            className={`input ${errors.date ? 'border-red-500' : ''}`}
            {...register('date')}
          />
          {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>}
        </div>
      </div>

      <div>
        <label className="label">Label</label>
        <input
          type="text"
          className={`input ${errors.label ? 'border-red-500' : ''}`}
          placeholder="e.g. Monthly Salary"
          {...register('label')}
        />
        {errors.label && <p className="text-xs text-red-500 mt-1">{errors.label.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Category</label>
          <select className="input" {...register('category')}>
            {Object.entries(INCOME_CATEGORIES).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Recurrence</label>
          <select className="input" {...register('recurrence')}>
            <option value="none">None</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="annually">Annually</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">Notes (Optional)</label>
        <textarea
          className="input min-h-[80px]"
          {...register('notes')}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="btn btn-secondary flex-1">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary flex-1">
          {initialData?.id ? 'Update Entry' : 'Add Entry'}
        </button>
      </div>
    </form>
  );
}
