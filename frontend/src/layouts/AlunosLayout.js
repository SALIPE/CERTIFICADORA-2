import { Outlet, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { useUser } from "../contexts/UserContext";

export default function AlunosLayout() {
  const navigate = useNavigate();
  const { logout } = useUser(); // Pega a função de logout do seu contexto (se houver)

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.clear();
    }
    navigate("/login");
  };

  return (
    // d-flex flex-column min-vh-100 garante que o footer fique SEMPRE colado lá embaixo
    <div className="main-panel d-flex flex-column min-vh-100 bg-light">
      {/* NAVBAR DO BOOTSTRAP SUBSTITUINDO O TEXTO CRU */}
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="sticky-top shadow-sm py-3"
      >
        <Container>
          <Navbar.Brand href="#/alunos/turmas" className="fw-bold text-success">
            Portal do Furioso
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="alunos-navbar-nav" />
          <Navbar.Collapse id="alunos-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              <Button
                variant="outline-light"
                size="sm"
                className="fw-semibold px-3"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* CONTEÚDO DAS SUAS TELAS (flex-grow-1 empurra o footer para baixo) */}
      <div className="content flex-grow-1 py-4">
        <Outlet />
      </div>

      {/* FOOTER CORRIGIDO (Agora fixo na parte inferior da página) */}
      <footer
        style={{ background: "#06164d" }}
        className="text-light text-center py-3 mt-auto"
      ></footer>
    </div>
  );
}
