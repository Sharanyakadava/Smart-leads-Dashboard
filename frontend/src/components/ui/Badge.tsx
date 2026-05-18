import React from 'react';
import { clsx } from 'clsx';
import { LeadStatus, LeadSource } from '../../types';

const statusColors: Record<LeadStatus, string> = {
  New: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Contacted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Qualified: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Lost: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const sourceColors: Record<LeadSource, string> = {
  Website: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Instagram: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  Referral: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

interface StatusBadgeProps {
  status: LeadStatus;
}

interface SourceBadgeProps {
  source: LeadSource;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-medium', statusColors[status])}>
    {status}
  </span>
);

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source }) => (
  <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-medium', sourceColors[source])}>
    {source}
  </span>
);
