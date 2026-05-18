import React from 'react';
import { Pencil, Trash2, Eye, Users } from 'lucide-react';
import { Lead, UserRole } from '../../types';
import { StatusBadge, SourceBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface LeadTableProps {
  leads: Lead[];
  userRole: UserRole;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  userRole,
  onView,
  onEdit,
  onDelete,
}) => {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
        <h3 className="text-base font-medium text-gray-600 dark:text-gray-400">No leads found</h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Try adjusting your filters or add a new lead.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Name</th>
            <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden sm:table-cell">Email</th>
            <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Status</th>
            <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden md:table-cell">Source</th>
            <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell">Created</th>
            <th className="text-right px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {leads.map((lead) => (
            <tr
              key={lead._id}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td className="px-5 py-4">
                <div className="font-medium text-gray-900 dark:text-white">{lead.name}</div>
                <div className="text-xs text-gray-500 sm:hidden">{lead.email}</div>
              </td>
              <td className="px-5 py-4 text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                {lead.email}
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-5 py-4 hidden md:table-cell">
                <SourceBadge source={lead.source} />
              </td>
              <td className="px-5 py-4 text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                {formatDate(lead.createdAt)}
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(lead)}
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(lead)}
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  {userRole === 'admin' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(lead)}
                      title="Delete"
                      className="hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
