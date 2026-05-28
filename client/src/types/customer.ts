export interface Customer {
  custref: string;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalcode: string;
  country: string;
  phone: string;
  email: string;
}

export interface CustomerFormData {
  custref: string;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalcode: string;
  country: string;
  phone: string;
  email: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  details?: Array<{
    path: string[];
    message: string;
  }>;
}
