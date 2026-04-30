import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Form,
  Spinner,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Auth.css';
import { useUser } from '../contexts/UserContext';
import { errorAlert } from '../utils/Functions';

import iconImg from '../assets/css/images/icon.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error('Email e senha são obrigatórios');
      }

      let userType = await login(email, password);

      if (userType == null) {
        errorAlert("Login Incorreto!", () => null)
      }
      else {
        if (userType === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/alunos/turmas');
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="login-container-wrapper">
        <Card className="auth-card">
          <Card.Body className="d-flex flex-column align-items-center">
            <div className="auth-header-logo w-100">
              <img src={iconImg} alt="Furiosos Kids Logo" className="main-logo-top" />
              <h2 className="auth-welcome-text">Seja bem-vindo!</h2>
              <p className="auth-subtitle">Faça login para acessar o sistema</p>
            </div>
            
            {error && (
              <Alert variant="danger" className="w-100 mb-3">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} className="w-100">
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="seu@email.com"
                  className="form-control-custom"
                  disabled={isLoading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Digite sua senha"
                  className="form-control-custom"
                  disabled={isLoading}
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 btn-auth mb-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "ENTRAR"
                )}
              </Button>
            </Form>

            <div className="auth-divider w-100">
              <span>ou</span>
            </div>

            <div className="auth-footer-phrase w-100">
              <p>
                Aqui, mais que um esporte, formamos <span className="highlight-orange">campeões</span> para a vida!
              </p>
              <div className="footer-underline"></div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}