CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'perfil_usuario') THEN
    CREATE TYPE perfil_usuario AS ENUM ('ADMIN', 'ALUNO');

END IF;

END $$;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    perfil perfil_usuario NOT NULL DEFAULT 'ALUNO',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_usuario_updated_at ON usuario;

CREATE TRIGGER trg_usuario_updated_at
BEFORE UPDATE ON usuario
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_usuario_email ON usuario (email);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_turma') THEN
    CREATE TYPE status_turma AS ENUM ('ATIVA', 'CONCLUIDA', 'CANCELADA');

END IF;

END $$;

CREATE TABLE IF NOT EXISTS turma (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    status status_turma NOT NULL DEFAULT 'ATIVA',
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_turma_updated_at ON turma;

CREATE TRIGGER trg_turma_updated_at
BEFORE UPDATE ON turma
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_turma_nome ON turma (nome);

CREATE INDEX IF NOT EXISTS idx_turma_status ON turma (status);

CREATE TABLE IF NOT EXISTS aula (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    turma_id UUID NOT NULL,
    data_hora TIMESTAMP NOT NULL,
    topico VARCHAR(255),
    descricao TEXT,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_aula_turma FOREIGN KEY (turma_id) REFERENCES turma (id) ON DELETE CASCADE
);

DROP TRIGGER IF EXISTS trg_aula_updated_at ON aula;

CREATE TRIGGER trg_aula_updated_at
BEFORE UPDATE ON aula
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_aula_turma_id ON aula (turma_id);

CREATE INDEX IF NOT EXISTS idx_aula_data_hora ON aula (data_hora);

CREATE TABLE IF NOT EXISTS matricula_aluno (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    aluno_id UUID NOT NULL,
    turma_id UUID NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_matricula_aluno FOREIGN KEY (aluno_id) REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT fk_matricula_turma FOREIGN KEY (turma_id) REFERENCES turma (id) ON DELETE CASCADE,
    CONSTRAINT uk_matricula_aluno_turma UNIQUE (aluno_id, turma_id)
);

CREATE INDEX IF NOT EXISTS idx_matricula_aluno_id ON matricula_aluno (aluno_id);

CREATE INDEX IF NOT EXISTS idx_matricula_turma_id ON matricula_aluno (turma_id);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_presenca') THEN
    CREATE TYPE status_presenca AS ENUM ('PRESENTE', 'AUSENTE', 'FALTA_JUSTIFICADA');

END IF;

END $$;

CREATE TABLE IF NOT EXISTS presenca_aluno (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    aluno_id UUID NOT NULL,
    aula_id UUID NOT NULL,
    status_presenca status_presenca NOT NULL DEFAULT 'AUSENTE',
    observacoes TEXT,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_presenca_aluno FOREIGN KEY (aluno_id) REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT fk_presenca_aula FOREIGN KEY (aula_id) REFERENCES aula (id) ON DELETE CASCADE,
    CONSTRAINT uk_presenca_aluno_aula UNIQUE (aluno_id, aula_id)
);

DROP TRIGGER IF EXISTS trg_presenca_updated_at ON presenca_aluno;

CREATE TRIGGER trg_presenca_updated_at
BEFORE UPDATE ON presenca_aluno
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_presenca_aluno_id ON presenca_aluno (aluno_id);

CREATE INDEX IF NOT EXISTS idx_presenca_aula_id ON presenca_aluno (aula_id);

CREATE INDEX IF NOT EXISTS idx_presenca_status ON presenca_aluno (status_presenca);

INSERT INTO
    usuario (
        nome,
        email,
        senha_hash,
        perfil
    )
VALUES (
        'admin',
        'admin@furiosos.com',
        '$2a$12$rHW3sKnEdpbIvfl1BFzgp.eGiYE4PKWDHPHhlR9Ny2T02KHrGahxq',
        'ADMIN'
    );