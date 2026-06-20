// src/components/alunos/AulasMatriculadas.tsx

import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Table,
  Badge,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { get } from "../../services/WebService";
import { useUser } from "../../contexts/UserContext";

// Tipos baseados no SQL
interface Aula {
  id: string;
  turma_id: string;
  data_hora: string;
  topico: string;
  descricao: string;
  criado_em: string;
  atualizado_em: string;
}

interface Turma {
  id: string;
  nome: string;
  descricao: string;
  status: "ATIVA" | "CONCLUIDA" | "CANCELADA";
}

interface Matricula {
  id: string;
  aluno_id: string;
  turma_id: string;
  criado_em: string;
}

interface Presenca {
  id: string;
  aluno_id: string;
  aula_id: string;
  status_presenca: "PRESENTE" | "AUSENTE" | "FALTA_JUSTIFICADA";
  observacoes?: string;
}

interface AulaCompleta extends Aula {
  turma_nome: string;
  turma_status: string;
  presenca?: Presenca;
}

export default function AulasMatriculadas() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const [aulas, setAulas] = useState<AulaCompleta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("TODAS");

  // Pega o nome da turma se veio da navegação
  const turmaNome = (location.state as any)?.turmaNome || null;
  const turmaId = (location.state as any)?.turmaId || null;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (turmaId) {
      fetchAulasPorTurma(turmaId);
    } else {
      fetchTodasAulasMatriculadas();
    }
  }, [user, turmaId]);

  // Busca aulas de uma turma específica (quando vem do clique)
  const fetchAulasPorTurma = async (turmaId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Busca detalhes da turma
      const turma = await get(`/turmas/${turmaId}`);

      // Busca aulas da turma
      const aulasResponse = await get(`/aulas/turma/${turmaId}`);

      // Busca presenças do aluno nesta turma
      const presencas = await get(
        `/presencas/aluno/${user?.usuario_id}/turma/${turmaId}`,
      );

      // Combina os dados
      const aulasCompletas = aulasResponse.map((aula: Aula) => ({
        ...aula,
        turma_nome: turma.nome,
        turma_status: turma.status,
        presenca: presencas?.find((p: Presenca) => p.aula_id === aula.id),
      }));

      setAulas(aulasCompletas || []);
    } catch (error) {
      setError("Erro ao buscar aulas desta turma");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  // Busca todas as aulas de todas as turmas do aluno
  const fetchTodasAulasMatriculadas = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Buscar matrículas do aluno
      const matriculas = await get(`/matriculas/aluno/${user?.usuario_id}`);

      if (!matriculas || matriculas.length === 0) {
        setAulas([]);
        return;
      }

      // 2. Buscar todas as turmas do aluno
      const turmasPromises = matriculas.map((mat: Matricula) =>
        get(`/turmas/${mat.turma_id}`),
      );
      const turmas = await Promise.all(turmasPromises);

      // 3. Buscar aulas de cada turma
      const aulasPromises = turmas.map((turma: Turma) =>
        get(`/aulas/turma/${turma.id}`),
      );
      const aulasPorTurma = await Promise.all(aulasPromises);

      // 4. Buscar presenças do aluno em todas as turmas
      const presencasPromises = turmas.map((turma: Turma) =>
        get(`/presencas/aluno/${user?.usuario_id}/turma/${turma.id}`),
      );
      const presencasPorTurma = await Promise.all(presencasPromises);

      // 5. Combinar todos os dados
      const todasAulas: AulaCompleta[] = [];
      turmas.forEach((turma: Turma, index: number) => {
        const aulasDaTurma = aulasPorTurma[index] || [];
        const presencasDaTurma = presencasPorTurma[index] || [];

        aulasDaTurma.forEach((aula: Aula) => {
          todasAulas.push({
            ...aula,
            turma_nome: turma.nome,
            turma_status: turma.status,
            presenca: presencasDaTurma.find(
              (p: Presenca) => p.aula_id === aula.id,
            ),
          });
        });
      });

      // Ordenar por data (mais recentes primeiro)
      todasAulas.sort(
        (a, b) =>
          new Date(b.data_hora).getTime() - new Date(a.data_hora).getTime(),
      );

      setAulas(todasAulas);
    } catch (error) {
      setError("Erro ao buscar suas aulas");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { class: string; label: string }> = {
      PROGRAMADA: { class: "bg-warning", label: "Programada" },
      REALIZADA: { class: "bg-success", label: "Realizada" },
      CANCELADA: { class: "bg-danger", label: "Cancelada" },
    };
    const info = statusMap[status] || { class: "bg-secondary", label: status };
    return <Badge className={info.class}>{info.label}</Badge>;
  };

  const getPresencaBadge = (presenca?: Presenca) => {
    if (!presenca) return <Badge bg="secondary">Não registrado</Badge>;

    const presencaMap: Record<
      string,
      { class: string; label: string; icon: string }
    > = {
      PRESENTE: { class: "bg-success", label: "Presente", icon: "✅" },
      AUSENTE: { class: "bg-danger", label: "Ausente", icon: "❌" },
      FALTA_JUSTIFICADA: {
        class: "bg-warning",
        label: "Falta Justificada",
        icon: "📋",
      },
    };
    const info = presencaMap[presenca.status_presenca] || {
      class: "bg-secondary",
      label: presenca.status_presenca,
      icon: "❓",
    };
    return (
      <Badge className={info.class}>
        {info.icon} {info.label}
      </Badge>
    );
  };

  const formatarData = (dataHora: string) => {
    return new Date(dataHora).toLocaleString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isAulaFutura = (dataHora: string) => {
    return new Date(dataHora) > new Date();
  };

  const aulasFiltradas =
    filterStatus === "TODAS"
      ? aulas
      : aulas.filter((aula) => aula.turma_status === filterStatus);

  const aulasAgrupadasPorTurma = aulasFiltradas.reduce(
    (acc, aula) => {
      if (!acc[aula.turma_id]) {
        acc[aula.turma_id] = {
          turmaNome: aula.turma_nome,
          turmaStatus: aula.turma_status,
          aulas: [],
        };
      }
      acc[aula.turma_id].aulas.push(aula);
      return acc;
    },
    {} as Record<
      string,
      { turmaNome: string; turmaStatus: string; aulas: AulaCompleta[] }
    >,
  );

  if (loading) {
    return (
      <Container fluid className="py-5">
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Carregando suas aulas...</span>
          </Spinner>
          <p className="mt-3 text-muted">Buscando suas aulas...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h1 className="mb-1">
              📚 {turmaNome ? `Aulas - ${turmaNome}` : "Minhas Aulas"}
            </h1>
            <p className="text-muted">
              Olá, {user?.nome || "Aluno"}!
              {turmaNome
                ? ` Acompanhe as aulas da turma ${turmaNome}`
                : " Acompanhe todas as suas aulas"}
            </p>
          </div>
          <div className="d-flex gap-2">
            {turmaId && (
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/alunos/turmas")}
              >
                ← Voltar para Turmas
              </Button>
            )}
            <Button
              variant="outline-primary"
              onClick={() => window.location.reload()}
            >
              🔄 Atualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          <Alert.Heading>Ops! Algo deu errado</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      {/* Filtros */}
      {aulas.length > 0 && (
        <div className="mb-4">
          <div className="d-flex flex-wrap gap-2">
            <Button
              variant={filterStatus === "TODAS" ? "primary" : "outline-primary"}
              size="sm"
              onClick={() => setFilterStatus("TODAS")}
            >
              Todas ({aulas.length})
            </Button>
            <Button
              variant={
                filterStatus === "PROGRAMADA" ? "warning" : "outline-warning"
              }
              size="sm"
              onClick={() => setFilterStatus("PROGRAMADA")}
            >
              📅 Programadas (
              {aulas.filter((a) => a.turma_status === "PROGRAMADA").length})
            </Button>
            <Button
              variant={
                filterStatus === "REALIZADA" ? "success" : "outline-success"
              }
              size="sm"
              onClick={() => setFilterStatus("REALIZADA")}
            >
              ✅ Realizadas (
              {aulas.filter((a) => a.turma_status === "REALIZADA").length})
            </Button>
            <Button
              variant={
                filterStatus === "CANCELADA" ? "danger" : "outline-danger"
              }
              size="sm"
              onClick={() => setFilterStatus("CANCELADA")}
            >
              ❌ Canceladas (
              {aulas.filter((a) => a.turma_status === "CANCELADA").length})
            </Button>
          </div>
        </div>
      )}

      {/* Conteúdo */}
      {aulas.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <div style={{ fontSize: "4rem" }}>📖</div>
            <Card.Title className="mt-3">Nenhuma aula encontrada</Card.Title>
            <Card.Text className="text-muted">
              {turmaNome
                ? `Esta turma ainda não tem aulas cadastradas.`
                : `Você ainda não está matriculado em nenhuma turma com aulas.`}
            </Card.Text>
            {!turmaId && (
              <Button
                variant="primary"
                onClick={() => navigate("/alunos/turmas")}
                className="mt-2"
              >
                Ver Turmas Disponíveis
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <>
          {/* Visualização em Cards (Mobile First) */}
          <div className="d-block d-md-none">
            {Object.entries(aulasAgrupadasPorTurma).map(
              ([turmaId, { turmaNome, turmaStatus, aulas: aulasDaTurma }]) => (
                <Card key={turmaId} className="mb-4">
                  <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-0">{turmaNome}</h5>
                      <small className="opacity-75">
                        Status: {turmaStatus}
                      </small>
                    </div>
                    <Badge bg="light" text="dark">
                      {aulasDaTurma.length} aulas
                    </Badge>
                  </Card.Header>
                  <Card.Body>
                    {aulasDaTurma.map((aula) => {
                      const isFutura = isAulaFutura(aula.data_hora);
                      return (
                        <div key={aula.id} className="mb-3 pb-3 border-bottom">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <h6 className="mb-0">
                                  {aula.topico || "Aula sem tópico"}
                                </h6>
                                {isFutura && <Badge bg="info">Em breve</Badge>}
                              </div>
                              <p className="text-muted small mb-1">
                                {aula.descricao || "Sem descrição"}
                              </p>
                              <div className="d-flex flex-wrap align-items-center gap-2">
                                <span className="text-muted small">
                                  📅 {formatarData(aula.data_hora)}
                                </span>
                                <span>•</span>
                                {getStatusBadge(aula.turma_status)}
                              </div>
                            </div>
                          </div>
                          {/* Presença */}
                          <div className="mt-2">
                            <small className="text-muted me-2">Presença:</small>
                            {getPresencaBadge(aula.presenca)}
                            {aula.presenca?.observacoes && (
                              <small className="text-muted ms-2">
                                Obs: {aula.presenca.observacoes}
                              </small>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </Card.Body>
                </Card>
              ),
            )}
          </div>

          {/* Visualização em Tabela (Desktop) */}
          <div className="d-none d-md-block">
            <div className="table-responsive">
              <Table striped bordered hover className="align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Turma</th>
                    <th>Tópico</th>
                    <th>Descrição</th>
                    <th>Data/Hora</th>
                    <th>Status</th>
                    <th>Presença</th>
                    <th>Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {aulasFiltradas.map((aula) => (
                    <tr key={aula.id}>
                      <td>
                        <strong>{aula.turma_nome}</strong>
                        <br />
                        <small className="text-muted">
                          {aula.turma_status}
                        </small>
                      </td>
                      <td>{aula.topico || "-"}</td>
                      <td>{aula.descricao || "-"}</td>
                      <td>{formatarData(aula.data_hora)}</td>
                      <td>{getStatusBadge(aula.turma_status)}</td>
                      <td>{getPresencaBadge(aula.presenca)}</td>
                      <td>
                        <small className="text-muted">
                          {aula.presenca?.observacoes || "-"}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>

          {/* Estatísticas */}
          <Row className="mt-4">
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center">
                <Card.Body>
                  <h5 className="text-primary">{aulas.length}</h5>
                  <p className="text-muted small mb-0">Total de Aulas</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center">
                <Card.Body>
                  <h5 className="text-warning">
                    {
                      aulas.filter(
                        (a) =>
                          a.turma_status === "PROGRAMADA" &&
                          isAulaFutura(a.data_hora),
                      ).length
                    }
                  </h5>
                  <p className="text-muted small mb-0">Próximas Aulas</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center">
                <Card.Body>
                  <h5 className="text-success">
                    {aulas.filter((a) => a.turma_status === "REALIZADA").length}
                  </h5>
                  <p className="text-muted small mb-0">Aulas Realizadas</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card className="text-center">
                <Card.Body>
                  <h5 className="text-danger">
                    {aulas.filter((a) => a.turma_status === "CANCELADA").length}
                  </h5>
                  <p className="text-muted small mb-0">Aulas Canceladas</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
