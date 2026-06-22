export interface Aula {
  id: string;
  turma_id: string;
  data_hora: string;
  topico: string;
  descricao: string;
  status: string;
  criado_em: string;
  atualizado_em: string;
}

export interface Frequencia {
  aluno_id?: string;
  aluno_nome: string;
  frequencia_percentual: string;
  frequencia_valor?: number;
}



