// src/components/alunos/TurmasMatriculadas.tsx

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
import { get } from "../../services/WebService";
import { useUser } from "../../contexts/UserContext";

interface Turma {
  id: string;
  nome: string;
  descricao: string;
  status: "ATIVA" | "CONCLUIDA" | "CANCELADA";
  criado_em: string;
  atualizado_em: string;
}

interface Matricula {
  id: string;
  aluno_id: string;
  turma_id: string;
  criado_em: string;
}

export default function TurmasMatriculadas() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchTurmasMatriculadas();
  }, [user]);

  const fetchTurmasMatriculadas = async () => {
    try {
      setLoading(true);
      setError(null);

      // Busca matrículas do aluno
      const matriculas: Matricula[] = await get(
        `/matriculas/aluno/${user?.usuario_id}`,
      );

      if (!matriculas || matriculas.length === 0) {
        setTurmas([]);
        return;
      }

      // Busca detalhes de cada turma
      const turmasPromises = matriculas.map((mat: Matricula) =>
        get(`/turmas/${mat.turma_id}`),
      );
      const turmasDetalhes = await Promise.all(turmasPromises);

      // Filtra turmas ativas por padrão
      const turmasAtivas = turmasDetalhes.filter(
        (t: Turma) => t.status === "ATIVA",
      );

      setTurmas(turmasAtivas || []);
    } catch (error) {
      setError("Erro ao buscar suas turmas");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { class: string; label: string }> = {
      ATIVA: { class: "bg-success", label: "Ativa" },
      CONCLUIDA: { class: "bg-warning", label: "Concluída" },
      CANCELADA: { class: "bg-danger", label: "Cancelada" },
    };
    const info = statusMap[status] || { class: "bg-secondary", label: status };
    return <Badge className={info.class}>{info.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      ATIVA: "🟢",
      CONCLUIDA: "🟡",
      CANCELADA: "🔴",
    };
    return icons[status] || "⚪";
  };

  const handleVerAulas = (turmaId: string, turmaNome: string) => {
    navigate(`/alunos/aulas/${turmaId}`, {
      state: { turmaNome, turmaId },
    });
  };

  if (loading) {
    return (
      <Container fluid className="py-5">
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
          <p className="mt-3 text-muted">Buscando suas turmas...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h1 className="mb-1">🎯 Minhas Turmas</h1>
            <p className="text-muted">
              Olá, {user?.nome || "Aluno"}! Aqui estão todas as suas turmas
            </p>
          </div>
          <Button
            variant="outline-primary"
            onClick={() => window.location.reload()}
          >
            🔄 Atualizar
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          <Alert.Heading>Ops! Algo deu errado</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      {turmas.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <div style={{ fontSize: "4rem" }}>📖</div>
            <Card.Title className="mt-3">Nenhuma turma encontrada</Card.Title>
            <Card.Text className="text-muted">
              Você ainda não está matriculado em nenhuma turma ativa.
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {turmas.map((turma) => (
            <Col key={turma.id} md={6} lg={4}>
              <Card className="h-100 shadow-sm hover-card">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span>{getStatusIcon(turma.status)}</span>
                  {getStatusBadge(turma.status)}
                </Card.Header>
                <Card.Body>
                  <Card.Title className="mb-3">{turma.nome}</Card.Title>
                  <Card.Text className="text-muted small">
                    {turma.descricao || "Sem descrição disponível"}
                  </Card.Text>
                  <div className="mb-3">
                    <small className="text-muted">
                      Matriculado em:{" "}
                      {new Date(turma.criado_em).toLocaleDateString("pt-BR")}
                    </small>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => handleVerAulas(turma.id, turma.nome)}
                    className="w-100"
                  >
                    📚 Ver Aulas
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
