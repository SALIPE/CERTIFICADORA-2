import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { get } from "../../services/WebService";

interface Turma {
  id: string;
  nome: string;
  descricao: string;
  status: string;
}

export default function TurmasMatriculadas() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.usuario_id) {
      fetchTurmas(user.usuario_id);
    }
  }, [user]);

  const fetchTurmas = async (alunoId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await get(`/furiosos/matriculas/aluno/${alunoId}`);
      const lista = Array.isArray(response) ? response : [];
      setTurmas(lista);
    } catch (err) {
      setError("Não foi possível carregar suas turmas.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="border-0 shadow-sm mb-4 bg-dark text-white">
        <Card.Body className="d-flex justify-content-between align-items-center p-4 flex-wrap gap-3">
          <div>
            <span
              className="text-success fw-bold text-uppercase tracking-wider"
              style={{ fontSize: "0.85rem" }}
            >
              Gerenciamento
            </span>
            <h2 className="fw-bold m-0 mt-1">📚 Minhas Matrículas Ativas</h2>
            <p className="text-light-50 m-0 small mt-1">
              Veja abaixo as turmas oficiais às quais o seu perfil está
              vinculado.
            </p>
          </div>
          {/* VOLTA PARA A TELA DE CRONOGRAMA */}
          <Button
            variant="outline-light"
            className="fw-semibold px-4"
            onClick={() => navigate("/alunos/turmas")}
          >
            ← Voltar para o Cronograma
          </Button>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">⚠️ {error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
        </div>
      ) : turmas.length === 0 ? (
        <Alert variant="info">
          Você não está matriculado em nenhuma turma no momento.
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {turmas.map((item: any) => {
            const turmaData = item.turma || item;
            return (
              <Col key={turmaData.id || turmaData.id_turma}>
                <Card className="h-100 shadow-sm border-0 bg-white">
                  <Card.Body className="d-flex flex-column p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h4 className="fw-bold m-0">
                        {turmaData.nome || "Turma"}
                      </h4>
                      <Badge
                        bg={
                          turmaData.status === "ATIVA" ? "success" : "secondary"
                        }
                      >
                        {turmaData.status || "ATIVA"}
                      </Badge>
                    </div>
                    <Card.Text className="text-muted small flex-grow-1">
                      {turmaData.descricao || "Sem descrição cadastrada."}
                    </Card.Text>
                    <div className="text-success small fw-semibold mt-3">
                      ✓ Você está regularmente matriculado
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}
