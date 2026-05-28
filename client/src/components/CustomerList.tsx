import { useState, FormEvent } from 'react';
import { Table, Button, Card, Form, InputGroup } from 'react-bootstrap';
import { Customer } from '../types/customer';
import { Pagination } from './Pagination';

interface CustomerListProps {
  customers: Customer[];
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onCreate: () => void;
}

export function CustomerList({
  customers,
  currentPage,
  totalPages,
  searchQuery,
  onPageChange,
  onSearch,
  onView,
  onEdit,
  onDelete,
  onCreate,
}: CustomerListProps) {
  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    onSearch('');
  };

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="mb-0">Customers</h5>
          <Button variant="primary" size="sm" onClick={onCreate}>
            New Customer
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSearchSubmit} className="mb-3">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search by reference, name, or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Button variant="outline-secondary" type="submit">
              Search
            </Button>
            {searchQuery && (
              <Button variant="outline-secondary" onClick={handleClearSearch}>
                Clear
              </Button>
            )}
          </InputGroup>
        </Form>

        {customers.length === 0 ? (
          <p className="text-muted text-center py-4">
            {searchQuery ? 'No customers found matching your search.' : 'No customers found.'}
          </p>
        ) : (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Name</th>
                  <th>City</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th style={{ width: '150px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.custref}>
                    <td>{customer.custref}</td>
                    <td>{customer.name}</td>
                    <td>{customer.city || '-'}</td>
                    <td>{customer.phone || '-'}</td>
                    <td>{customer.email || '-'}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-1"
                        onClick={() => onView(customer)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-1"
                        onClick={() => onEdit(customer)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onDelete(customer)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </>
        )}
      </Card.Body>
    </Card>
  );
}
