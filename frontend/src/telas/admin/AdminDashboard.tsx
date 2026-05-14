import { useEffect, useState } from 'react';
import { Alert, Button, Container, Form, Modal, Spinner, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { get, post } from '../../services/WebService';
import { Turma } from '../../types/Turma';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    status: 'ATIVA',
  });

  useEffect(() => {
    fetchTurmas();
  }, []);

  const fetchTurmas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await get("/turmas");
      setTurmas(response || []);
    } catch (error) {
      setError('Erro ao buscar turmas');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setEditingId(null);
    setFormData({
      nome: '',
      descricao: '',
      status: 'ATIVA',
    });
    setShowModal(true);
  };

  const handleEditModal = (turma: Turma) => {
    setEditingId(turma.id);
    setFormData({
      nome: turma.nome,
      descricao: turma.descricao,
      status: turma.status,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateTurma = async () => {
    try {
      setError(null);
      if (editingId) {
        await post(`/turmas/${editingId}`, formData);
      } else {
        await post('/turmas', formData);
      }
      await fetchTurmas();
      handleCloseModal();
    } catch (error) {
      setError(editingId ? 'Erro ao atualizar turma' : 'Erro ao criar turma');
      console.error('Erro:', error);
    }
  };

  const handleGerenciarAulas = (turmaId: string, turmaNome: string) => {
    navigate(`/admin/aulas/${turmaId}`, { state: { turmaNome } });
  };

  const getStatusBadge = (status: string) => {
    const badgeClass = status === 'ATIVA' ? 'badge bg-success' :
      status === 'CANCELADA' ? 'badge bg-danger' :
        'badge bg-warning';
    return <span className={badgeClass}>{status}</span>;
  };

  return (
    <Container fluid className="admin-dashboard py-4">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <p className="text-muted">Selecione uma turma para gerenciar suas aulas</p>
        </div>
        <Button variant="success" onClick={handleOpenModal}>
          + Nova Turma
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

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
                <th>Nome</th>
                <th>Descrição</th>
                <th>Status</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {turmas.map((turma) => (
                <tr key={turma.id}>
                  <td><strong>{turma.nome}</strong></td>
                  <td>{turma.descricao}</td>
                  <td>{getStatusBadge(turma.status)}</td>
                  <td>{new Date(turma.criado_em).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleGerenciarAulas(turma.id, turma.nome)}
                    >
                      Gerenciar Aulas
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleEditModal(turma)}
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Editar Turma' : 'Nova Turma'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome *</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Ex: Turma A - Nível 1"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descrição *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Descreva a turma"
                required
              />
            </Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>Status *</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="ATIVA">Ativa</option>
                <option value="CONCLUIDA">Concluída</option>
                <option value="CANCELADA">Cancelada</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateTurma}>
            {editingId ? 'Atualizar Turma' : 'Criar Turma'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
