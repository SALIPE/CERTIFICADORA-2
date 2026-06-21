
export interface AlunoTurma {
  aluno_id: string;
  turma_id: string;
  aluno_nome: string;
  turma_nome: string;
}

export interface PresencaAluno {
  id?: string;
  aluno_id: string;
  aula_id: string;
  aluno_nome: string;
  status_presenca: string;
  observacoes: string;
}




