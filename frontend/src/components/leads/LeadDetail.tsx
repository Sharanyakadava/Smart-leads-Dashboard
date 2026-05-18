import React from 'react';
import { Lead } from '../../types';
import { Modal } from '../ui/Modal';
import { StatusBadge, SourceBadge } from '../ui/Badge';

interface LeadDetailProps {
  lead: Lead | null;
  onClose: () => void;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const LeadDetail: React.FC<LeadDetailProps> = ({ lead, onClose }) => {
  if (!lead) return null;

  const createdByName =
    typeof lead.createdBy === 'object' ? lead.createdBy.name : 'Unknown';

  return (
    <Modal isOpen={!!lead} onClose={onClose} title="Lead Details">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Name</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{lead.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</p>
            <p className="text-sm text-gray-900 dark:text-white mt-0.5 break-all">{lead.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Status</p>
            <StatusBadge status={lead.status} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Source</p>
            <SourceBadge source={lead.source} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Created By</p>
            <p className="text-sm text-gray-900 dark:text-white mt-0.5">{createdByName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Created At</p>
            <p className="text-sm text-gray-900 dark:text-white mt-0.5">{formatDate(lead.createdAt)}</p>
          </div>
        </div>
        {lead.notes && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Notes</p>
            <p className="text-sm text-gray-900 dark:text-white mt-0.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              {lead.notes}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
