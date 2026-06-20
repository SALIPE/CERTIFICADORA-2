// src/telas/alunos/AulasMatriculadas.tsx

import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
  Table,
} from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";

// DADOS MOCKADOS PARA TESTE VISUAL
const MOCK_TURMA = {
  id: "123",
  nome: "Turma Kids - Nível 1",
  descricao: "Turma iniciante de cheerleading",
  status: "ATIVA",
};

const MOCK_AULAS = [
  {
    id: "1",
    turma_id: "123",
    data_hora: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 dias depois
    topico: "Aula 1 - Introdução ao Cheerleading",
    descricao: "Fundamentos básicos do esporte, postura e movimentos iniciais",
    status: "PROGRAMADA",
    criado_em: new Date().toISOString(),
  },
  {
    id: "2",
    turma_id: "123",
    data_hora: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 dias atrás
    topico: "Aula 2 - Acrobacias Básicas",
    descricao: "Técnicas de base para acrobacias, segurança e quedas",
    status: "REALIZADA",
    criado_em: new Date().toISOString(),
  },
  {
    id: "3",
    turma_id: "123",
    data_hora: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 dias atrás
    topico: "Aula 3 - Coreografia",
    descricao: "Montagem da coreografia para apresentação",
    status: "REALIZADA",
    criado_em: new Date().toISOString(),
  },
  {
    id: "4",
    turma_id: "123",
    data_hora: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 dias depois
    topico: "Aula 4 - Treino de Força",
    descricao: "Exercícios de fortalecimento muscular para cheerleading",
    status: "PROGRAMADA",
    criado_em: new Date().toISOString(),
  },
  {
    id: "5",
    turma_id: "123",
    data_hora: new Date(Date.now() - 86400000 * 14).toISOString(), // 14 dias atrás
    topico: "Aula 5 - Apresentação Final",
    descricao: "Ensaio geral e apresentação para os pais",
    status: "CANCELADA",
    criado_em: new Date().toISOString(),
  },
];

const MOCK_PRESENCAS = [
  { aula_id: "2", status_presenca: "PRESENTE" },
  { aula_id: "3", status_presenca: "AUSENTE" },
  { aula_id: "5", status_presenca: "FALTA_JUSTIFICADA" },
];

