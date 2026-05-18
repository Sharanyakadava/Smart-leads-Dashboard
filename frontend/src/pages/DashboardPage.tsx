import React, { useState, useCallback } from 'react';
import { Plus, Download, Users, TrendingUp, UserCheck, XCircle } from 'lucide-react';
import { LeadFilters, Lead, LeadFormData } from '../types';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from '../hooks/useLeads';
import { useDebounce } from '../hooks/useDebounce';
import { useAuthStore } from '../store/authStore';
import { leadsService } from '../services/leadsService';
import { FilterBar } from '../components/leads/FilterBar';
import { LeadTable } from '../components/leads/LeadTable';
import { Pagination } from '../components/leads/Pagination';
import { LeadForm } from '../components/leads/LeadForm';
import { LeadDetail } from '../components/leads/LeadDetail';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/Spinner';
import toast from 'react-hot-toast';

const DEFAULT_FILTERS: LeadFilters = {
  status: '',
  source: '',
  search: '',
  sort: 'latest',
  page: 1,
  limit: 10,
};

const StatCard: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}> = ({ label, value, icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);

  const activeFilters: LeadFilters = { ...filters, search: debouncedSearch, page: filters.page };

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Lead | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading, isError } = useLeads(activeFilters);
  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();

  const leads = data?.data ?? [];
  const meta = data?.meta;

  // Stat counts (from current page data for demo; ideally from API)
  const statusCounts = leads.reduce(
    (acc, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc; },
    {} as Record<string, number>
  );

  const handleFilterChange = (key: keyof LeadFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchInput('');
  };

  const handleCreateSubmit = async (formData: LeadFormData) => {
    await createMutation.mutateAsync(formData);
    setShowCreateModal(false);
  };

  const handleEditSubmit = async (formData: LeadFormData) => {
    if (!editLead) return;
    await updateMutation.mutateAsync({ id: editLead._id, data: formData });
    setEditLead(null);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await deleteMutation.mutateAsync(deleteConfirm._id);
    setDeleteConfirm(null);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await leadsService.exportCSV({
        status: filters.status,
        source: filters.source,
        search: debouncedSearch,
      });
      toast.success('CSV exported!');
    } catch {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage and track your sales leads
          </p>
        </div>
        <div className="flex items-center gap-3">
          {user?.role === 'admin' && (
            <Button
              variant="outline"
              onClick={handleExport}
              isLoading={isExporting}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export CSV
            </Button>
          )}
          {user?.role === 'admin' && (
            <Button onClick={() => setShowCreateModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
              Add Lead
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      {meta && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Leads"
            value={meta.total}
            icon={<Users className="w-6 h-6 text-blue-600" />}
            color="bg-blue-50 dark:bg-blue-900/20"
          />
          <StatCard
            label="Qualified"
            value={statusCounts['Qualified'] ?? 0}
            icon={<UserCheck className="w-6 h-6 text-green-600" />}
            color="bg-green-50 dark:bg-green-900/20"
          />
          <StatCard
            label="Contacted"
            value={statusCounts['Contacted'] ?? 0}
            icon={<TrendingUp className="w-6 h-6 text-yellow-600" />}
            color="bg-yellow-50 dark:bg-yellow-900/20"
          />
          <StatCard
            label="Lost"
            value={statusCounts['Lost'] ?? 0}
            icon={<XCircle className="w-6 h-6 text-red-500" />}
            color="bg-red-50 dark:bg-red-900/20"
          />
        </div>
      )}

      {/* Filters */}
      <FilterBar
        filters={{ ...filters, search: searchInput }}
        onSearchChange={setSearchInput}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <PageLoader />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-red-500 font-medium">Failed to load leads.</p>
            <p className="text-sm text-gray-400 mt-1">Please check your connection and try again.</p>
          </div>
        ) : (
          <>
            <LeadTable
              leads={leads}
              userRole={user?.role ?? 'sales'}
              onView={setViewLead}
              onEdit={setEditLead}
              onDelete={setDeleteConfirm}
            />
            {meta && (
              <div className="px-5 border-t border-gray-100 dark:border-gray-700">
                <Pagination
                  meta={meta}
                  onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Lead"
      >
        <LeadForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setShowCreateModal(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editLead}
        onClose={() => setEditLead(null)}
        title="Edit Lead"
      >
        <LeadForm
          initialData={editLead ?? undefined}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditLead(null)}
          isLoading={updateMutation.isPending}
          isEditMode
        />
      </Modal>

      {/* View Modal */}
      <LeadDetail lead={viewLead} onClose={() => setViewLead(null)} />

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Lead"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {deleteConfirm?.name}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;
