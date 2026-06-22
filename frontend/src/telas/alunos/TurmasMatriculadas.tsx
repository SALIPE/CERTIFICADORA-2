import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { get } from "../../services/WebService";

interface TurmaMatriculada {
  id: string;
  turma_nome: string;
  turma_id: string;
  turma_descricao: string;
  aluno_id: string;
  frequencia: string;
}

export default function TurmasMatriculadas() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [turmas, setTurmas] = useState<TurmaMatriculada[]>([]);
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
      const response = await get(`/matriculas/aluno/${alunoId}`);
      const augmented = await Promise.all(
        response.map(async (turma: TurmaMatriculada) => {
          const freq = await fetchFrequencia(turma.turma_id, alunoId);
          return { ...turma, frequencia: freq || "0%" };
        })
      );
      setTurmas(augmented);


    } catch (err) {
      setError("Não foi possível carregar suas turmas.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFrequencia = async (turmaId: string, alunoId: string) => {
    if (!turmaId) return "";
    try {
      const response = await get(`/presencas/frequencia?turmaId=${turmaId}&alunoId=${alunoId}`);
      return response?.frequencia_percentual || "";
    } catch (error) {
      setError('Erro ao buscar frequencias');
      console.error('Erro:', error);
      return "";
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
          {turmas.map((turmaData: TurmaMatriculada) => {
            return (
              <Col key={turmaData.id}>
                <Card className="h-100 shadow-sm border-0 bg-white">
                  <Card.Body className="d-flex flex-column p-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h4 className="fw-bold m-0">
                        {turmaData.turma_nome || "Turma"}
                      </h4>
                    </div>
                    <Card.Text className="text-muted small flex-grow-1">
                      {turmaData.turma_descricao || "Sem descrição cadastrada."}
                    </Card.Text>
                    <div className="text-success small fw-semibold mt-3">
                      ✓ Você está regularmente matriculado
                    </div>
                    <div className="text-success small fw-semibold mt-3">
                      {turmaData.frequencia} de frequencia nessa turma.
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
