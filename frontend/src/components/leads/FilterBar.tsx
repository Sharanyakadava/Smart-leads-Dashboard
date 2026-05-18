import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { LeadFilters, LeadSource, LeadStatus, SortOrder } from '../../types';

interface FilterBarProps {
  filters: LeadFilters;
  onSearchChange: (val: string) => void;
  onFilterChange: (key: keyof LeadFilters, value: string) => void;
  onReset: () => void;
}

const STATUS_OPTIONS = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const SOURCE_OPTIONS = [
  { value: 'Website', label: 'Website' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referral', label: 'Referral' },
];

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest First' },
  { value: 'oldest', label: 'Oldest First' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onSearchChange,
  onFilterChange,
  onReset,
}) => {
  const hasActiveFilters = filters.status || filters.source || filters.search;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <SlidersHorizontal className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</span>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="ml-auto text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Input
          placeholder="Search by name or email..."
          value={filters.search || ''}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
        <Select
          value={filters.status || ''}
          onChange={(e) => onFilterChange('status', e.target.value)}
          options={STATUS_OPTIONS}
          placeholder="All Statuses"
        />
        <Select
          value={filters.source || ''}
          onChange={(e) => onFilterChange('source', e.target.value)}
          options={SOURCE_OPTIONS}
          placeholder="All Sources"
        />
        <Select
          value={filters.sort || 'latest'}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          options={SORT_OPTIONS}
        />
      </div>
    </div>
  );
};
