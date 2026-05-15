import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../services/WebService';
import { UserContextType, Usuario } from '../types/Usuario';

const URI = "http://localhost:8080"

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const navigate = useNavigate();
  // Carregar usuário do localStorage ao montar
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    try {
      const response = await post(`${URI}/furiosos/login`,
        { email, senha: password });
      let token = response.token;
      let user: Usuario = {
        usuario_id: response.usuario_id,
        nome: response.nome,
        email: response.email,
        perfil: response.perfil
      }

      setUser(user);

      localStorage.setItem('user', token);
      localStorage.setItem('currentUser', JSON.stringify(user));

      return user.perfil;
    } catch (error) {
      console.error('Erro no login:', error);
      return null;
    }
  };

  const createAluno = (nome: string, email: string, password: string) => {
    // Validações básicas
    if (!nome || !email || !password) {
      throw new Error('Nome, email e senha são obrigatórios');
    }

    if (password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    if (!email.includes('@')) {
      throw new Error('Email inválido');
    }

    // Simular verificação de email já registrado
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.some((u: Usuario) => u.email === email)) {
      throw new Error('Email já registrado');
    }


    // localStorage.setItem('users', JSON.stringify(existingUsers));

    // // Fazer login automático
    // setUser(newUser);
    // localStorage.setItem('currentUser', JSON.stringify(newUser));
  };

  const createUsuario = (nome: string, email: string, password: string) => {
    // Validações básicas
    if (!nome || !email || !password) {
      throw new Error('Nome, email e senha são obrigatórios');
    }

    if (password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    if (!email.includes('@')) {
      throw new Error('Email inválido');
    }

    // Simular verificação de email já registrado
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.some((u: Usuario) => u.email === email)) {
      throw new Error('Email já registrado');
    }


    // localStorage.setItem('users', JSON.stringify(existingUsers));

    // // Fazer login automático
    // setUser(newUser);
    // localStorage.setItem('currentUser', JSON.stringify(newUser));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    navigate("/login")
  };

  const value: UserContextType = {
    user,
    login,
    createAluno,
    createUsuario,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.perfil === 'ADMIN' || false,
    isAluno: user?.perfil === 'ALUNO' || false,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de UserProvider');
  }
  return context;
};
