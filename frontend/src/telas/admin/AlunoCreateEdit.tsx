import { useEffect, useState } from 'react';
import { Alert, Button, Container, Form, Modal, Spinner, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { get, post } from '../../services/WebService';
import { Usuario } from '../../types/Usuario';

export default function AlunoCreateEdit() {
    const navigate = useNavigate();

    const [alunos, setAlunos] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        perfil: 'ALUNO',
    });

    useEffect(() => {
        fetchAlunos();
    }, []);

    const fetchAlunos = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await get(`/alunos`);
            setAlunos(response || []);
        } catch (error) {
            setError('Erro ao buscar alunos');
            console.error('Erro:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        setFormData({
            nome: '',
            email: '',
            senha: '',
            perfil: 'ALUNO',
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            nome: '',
            email: '',
            senha: '',
            perfil: 'ALUNO',
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveAluno = async () => {
        try {
            setError(null);
            await post(`/alunos`, formData);
            await fetchAlunos();
            handleCloseModal();
        } catch (error) {
            setError('Erro ao salvar aluno');
            console.error('Erro:', error);
        }
    };

    return (
        <Container fluid className="admin-dashboard py-4">
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <Button variant="secondary" size="sm" onClick={() => navigate('/admin/dashboard')}>
                        ← Voltar
                    </Button>
                    <h1 className="mt-3">Alunos</h1>
                    <p className="text-muted">Gerenciamento de alunos</p>
                </div>
                <Button variant="success" onClick={() => handleOpenModal()}>
                    + Novo Aluno
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </Spinner>
                </div>
            ) : alunos.length === 0 ? (
                <Alert variant="info">Nenhum aluno cadastrado</Alert>
            ) : (
                <div className="table-responsive">
                    <Table striped bordered hover className="align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Perfil</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alunos.map((aluno) => (
                                <tr key={aluno.usuario_id}>
                                    <td><strong>{aluno.nome}</strong></td>
                                    <td>{aluno.email}</td>
                                    <td>{aluno.perfil}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Novo Aluno</Modal.Title>
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
                                placeholder="Nome completo"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email *</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="email@exemplo.com"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Senha *</Form.Label>
                            <Form.Control
                                type="password"
                                name="senha"
                                value={formData.senha}
                                onChange={handleInputChange}
                                placeholder="Senha"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Perfil *</Form.Label>
                            <Form.Select
                                name="perfil"
                                value={formData.perfil}
                                onChange={handleInputChange}
                            >
                                <option value="ALUNO">Aluno</option>
                                <option value="ADMIN">Administrador</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSaveAluno}>
                        Criar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
