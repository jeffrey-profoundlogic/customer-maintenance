import { useState, useEffect, FormEvent } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { Customer, CustomerFormData } from '../types/customer';

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const emptyFormData: CustomerFormData = {
  custref: '',
  name: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postalcode: '',
  country: '',
  phone: '',
  email: '',
};

export function CustomerForm({ customer, onSubmit, onCancel, loading = false }: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerFormData>(emptyFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({});

  const isEdit = !!customer;

  useEffect(() => {
    if (customer) {
      setFormData({ ...customer });
    } else {
      setFormData(emptyFormData);
    }
  }, [customer]);

  const handleChange = (field: keyof CustomerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerFormData, string>> = {};

    if (!formData.custref.trim()) {
      newErrors.custref = 'Customer reference is required';
    } else if (formData.custref.length > 10) {
      newErrors.custref = 'Customer reference must be 10 characters or less';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name must be 50 characters or less';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">{isEdit ? 'Edit Customer' : 'New Customer'}</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Customer Reference *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.custref}
                  onChange={(e) => handleChange('custref', e.target.value)}
                  isInvalid={!!errors.custref}
                  disabled={isEdit}
                  maxLength={10}
                />
                <Form.Control.Feedback type="invalid">{errors.custref}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Name *</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  isInvalid={!!errors.name}
                  maxLength={50}
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Address Line 1</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.address1}
                  onChange={(e) => handleChange('address1', e.target.value)}
                  maxLength={50}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Address Line 2</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.address2}
                  onChange={(e) => handleChange('address2', e.target.value)}
                  maxLength={50}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  maxLength={30}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  maxLength={20}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.postalcode}
                  onChange={(e) => handleChange('postalcode', e.target.value)}
                  maxLength={15}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  maxLength={30}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  maxLength={20}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  isInvalid={!!errors.email}
                  maxLength={100}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
