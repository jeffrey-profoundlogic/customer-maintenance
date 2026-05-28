import { Alert as BootstrapAlert } from 'react-bootstrap';

interface AlertProps {
  variant: 'success' | 'danger' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
  dismissible?: boolean;
}

export function Alert({ variant, message, onClose, dismissible = true }: AlertProps) {
  return (
    <BootstrapAlert variant={variant} onClose={onClose} dismissible={dismissible}>
      {message}
    </BootstrapAlert>
  );
}
