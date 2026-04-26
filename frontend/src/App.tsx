import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './assets/css/Index.css';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './contexts/UserContext';
import AdminLayout from './layouts/Admin';
import AlunosLayout from './layouts/AlunosLayout';
import AdminDashboard from './telas/admin/AdminDashboard';
import TurmasMatriculadas from './telas/alunos/TurmasMatriculadas';
import LandingPage from './telas/LandingPage';
import LoginPage from './telas/Login';

export const MySwal = withReactContent(Swal);

export default function App() {
  document.title = 'Furiosos Kids';

  return (
    <HashRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          <Route element={
            <ProtectedRoute requiredRole="ALUNO">
              <AlunosLayout />
            </ProtectedRoute>
          }>
            <Route path="/alunos/turmas" element={<TurmasMatriculadas />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </UserProvider>
    </HashRouter>
  );
}



