import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../assets/css/LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="admin-landing-page">
      <Container className="py-5">
        <header className="text-center mb-5">
          <h1 className="brand-name">Furiosos Kids</h1>
          <p className="brand-subtitle">Formando pequenos atletas, construindo grandes futuros</p>
        </header>

        <Row className="g-4 mb-5">
          {/* O que é Cheerleading */}
          <Col lg={6}>
            <div className="info-card h-100">
              <h2 className="info-title">O que é Cheerleading?</h2>
              <div className="info-body">
                <p>
                  O Cheerleading é um esporte de equipe que combina elementos de <strong>ginástica, acrobacias (stunts), saltos e dança</strong>. 
                  Exige muita confiança, sincronismo e força física.
                </p>
                <p>
                  <strong>No Brasil:</strong> A modalidade cresceu nas universidades e hoje o país é referência na América Latina, 
                  com seleções competitivas que disputam o mundial em Orlando (EUA).
                </p>
              </div>
            </div>
          </Col>

          {/* O Projeto Furiosos Kids */}
          <Col lg={6}>
            <div className="info-card h-100">
              <h2 className="info-title">Sobre o Projeto</h2>
              <div className="info-body">
                <p>
                  Fundado em <strong>2018</strong>, o Furiosos Kids é o projeto social da faculdade UTFPR em Cornélio Procópio. 
                  Atendemos crianças da comunidade, ensinando os valores do esporte.
                </p>
                <p>
                  Atualmente, o time é <strong>Campeão do Cheerfest</strong>, um dos campeonatos mais prestigiados da modalidade!
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Nossas Conquistas */}
        <Row className="mb-5">
          <Col>
            <div className="info-card">
              <h2 className="info-title text-center w-100">Quadro de Honra</h2>
              <ul className="list-unstyled text-center mt-3">
                <li className="mb-2">🏆 <strong>Cheerfest International</strong> - Campeão (Kids)</li>
                <li className="mb-2">🏅 <strong>Cheer Magic Champions</strong> - Pódio Nacional</li>
                
              </ul>
            </div>
          </Col>
        </Row>

        {/* Galeria de Elite - Links Youtube */}
        <h3 className="text-center mb-4 motto" style={{ fontSize: '1.8rem' }}>Conheça nossas atletas</h3>
        <Row className="g-4 mb-5 justify-content-center">
          <Col md={6}>
            <div className="info-card text-center">
              <h3 className="card-title">Cheerfest 2025</h3>
              <p className="small">Arena Legacy 2025 - All Star Sub12 Level 1 Furiosos Kids</p>
              <Button 
                variant="outline-primary" 
                className="btn-primary w-100" 
                href="https://www.youtube.com/watch?v=WN2uZYWOCxs" 
                target="_blank"
              >
                Assistir Apresentação
              </Button>
            </div>
          </Col>
        </Row>

        {/* Contato e Redes */}
        <Row className="justify-content-center mb-5">
          <Col md={8}>
            <div className="login-container p-4 text-center">
              <h3 className="login-title mb-4">Entre em contato</h3>
              <Row>
                <Col sm={4}>
                  <p className="motto">Instagram</p>
                  <a 
                    href="https://www.instagram.com/_furiosos_foxes_/" 
                    target="_blank" 
                    rel="noreferrer"
                      >
                    @_furiosos_foxes_
                  </a>
                </Col>
                <Col sm={4}>
                  <p className="motto">Localização</p>
                  <p className="small">UTFPR - Cornélio Procópio</p>
                </Col>
                <Col sm={4}>
                  <p className="motto">E-mail</p>
                  <p className="small">contato@furiosos.com</p>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <div className="text-center">
          <Button 
            className="btn-action px-5 py-3" 
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </div>
      </Container>
    </div>
  );
}