export type UserRole = 'ADMIN' | 'ALUNO';

export interface Usuario {
  usuario_id: string;
  nome: string;
  email: string;
  perfil: UserRole;
}

export interface UserContextType {
  user: Usuario | null;
  login: (email: string, password: string) => Promise<string | null>;
  createAluno: (name: string, email: string, password: string) => void;
  createUsuario: (name: string, email: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAluno: boolean;
}
