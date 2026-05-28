import { ReactNode } from 'react';
import { Container, Navbar } from 'react-bootstrap';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>Customer Maintenance</Navbar.Brand>
        </Container>
      </Navbar>
      <Container>{children}</Container>
    </>
  );
}
