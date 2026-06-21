import { useEffect, useState } from 'react';
import { Alert, Button, Container, Form, Spinner, Table } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { get, post } from '../../services/WebService';
import { AlunoTurma, PresencaAluno } from '../../types/Alunos';

export default function ControlePresencaAula() {
  const { turmaId, aulaId } = useParams<{ turmaId: string, aulaId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [alunos, setAlunos] = useState<AlunoTurma[]>([]);
  const [presencas, setPresencas] = useState<PresencaAluno[]>([]);
  const [presencasSelecionadas, setPresencasSelecionadas] = useState<{ [key: string]: string }>({});
  const [presencasIds, setPresencasIds] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);


  useEffect(() => {
    fetchAlunos();
    fetchPresencas();
  }, [turmaId, aulaId]);

  const fetchAlunos = async () => {
    if (!turmaId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await get(`/matriculas/turma/${turmaId}`);

      setAlunos(response || []);
    } catch (error) {
      setError('Erro ao buscar alunos');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPresencas = async () => {
    if (!aulaId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await get(`/presencas/aula/${aulaId}`);
      setPresencas(response || []);

      // Inicializar presencas selecionadas com as já registradas
      const presencasMap: { [key: string]: string } = {};
      const idsMap: { [key: string]: string } = {};
      (response || []).forEach((presenca: PresencaAluno) => {
        presencasMap[presenca.aluno_id] = presenca.status_presenca;
        if (presenca.id) {
          idsMap[presenca.aluno_id] = presenca.id;
        }
      });
      setPresencasSelecionadas(presencasMap);
      setPresencasIds(idsMap);
    } catch (error) {
      setError('Erro ao buscar presencas');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePresencaAluno = async (aluno_id: string) => {
    if (!aulaId || !presencasSelecionadas[aluno_id]) {
      setError('Selecione um status para o aluno');
      return;
    }

    try {
      setSalvando(true);
      setError(null);
      setSuccess(null);

      const payload: any = {
        aluno_id: aluno_id,
        aula_id: aulaId,
        status_presenca: presencasSelecionadas[aluno_id]
      };

      // Incluir ID se existir (para update)
      if (presencasIds[aluno_id]) {
        payload.id = presencasIds[aluno_id];
      }

      await post('/presencas', payload);
      const action = presencasIds[aluno_id] ? 'atualizada' : 'registrada';
      setSuccess(`Presença ${action} com sucesso!`);

      // Atualizar a lista de presencas
      await fetchPresencas();

      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Erro ao registrar presença');
      console.error('Erro:', error);
    } finally {
      setSalvando(false);
    }
  };
  const getStatusBadge = (status: string) => {
    const badgeClass = status === 'PRESENTE' ? 'badge bg-success' :
      status === 'AUSENTE' ? 'badge bg-danger' :
        'badge bg-warning';
    return <span className={badgeClass}>{status}</span>;
  };

  return (
    <Container fluid className="admin-dashboard py-4">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <Button variant="secondary" size="sm" onClick={() => navigate(`/admin/aulas/${turmaId}`)}>
            ← Voltar
          </Button>
          <h1 className="mt-3">Presença Alunos</h1>
          <p className="text-muted">Gerenciamento de presença dessa aula</p>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
        </div>
      ) : alunos.length === 0 ? (
        <Alert variant="info">Nenhuma aluno cadastrada para esta turma</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="align-middle">
            <thead className="table-dark">
              <tr>
                <th>Nome Aluno</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => (
                <tr key={aluno.aluno_id}>
                  <td><strong>{aluno.aluno_nome}</strong></td>
                  <td>
                    {presencasSelecionadas[aluno.aluno_id] ? (
                      getStatusBadge(presencasSelecionadas[aluno.aluno_id])
                    ) : (
                      <span className="badge bg-secondary">Não marcado</span>
                    )}
                  </td>
                  <td>
                    <Form.Select
                      size="sm"
                      className="mb-2"
                      value={presencasSelecionadas[aluno.aluno_id] || ''}
                      onChange={(e) => setPresencasSelecionadas({
                        ...presencasSelecionadas,
                        [aluno.aluno_id]: e.target.value
                      })}
                    >
                      <option value="">Selecione o status</option>
                      <option value="PRESENTE">Presente</option>
                      <option value="AUSENTE">Ausente</option>
                      <option value="JUSTIFICADO">Justificado</option>
                    </Form.Select>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handlePresencaAluno(aluno.aluno_id)}
                      disabled={salvando || !presencasSelecionadas[aluno.aluno_id]}
                    >
                      {salvando ? 'Salvando...' : 'Registrar'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

    </Container>
  );
}
