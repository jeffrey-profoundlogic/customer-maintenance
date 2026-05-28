import { Request, Response, NextFunction } from 'express';
import { customerService } from '../services/customerService.js';
import { CustomerCreateSchema, CustomerUpdateSchema } from '../models/customer.js';
import { ZodError } from 'zod';

export class CustomerController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await customerService.findAll(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = (req.query.q as string) || '';
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!query.trim()) {
        const result = await customerService.findAll(page, limit);
        res.json(result);
        return;
      }

      const result = await customerService.search(query, page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { custref } = req.params;
      const customer = await customerService.findByRef(custref);

      if (!customer) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }

      res.json(customer);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = CustomerCreateSchema.parse(req.body);
      const existing = await customerService.findByRef(data.custref);

      if (existing) {
        res.status(409).json({ error: 'Customer with this reference already exists' });
        return;
      }

      const customer = await customerService.create(data);
      res.status(201).json(customer);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors,
        });
        return;
      }
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { custref } = req.params;
      const data = CustomerUpdateSchema.parse(req.body);

      const customer = await customerService.update(custref, data);

      if (!customer) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }

      res.json(customer);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors,
        });
        return;
      }
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { custref } = req.params;
      const deleted = await customerService.delete(custref);

      if (!deleted) {
        res.status(404).json({ error: 'Customer not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const customerController = new CustomerController();
