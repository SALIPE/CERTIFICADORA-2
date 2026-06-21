import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Container,
  Form,
  Spinner,
  Table,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { get } from "../../services/WebService";

interface Aula {
  id: string;
  data_hora: string;
  topico: string;
  descricao: string;
  turma_id: string;
  turma_nome?: string;
}

interface Turma {
  id: string;
  nome: string;
}

export default function AulasMatriculadas() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [aulasTodas, setAulasTodas] = useState<Aula[]>([]);
  const [aulasFiltradas, setAulasFiltradas] = useState<Aula[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>("TODAS");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.usuario_id) {
      carregarCronogramaCompleto(user.usuario_id);
    }
  }, [user]);

  useEffect(() => {
    if (turmaSelecionada === "TODAS") {
      setAulasFiltradas(aulasTodas);
    } else {
      setAulasFiltradas(
        aulasTodas.filter((aula) => aula.turma_id === turmaSelecionada),
      );
    }
  }, [turmaSelecionada, aulasTodas]);

  const carregarCronogramaCompleto = async (alunoId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Busca as matrículas do aluno
      const responseMatriculas = await get(
        `/furiosos/matriculas/aluno/${alunoId}`,
      );

      // Garante que se o backend retornar vazio ou um formato inesperado, o front não quebre
      const listaMatriculas = Array.isArray(responseMatriculas)
        ? responseMatriculas
        : [];

      if (listaMatriculas.length === 0) {
        setLoading(false);
        return;
      }

      // Mapeia as turmas tratando o objeto 'turma' de forma flexível
      const listaTurmas: Turma[] = listaMatriculas
        .map((item: any) => {
          const dadosTurma = item.turma || item;
          return {
            id: dadosTurma.id || dadosTurma.id_turma,
            nome: dadosTurma.nome || "Turma sem Nome",
          };
        })
        .filter((t) => t.id); // Remove registros fantasmas sem ID

      setTurmas(listaTurmas);

      // Busca as aulas de cada turma em paralelo
      const promessasAulas = listaTurmas.map(async (turma) => {
        try {
          const responseAulas = await get(`/furiosos/aulas/turma/${turma.id}`);
          const aulasDaTurma = Array.isArray(responseAulas)
            ? responseAulas
            : [];

          return aulasDaTurma.map((aula: any) => ({
            ...aula,
            turma_id: turma.id,
            turma_nome: turma.nome,
          }));
        } catch (e) {
          console.error(`Erro ao buscar aulas da turma ${turma.nome}:`, e);
          return [];
        }
      });

      const resultadosAulas = await Promise.all(promessasAulas);
      const todasAsAulas = resultadosAulas.flat();

      // Ordena por data (mais recentes primeiro)
      todasAsAulas.sort(
        (a, b) =>
          new Date(b.data_hora).getTime() - new Date(a.data_hora).getTime(),
      );

      setAulasTodas(todasAsAulas);
      setAulasFiltradas(todasAsAulas);
    } catch (err) {
      setError("Não foi possível carregar o seu cronograma de aulas completo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      {/* BANNER DE CABEÇALHO */}
      <Card className="border-0 shadow-sm mb-4 bg-dark text-white">
        <Card.Body className="d-flex justify-content-between align-items-center p-4 flex-wrap gap-3">
          <div>
            <span
              className="text-success fw-bold text-uppercase tracking-wider"
              style={{ fontSize: "0.85rem" }}
            >
              Meu Painel
            </span>
            <h2 className="fw-bold m-0 mt-1">
              🗓️ Meu Cronograma Geral de Aulas
            </h2>
            <p className="text-light-50 m-0 small mt-1">
              Acompanhe abaixo todas as aulas das turmas em que você está
              inscrito.
            </p>
          </div>
          {/* ROTA ATUALIZADA AQUI: Aponta para /alunos/gerenciar */}
          <Button
            variant="success"
            className="fw-semibold px-4"
            onClick={() => navigate("/alunos/gerenciar")}
          >
            ⚙️ Gerenciar Minhas Turmas
          </Button>
        </Card.Body>
      </Card>

      {/* RENDERIZAÇÃO CONDICIONAL BLINDADA */}
      {error && (
        <Alert variant="danger" className="shadow-sm border-0">
          ⚠️ {error}
        </Alert>
      )}

      {!error && (
        <>
          {/* SELETOR DE FILTRO */}
          <Card className="border-0 shadow-sm p-3 mb-4 bg-white">
            <Form.Group className="d-flex align-items-center gap-3 flex-wrap">
              <Form.Label className="m-0 fw-bold text-secondary">
                Filtrar por Turma:
              </Form.Label>
              <Form.Select
                style={{ maxWidth: "300px" }}
                value={turmaSelecionada}
                onChange={(e) => setTurmaSelecionada(e.target.value)}
              >
                <option value="TODAS">🌟 Todas as Minhas Turmas</option>
                {turmas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Card>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
              <p className="text-muted mt-2 small">Carregando cronograma...</p>
            </div>
          ) : aulasFiltradas.length === 0 ? (
            <Alert variant="info" className="shadow-sm border-0">
              ✨ Nenhuma aula encontrada para o filtro selecionado ou você não
              possui turmas vinculadas.
            </Alert>
          ) : (
            /* TABELA DE AULAS */
            <Card className="border-0 shadow-sm overflow-hidden bg-white">
              <div className="table-responsive">
                <Table
                  striped
                  hover
                  className="align-middle m-0 table-borderless"
                >
                  <thead className="table-dark">
                    <tr>
                      <th className="py-3 ps-4">Data e Horário</th>
                      <th className="py-3">Turma</th>
                      <th className="py-3">Tópico / Assunto</th>
                      <th className="py-3">Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aulasFiltradas.map((aula) => (
                      <tr key={aula.id} className="border-bottom">
                        <td className="py-3 ps-4">
                          <strong>
                            {new Date(aula.data_hora).toLocaleDateString(
                              "pt-BR",
                            )}
                          </strong>
                          <br />
                          <small className="text-muted">
                            {new Date(aula.data_hora).toLocaleTimeString(
                              "pt-BR",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                            h
                          </small>
                        </td>
                        <td>
                          <span className="badge bg-secondary px-2 py-1">
                            {aula.turma_nome}
                          </span>
                        </td>
                        <td>
                          <strong>
                            {aula.topico || "Sem tópico informado"}
                          </strong>
                        </td>
                        <td className="text-muted small">
                          {aula.descricao || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          )}
        </>
      )}
    </Container>
  );
}
