import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/css/images/icon.png'; 
import '../assets/css/LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="admin-landing-page">
      <nav className="custom-navbar">
        <img src={logo} alt="Logo Furiosos" className="nav-logo-img" onClick={() => navigate('/')} />
        <button className="btn-login-nav" onClick={() => navigate('/login')}>
          <span>🔒</span> LOGIN
        </button>
      </nav>

      <Container>
        <header className="text-center mb-5">
          <h1 className="brand-name" style={{color: 'white', fontWeight: 900, fontSize: '2.5rem'}}>FURIOSOS KIDS</h1>
          <p className="brand-subtitle" style={{fontWeight: 700, fontSize: '1rem'}}>FORMANDO PEQUENOS ATLETAS, CONSTRUINDO GRANDES FUTUROS</p>
        </header>

        <section className="white-section-card">
          <h2 className="section-header-title">O que é Cheerleading?</h2>
          <Row className="g-4 mb-4">
            <Col md={4}>
              <div className="skill-item">
                <div className="skill-icon-circle bg-orange">🤸</div>
                <div className="skill-text">
                  <h6>Acrobacias</h6>
                  <p>Movimentos que exigem força, equilíbrio e muita técnica.</p>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="skill-item">
                <div className="skill-icon-circle bg-dark-blue">💃</div>
                <div className="skill-text">
                  <h6>Dança</h6>
                  <p>Coreografias cheias de energia e sincronismo.</p>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="skill-item">
                <div className="skill-icon-circle bg-orange">💪</div>
                <div className="skill-text">
                  <h6>Força e Confiança</h6>
                  <p>Desenvolvimento físico e mental dentro e fora do esporte.</p>
                </div>
              </div>
            </Col>
          </Row>

          <div className="dark-project-banner">
            <Row className="align-items-center">
              <Col lg={6} className="project-info-text pe-lg-4">
                <h3>SOBRE O PROJETO</h3>
                <p>Fundado em <strong>2018</strong>, o Furiosos Kids é o projeto social da faculdade UTFPR em Cornélio Procópio. Atendemos crianças da comunidade, ensinando os valores do esporte.</p>
                <p>Atualmente, o time é <strong>Campeão do Cheerfest</strong>, um dos campeonatos mais prestigiados da modalidade!</p>
              </Col>
              <Col lg={6}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="stat-item">
                    <span className="stat-icon">📅</span>
                    <span className="stat-title">DESDE</span>
                    <span className="stat-value">2018</span>
                    <span className="stat-desc">Transformando vidas</span>
                  </div>
                  <div className="stat-divider" />
                  <div className="stat-item">
                    <span className="stat-icon">🏆</span>
                    <span className="stat-title">CAMPEÃO</span>
                    <span className="stat-value">CHEERFEST</span>
                    <span className="stat-desc">Um dos maiores títulos</span>
                  </div>
                  <div className="stat-divider" />
                  <div className="stat-item">
                    <span className="stat-icon">👥</span>
                    <span className="stat-title">COMUNIDADE</span>
                    <span className="stat-value">+100</span>
                    <span className="stat-desc">Crianças atendidas</span>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <h2 className="section-header-title">Quadro de Honra</h2>
          <Row className="g-4 mb-4">
            <Col md={6}>
              <div className="honor-card-bordered">
                <div style={{fontSize: '3.5rem'}}>🏆</div>
                <div className="flex-grow-1">
                  <span className="fw-bold text-uppercase small" style={{opacity: 0.6, fontSize: '0.7rem'}}>Cheerfest International</span>
                  <h4 className="honor-rank-title">Campeão (Kids)</h4>
                  <div className="year-badge-dark">2025</div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="honor-card-bordered">
                <div style={{fontSize: '3.5rem'}}>🏅</div>
                <div className="flex-grow-1">
                  <span className="fw-bold text-uppercase small" style={{opacity: 0.6, fontSize: '0.7rem'}}>Cheer Magic Champions</span>
                  <h4 className="honor-rank-title">Pódio Nacional</h4>
                  <div className="year-badge-dark">2024</div>
                </div>
              </div>
            </Col>
          </Row>

          <div className="video-banner-section">
            <div className="video-banner-content">
              <h2>
                VEJA NOSSAS ATLETAS <br />
                <span className="highlight">EM AÇÃO!</span>
              </h2>
              <p>Paixão, dedicação e união que fazem a diferença.</p>
            </div>
            <div 
              className="video-thumb-container" 
              onClick={() => window.open("https://www.youtube.com/watch?v=WN2uZYWOCxs", "_blank")}
            >
              <img 
                src="https://img.youtube.com/vi/WN2uZYWOCxs/maxresdefault.jpg" 
                alt="Thumbnail Video" 
                className="video-thumb-img" 
              />
              <div className="play-button-overlay">
                <div className="play-icon-inner"></div>
              </div>
            </div>
          </div>

          <footer className="contact-footer-banner">
            <div className="contact-title-group">
              <h2>ENTRE EM CONTATO</h2>
              <div className="orange-line"></div>
            </div>

            <div className="contact-items-group">
              <div className="contact-item">
                <a href="https://www.instagram.com/_furiosos_foxes_/" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" className="contact-icon-img" />
                </a>
                <div className="contact-text-info">
                  <span>INSTAGRAM</span>
                  <p>@_furiosos_foxes_</p>
                </div>
              </div>

              <div className="contact-divider-vertical"></div>

              <div className="contact-item">
                <img src="https://cdn-icons-png.flaticon.com/512/484/484167.png" alt="Localização" className="contact-icon-img" />
                <div className="contact-text-info">
                  <span>LOCALIZAÇÃO</span>
                  <p>UTFPR - CP</p>
                </div>
              </div>

              <div className="contact-divider-vertical"></div>

              <div className="contact-item">
                <img src="https://cdn-icons-png.flaticon.com/512/281/281769.png" alt="Email" className="contact-icon-img" />
                <div className="contact-text-info">
                  <span>E-MAIL</span>
                  <p>contato@furiosos.com</p>
                </div>
              </div>
            </div>
          </footer>
        </section>
        <div className="copyright-footer">
          Furiosos Kids © 2025 - Todos os direitos reservados.
        </div>
      </Container>
    </div>
  );
}