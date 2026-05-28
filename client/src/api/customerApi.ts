import axios, { AxiosError } from 'axios';
import { Customer, CustomerFormData, PaginatedResponse, ApiError } from '../types/customer';

const api = axios.create({
  baseURL: '/api/v1/customers',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getCustomers(
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Customer>> {
  const response = await api.get<PaginatedResponse<Customer>>('/', {
    params: { page, limit },
  });
  return response.data;
}

export async function searchCustomers(
  query: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Customer>> {
  const response = await api.get<PaginatedResponse<Customer>>('/search', {
    params: { q: query, page, limit },
  });
  return response.data;
}

export async function getCustomer(custref: string): Promise<Customer> {
  const response = await api.get<Customer>(`/${encodeURIComponent(custref)}`);
  return response.data;
}

export async function createCustomer(data: CustomerFormData): Promise<Customer> {
  const response = await api.post<Customer>('/', data);
  return response.data;
}

export async function updateCustomer(
  custref: string,
  data: Omit<CustomerFormData, 'custref'>
): Promise<Customer> {
  const response = await api.put<Customer>(`/${encodeURIComponent(custref)}`, data);
  return response.data;
}

export async function deleteCustomer(custref: string): Promise<void> {
  await api.delete(`/${encodeURIComponent(custref)}`);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined;
    if (apiError?.error) {
      return apiError.error;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