export default function AulasMatriculadas() {
  const navigate = useNavigate();
  const { turmaId } = useParams<{ turmaId: string }>();
  const location = useLocation();

  const [filterStatus, setFilterStatus] = useState<string>("TODAS");

  // Usa os dados mockados
  const turma = MOCK_TURMA;
  const aulas = MOCK_AULAS;
  const presencas = MOCK_PRESENCAS;
  const turmaNome = (location.state as any)?.turmaNome || turma.nome;

  // Combina os dados
  const aulasCompletas = aulas.map((aula) => ({
    ...aula,
    turma_nome: turma.nome,
    turma_status: turma.status,
    presenca: presencas.find((p) => p.aula_id === aula.id),
  }));

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { class: string; label: string }> = {
      PROGRAMADA: { class: "bg-warning", label: "Programada" },
      REALIZADA: { class: "bg-success", label: "Realizada" },
      CANCELADA: { class: "bg-danger", label: "Cancelada" },
    };
    const info = statusMap[status] || { class: "bg-secondary", label: status };
    return <Badge className={info.class}>{info.label}</Badge>;
  };

  const getPresencaBadge = (presenca?: { status_presenca: string }) => {
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
      ? aulasCompletas
      : aulasCompletas.filter((aula) => aula.status === filterStatus);

  const totalAulas = aulasCompletas.length;
  const aulasRealizadas = aulasCompletas.filter(
    (a) => a.status === "REALIZADA",
  ).length;
  const aulasProgramadas = aulasCompletas.filter(
    (a) => a.status === "PROGRAMADA",
  ).length;
  const aulasCanceladas = aulasCompletas.filter(
    (a) => a.status === "CANCELADA",
  ).length;
  const proximasAulas = aulasCompletas.filter(
    (a) => a.status === "PROGRAMADA" && isAulaFutura(a.data_hora),
  ).length;

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h1 className="mb-1">📚 Aulas - {turmaNome}</h1>
            <p className="text-muted">Olá, Aluno Teste! Acompanhe suas aulas</p>
            <div className="mt-1">
              <Badge bg="secondary">Status da Turma: {turma.status}</Badge>
            </div>
          </div>
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/alunos/turmas")}
          >
            ← Voltar para Turmas
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-2">
          <Card className="text-center bg-primary text-white">
            <Card.Body>
              <h4>{totalAulas}</h4>
              <small>Total de Aulas</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-2">
          <Card className="text-center bg-success text-white">
            <Card.Body>
              <h4>{aulasRealizadas}</h4>
              <small>Aulas Realizadas</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-2">
          <Card className="text-center bg-warning text-dark">
            <Card.Body>
              <h4>{proximasAulas}</h4>
              <small>Próximas Aulas</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-2">
          <Card className="text-center bg-info text-white">
            <Card.Body>
              <h4>75%</h4>
              <small>Frequência</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filtros */}
      <div className="mb-4">
        <div className="d-flex flex-wrap gap-2">
          <Button
            variant={filterStatus === "TODAS" ? "primary" : "outline-primary"}
            size="sm"
            onClick={() => setFilterStatus("TODAS")}
          >
            Todas ({totalAulas})
          </Button>
          <Button
            variant={
              filterStatus === "PROGRAMADA" ? "warning" : "outline-warning"
            }
            size="sm"
            onClick={() => setFilterStatus("PROGRAMADA")}
          >
            📅 Programadas ({aulasProgramadas})
          </Button>
          <Button
            variant={
              filterStatus === "REALIZADA" ? "success" : "outline-success"
            }
            size="sm"
            onClick={() => setFilterStatus("REALIZADA")}
          >
            ✅ Realizadas ({aulasRealizadas})
          </Button>
          <Button
            variant={filterStatus === "CANCELADA" ? "danger" : "outline-danger"}
            size="sm"
            onClick={() => setFilterStatus("CANCELADA")}
          >
            ❌ Canceladas ({aulasCanceladas})
          </Button>
        </div>
      </div>

      {/* Visualização em Cards (Mobile) */}
      <div className="d-block d-md-none">
        {aulasFiltradas.map((aula) => {
          const isFutura = isAulaFutura(aula.data_hora);
          return (
            <Card key={aula.id} className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <h6 className="mb-0">{aula.topico}</h6>
                      {isFutura && <Badge bg="info">Em breve</Badge>}
                    </div>
                    <p className="text-muted small mb-1">{aula.descricao}</p>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <span className="text-muted small">
                        📅 {formatarData(aula.data_hora)}
                      </span>
                      <span>•</span>
                      {getStatusBadge(aula.status)}
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <small className="text-muted me-2">Presença:</small>
                  {getPresencaBadge(aula.presenca)}
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>

      {/* Visualização em Tabela (Desktop) */}
      <div className="d-none d-md-block">
        <div className="table-responsive">
          <Table striped bordered hover className="align-middle">
            <thead className="table-dark">
              <tr>
                <th>Tópico</th>
                <th>Descrição</th>
                <th>Data/Hora</th>
                <th>Status</th>
                <th>Presença</th>
              </tr>
            </thead>
            <tbody>
              {aulasFiltradas.map((aula) => (
                <tr key={aula.id}>
                  <td>
                    <strong>{aula.topico}</strong>
                  </td>
                  <td>{aula.descricao}</td>
                  <td>{formatarData(aula.data_hora)}</td>
                  <td>{getStatusBadge(aula.status)}</td>
                  <td>{getPresencaBadge(aula.presenca)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Info de desenvolvimento */}
      <Alert variant="info" className="mt-4">
        <strong>📌 Modo de Desenvolvimento:</strong> Esta tela está usando dados
        mockados (fictícios) para visualização. Quando o backend estiver pronto,
        os dados reais aparecerão aqui.
      </Alert>
    </Container>
  );
}
