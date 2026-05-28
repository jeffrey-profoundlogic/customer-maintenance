import { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/common/Layout';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { Alert } from './components/common/Alert';
import { CustomerList } from './components/CustomerList';
import { CustomerForm } from './components/CustomerForm';
import { CustomerDetail } from './components/CustomerDetail';
import { ConfirmModal } from './components/ConfirmModal';
import { Customer, CustomerFormData } from './types/customer';
import * as api from './api/customerApi';

type View = 'list' | 'detail' | 'create' | 'edit';

interface AppState {
  customers: Customer[];
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  success: string | null;
  view: View;
  selectedCustomer: Customer | null;
  deleteCustomer: Customer | null;
  submitting: boolean;
}

const initialState: AppState = {
  customers: [],
  currentPage: 1,
  totalPages: 1,
  searchQuery: '',
  loading: true,
  error: null,
  success: null,
  view: 'list',
  selectedCustomer: null,
  deleteCustomer: null,
  submitting: false,
};

export default function App() {
  const [state, setState] = useState<AppState>(initialState);

  const loadCustomers = useCallback(async (page: number = 1, query: string = '') => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = query
        ? await api.searchCustomers(query, page)
        : await api.getCustomers(page);

      setState((prev) => ({
        ...prev,
        customers: result.data,
        currentPage: result.page,
        totalPages: result.totalPages,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: api.getErrorMessage(error),
        loading: false,
      }));
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handlePageChange = (page: number) => {
    loadCustomers(page, state.searchQuery);
  };

  const handleSearch = (query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }));
    loadCustomers(1, query);
  };

  const handleView = (customer: Customer) => {
    setState((prev) => ({ ...prev, view: 'detail', selectedCustomer: customer }));
  };

  const handleCreate = () => {
    setState((prev) => ({ ...prev, view: 'create', selectedCustomer: null }));
  };

  const handleEdit = (customer: Customer) => {
    setState((prev) => ({ ...prev, view: 'edit', selectedCustomer: customer }));
  };

  const handleDeleteClick = (customer: Customer) => {
    setState((prev) => ({ ...prev, deleteCustomer: customer }));
  };

  const handleDeleteConfirm = async () => {
    if (!state.deleteCustomer) return;

    setState((prev) => ({ ...prev, submitting: true }));

    try {
      await api.deleteCustomer(state.deleteCustomer.custref);
      setState((prev) => ({
        ...prev,
        deleteCustomer: null,
        submitting: false,
        success: 'Customer deleted successfully',
      }));
      loadCustomers(state.currentPage, state.searchQuery);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        deleteCustomer: null,
        submitting: false,
        error: api.getErrorMessage(error),
      }));
    }
  };

  const handleDeleteCancel = () => {
    setState((prev) => ({ ...prev, deleteCustomer: null }));
  };

  const handleFormSubmit = async (data: CustomerFormData) => {
    setState((prev) => ({ ...prev, submitting: true, error: null }));

    try {
      if (state.view === 'create') {
        await api.createCustomer(data);
        setState((prev) => ({
          ...prev,
          view: 'list',
          submitting: false,
          success: 'Customer created successfully',
        }));
      } else if (state.view === 'edit' && state.selectedCustomer) {
        const { custref: _, ...updateData } = data;
        await api.updateCustomer(state.selectedCustomer.custref, updateData);
        setState((prev) => ({
          ...prev,
          view: 'list',
          submitting: false,
          success: 'Customer updated successfully',
        }));
      }
      loadCustomers(state.currentPage, state.searchQuery);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        submitting: false,
        error: api.getErrorMessage(error),
      }));
    }
  };

  const handleFormCancel = () => {
    setState((prev) => ({ ...prev, view: 'list', selectedCustomer: null }));
  };

  const handleBackToList = () => {
    setState((prev) => ({ ...prev, view: 'list', selectedCustomer: null }));
  };

  const handleEditFromDetail = () => {
    setState((prev) => ({ ...prev, view: 'edit' }));
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  const clearSuccess = () => {
    setState((prev) => ({ ...prev, success: null }));
  };

  return (
    <Layout>
      {state.error && (
        <Alert variant="danger" message={state.error} onClose={clearError} />
      )}

      {state.success && (
        <Alert variant="success" message={state.success} onClose={clearSuccess} />
      )}

      {state.loading && state.view === 'list' ? (
        <LoadingSpinner message="Loading customers..." />
      ) : state.view === 'list' ? (
        <CustomerList
          customers={state.customers}
          currentPage={state.currentPage}
          totalPages={state.totalPages}
          searchQuery={state.searchQuery}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onCreate={handleCreate}
        />
      ) : state.view === 'detail' && state.selectedCustomer ? (
        <CustomerDetail
          customer={state.selectedCustomer}
          onEdit={handleEditFromDetail}
          onBack={handleBackToList}
        />
      ) : state.view === 'create' || state.view === 'edit' ? (
        <CustomerForm
          customer={state.view === 'edit' ? state.selectedCustomer ?? undefined : undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={state.submitting}
        />
      ) : null}

      <ConfirmModal
        show={!!state.deleteCustomer}
        title="Delete Customer"
        message={`Are you sure you want to delete customer "${state.deleteCustomer?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={state.submitting}
      />
    </Layout>
  );
}
