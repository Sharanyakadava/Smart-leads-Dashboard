import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Lead, LeadFormData, LeadSource, LeadStatus } from '../../types';

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const SOURCE_OPTIONS: { value: LeadSource; label: string }[] = [
  { value: 'Website', label: 'Website' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referral', label: 'Referral' },
];

interface LeadFormProps {
  initialData?: Partial<Lead>;
  onSubmit: (data: LeadFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditMode?: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  source?: string;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  isEditMode,
}) => {
  const [form, setForm] = useState<LeadFormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    status: initialData?.status || 'New',
    source: initialData?.source || 'Website',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim() || form.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!form.source) {
      newErrors.source = 'Source is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        error={errors.name}
        placeholder="John Doe"
        disabled={isLoading}
      />
      <Input
        label="Email Address"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        error={errors.email}
        placeholder="john@example.com"
        disabled={isLoading}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })}
          options={STATUS_OPTIONS}
          disabled={isLoading}
        />
        <Select
          label="Source"
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })}
          options={SOURCE_OPTIONS}
          error={errors.source}
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes (optional)
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={3}
          maxLength={500}
          placeholder="Add any relevant notes..."
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-colors"
        />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEditMode ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};
