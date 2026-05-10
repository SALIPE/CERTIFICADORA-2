import { useEffect, useState } from 'react';
import { Alert, Button, Container, Spinner, Table } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { del, get, post } from '../../services/WebService';
import { Turma } from '../../types/Turma';

export default function MatriculaAluno() {
  const { alunoId } = useParams<{ alunoId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const alunoNome = (location.state as any)?.alunoNome || 'Aluno';

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turmasMatriculadas, setTurmasMatriculadas] = useState<String[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (alunoId) {
      fetchTurmas();
      fetchTurmasMatriculadas();
    }
  }, [alunoId]);

  const fetchTurmas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await get(`/turmas`);
      setTurmas(response || []);
    } catch (error) {
      setError('Erro ao buscar turmas');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTurmasMatriculadas = async () => {
    try {
      setLoading(true);
      const response = await get(`/matriculas/aluno/${alunoId}`);
      // Extrai apenas os IDs das turmas onde o aluno está matriculado
      const turmaIds = response?.map((matricula: any) => matricula.turma_id) || [];
      setTurmasMatriculadas(turmaIds);
    } catch (error) {
      console.error('Erro ao buscar matrículas:', error);
      setTurmasMatriculadas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMatricular = async (turmaId: string) => {
    try {
      setError(null);
      setSuccess(null);
      await post(`/matriculas`, {
        aluno_id: alunoId,
        turma_id: turmaId,
      });
      setSuccess(`Aluno matriculado com sucesso na turma!`);
      await fetchTurmasMatriculadas();
    } catch (error) {
      setError('Erro ao matricular aluno');
      console.error('Erro:', error);
    }
  };

  const handleDesmatricular = async (turmaId: string) => {
    try {
      setError(null);
      setSuccess(null);
      await del(`/matriculas?alunoId=${alunoId}&turmaId=${turmaId}`);
      setSuccess(`Aluno desmatriculado com sucesso da turma!`);
      await fetchTurmasMatriculadas();
    } catch (error) {
      setError('Erro ao desmatricular aluno');
      console.error('Erro:', error);
    }
  };

  const isMatriculado = (turmaId: string): boolean => {
    return turmasMatriculadas.includes(turmaId);
  };

  return (
    <Container fluid className="admin-dashboard py-4">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/admin/alunos')}>
            ← Voltar
          </Button>
          <h1 className="mt-3">Matrículas - {alunoNome}</h1>
          <p className="text-muted">Gerenciamento de matrículas do aluno nas turmas</p>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
        </div>
      ) : turmas.length === 0 ? (
        <Alert variant="info">Nenhuma turma cadastrada</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="align-middle">
            <thead className="table-dark">
              <tr>
                <th>Nome da Turma</th>
                <th>Descrição</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {turmas.map((turma) => {
                const matriculado = isMatriculado(turma.id);
                return (
                  <tr key={turma.id}>
                    <td><strong>{turma.nome}</strong></td>
                    <td>{turma.descricao || '-'}</td>
                    <td>
                      {matriculado ? (
                        <span className="badge bg-success">Matriculado</span>
                      ) : (
                        <span className="badge bg-secondary">Não Matriculado</span>
                      )}
                    </td>
                    <td>
                      {matriculado ? (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDesmatricular(turma.id)}
                        >
                          Desmatricular
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleMatricular(turma.id)}
                        >
                          Matricular
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
}
