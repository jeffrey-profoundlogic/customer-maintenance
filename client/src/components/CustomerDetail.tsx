import { Card, Row, Col, Button } from 'react-bootstrap';
import { Customer } from '../types/customer';

interface CustomerDetailProps {
  customer: Customer;
  onEdit: () => void;
  onBack: () => void;
}

export function CustomerDetail({ customer, onEdit, onBack }: CustomerDetailProps) {
  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Customer Details</h5>
        <div>
          <Button variant="outline-secondary" size="sm" onClick={onBack} className="me-2">
            Back to List
          </Button>
          <Button variant="primary" size="sm" onClick={onEdit}>
            Edit
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <dl>
              <dt>Customer Reference</dt>
              <dd>{customer.custref}</dd>

              <dt>Name</dt>
              <dd>{customer.name}</dd>

              <dt>Address</dt>
              <dd>
                {customer.address1 && <div>{customer.address1}</div>}
                {customer.address2 && <div>{customer.address2}</div>}
                {(customer.city || customer.state || customer.postalcode) && (
                  <div>
                    {customer.city}
                    {customer.city && customer.state && ', '}
                    {customer.state} {customer.postalcode}
                  </div>
                )}
                {customer.country && <div>{customer.country}</div>}
              </dd>
            </dl>
          </Col>
          <Col md={6}>
            <dl>
              <dt>Phone</dt>
              <dd>{customer.phone || '-'}</dd>

              <dt>Email</dt>
              <dd>{customer.email || '-'}</dd>
            </dl>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
