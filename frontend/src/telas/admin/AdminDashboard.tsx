import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { get } from '../../services/WebService';
import { Turma } from '../../types/Turma';

export default function AdminDashboard() {

  const [turmas, setTurmas] = useState<Turma[]>([]);

  useEffect(() => {
    fecthTurmas();
  }, []);

  const fecthTurmas = async () => {
    try {
      const response = await get("/turmas")
      console.log(response)

      setTurmas(response);
    } catch (error) {
      console.error('Erro ao buscar oficinas:', error);
    }
  };

  return (
    <Container fluid className="admin-dashboard py-4">



    </Container>
  );
}


