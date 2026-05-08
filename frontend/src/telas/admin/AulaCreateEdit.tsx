import { useEffect, useState } from 'react';
import { Alert, Button, Container, Form, Modal, Spinner, Table } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { get, post } from '../../services/WebService';
import { Aula } from '../../types/Aula';

export default function AulaCreateEdit() {
  const { turmaId } = useParams<{ turmaId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const turmaNome = (location.state as any)?.turmaNome || 'Turma';

  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAula, setEditingAula] = useState<Aula | null>(null);

  const [formData, setFormData] = useState({
    topico: '',
    descricao: '',
    data_hora: '',
    status: 'PROGRAMADA',
  });

  useEffect(() => {
    fetchAulas();
  }, [turmaId]);

  const fetchAulas = async () => {
    if (!turmaId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await get(`/aulas/turma/${turmaId}`);
      setAulas(response || []);
    } catch (error) {
      setError('Erro ao buscar aulas');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (aula: Aula | null = null) => {
    if (aula) {
      setEditingAula(aula);
      setFormData({
        topico: aula.topico,
        descricao: aula.descricao,
        data_hora: aula.data_hora,
        status: aula.status,
      });
    } else {
      setEditingAula(null);
      setFormData({
        topico: '',
        descricao: '',
        data_hora: '',
        status: 'PROGRAMADA',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAula(null);
    setFormData({
      topico: '',
      descricao: '',
      data_hora: '',
      status: 'PROGRAMADA',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveAula = async () => {
    try {
      setError(null);
      const payload = {
        ...formData,
        turma_id: turmaId
      };
      if (editingAula) {
        await post(`/aulas/${editingAula.id}`, payload);
      } else {
        await post(`/aulas`, payload);
      }
      await fetchAulas();
      handleCloseModal();
    } catch (error) {
      setError('Erro ao salvar aula');
      console.error('Erro:', error);
    }
  };

  const handleDeleteAula = async (aulaId: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta aula?')) {
      try {
        setError(null);
        await post(`/aulas/${aulaId}`);
        await fetchAulas();
      } catch (error) {
        setError('Erro ao deletar aula');
        console.error('Erro:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const badgeClass = status === 'REALIZADA' ? 'badge bg-success' :
      status === 'CANCELADA' ? 'badge bg-danger' :
        'badge bg-warning';
    return <span className={badgeClass}>{status}</span>;
  };

  return (
    <Container fluid className="admin-dashboard py-4">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/admin/dashboard')}>
            ← Voltar
          </Button>
          <h1 className="mt-3">Aulas - {turmaNome}</h1>
          <p className="text-muted">Gerenciamento de aulas desta turma</p>
        </div>
        <Button variant="success" onClick={() => handleOpenModal()}>
          + Nova Aula
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
        </div>
      ) : aulas.length === 0 ? (
        <Alert variant="info">Nenhuma aula cadastrada para esta turma</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="align-middle">
            <thead className="table-dark">
              <tr>
                <th>Tópico</th>
                <th>Descrição</th>
                <th>Data/Hora</th>
                <th>Status</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {aulas.map((aula) => (
                <tr key={aula.id}>
                  <td><strong>{aula.topico}</strong></td>
                  <td>{aula.descricao}</td>
                  <td>{new Date(aula.data_hora).toLocaleString('pt-BR')}</td>
                  <td>{getStatusBadge(aula.status)}</td>
                  <td>{new Date(aula.criado_em).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleOpenModal(aula)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteAula(aula.id)}
                    >
                      Deletar
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
          <Modal.Title>{editingAula ? 'Editar Aula' : 'Nova Aula'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tópico *</Form.Label>
              <Form.Control
                type="text"
                name="topico"
                value={formData.topico}
                onChange={handleInputChange}
                placeholder="Ex: Introdução ao tema"
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
                placeholder="Descreva o conteúdo da aula"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Data e Hora *</Form.Label>
              <Form.Control
                type="datetime-local"
                name="data_hora"
                value={formData.data_hora}
                onChange={handleInputChange}
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
                <option value="PROGRAMADA">Programada</option>
                <option value="REALIZADA">Realizada</option>
                <option value="CANCELADA">Cancelada</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveAula}>
            {editingAula ? 'Atualizar' : 'Criar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
