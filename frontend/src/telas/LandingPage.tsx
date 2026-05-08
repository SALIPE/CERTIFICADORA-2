import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="admin-landing-page">
      <Container className="py-5">
        <header className="text-center mb-5">
          <h1 className="brand-name">Furiosos Cheer</h1>
          <p className="brand-subtitle">Iniciativas que transformam realidades através do esporte</p>
        </header>

        <Row className="g-4 mb-5">
          <Col md={4}>
            <div className="info-card h-100">
              <h2 className="info-title">Quem Somos?</h2>
              <div className="info-body">
                <p>Fundado em <strong>março de 2016</strong>, o time é um projeto de extensão da UTFPR-CP que une dança e acrobacias[cite: 6, 27].</p>
              </div>
            </div>
          </Col>

          <Col md={4}>
            <div className="info-card h-100">
              <h2 className="info-title">Furiosos Kids</h2>
              <div className="info-body">
                <p>Iniciado em <strong>2018</strong>, oferece aulas especializadas para crianças da comunidade, promovendo a inclusão[cite: 78, 80].</p>
              </div>
            </div>
          </Col>

          <Col md={4}>
            <div className="info-card h-100">
              <h2 className="info-title">Impacto Social</h2>
              <div className="info-body">
                <p><strong>Grand Champion 2024:</strong> O esporte como ferramenta de disciplina e conquista para jovens atletas[cite: 48].</p>
              </div>
            </div>
          </Col>
        </Row>

        <div className="text-center mt-4">
          <Button 
            className="btn-action px-5 py-3" 
            onClick={() => navigate('/login')}
          >
            Acessar Portal do Atleta
          </Button>
        </div>
      </Container>
    </div>
  );
}