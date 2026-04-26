import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Container fluid className="admin-dashboard py-4">
      <h1>Tela Inicial</h1>
      <Button onClick={() => navigate('/login')}>Ir para Login</Button>
    </Container>
  );
}


