import { z } from 'zod';

export interface Customer {
  custref: string;
  name: string;
  shortname: string;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  postcode: string;
  credlmt: number;
  phone: string;
  website: string;
  contact: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const CustomerCreateSchema = z.object({
  custref: z
    .string()
    .min(1, 'Customer reference is required')
    .max(10, 'Customer reference must be 10 characters or less'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be 50 characters or less'),
  shortname: z.string().max(20, 'Short name must be 20 characters or less').default(''),
  address1: z.string().max(50, 'Address 1 must be 50 characters or less').default(''),
  address2: z.string().max(50, 'Address 2 must be 50 characters or less').default(''),
  address3: z.string().max(50, 'Address 3 must be 50 characters or less').default(''),
  address4: z.string().max(50, 'Address 4 must be 50 characters or less').default(''),
  postcode: z.string().max(15, 'Postcode must be 15 characters or less').default(''),
  credlmt: z.number().min(0, 'Credit limit must be positive').default(0),
  phone: z.string().max(20, 'Phone must be 20 characters or less').default(''),
  website: z.string().max(100, 'Website must be 100 characters or less').default(''),
  contact: z.string().max(50, 'Contact must be 50 characters or less').default(''),
});

export const CustomerUpdateSchema = CustomerCreateSchema.omit({ custref: true });

export type CustomerCreate = z.infer<typeof CustomerCreateSchema>;
export type CustomerUpdate = z.infer<typeof CustomerUpdateSchema>;
