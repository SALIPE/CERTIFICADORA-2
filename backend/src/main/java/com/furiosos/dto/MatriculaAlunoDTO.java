package com.furiosos.dto;

import java.util.Date;
import java.util.UUID;

public class MatriculaAlunoDTO {

    private UUID id;
    private UUID aluno_id;
    private UUID turma_id;
    private Date criado_em;
    private String aluno_nome;
    private String turma_nome;

    public MatriculaAlunoDTO() {
    }

    public MatriculaAlunoDTO(UUID id, UUID aluno_id, UUID turma_id, Date criado_em) {
        this.id = id;
        this.aluno_id = aluno_id;
        this.turma_id = turma_id;
        this.criado_em = criado_em;
    }

    public MatriculaAlunoDTO(UUID id, UUID aluno_id, UUID turma_id, Date criado_em, String aluno_nome, String turma_nome) {
        this.id = id;
        this.aluno_id = aluno_id;
        this.turma_id = turma_id;
        this.criado_em = criado_em;
        this.aluno_nome = aluno_nome;
        this.turma_nome = turma_nome;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getAluno_id() {
        return aluno_id;
    }

    public void setAluno_id(UUID aluno_id) {
        this.aluno_id = aluno_id;
    }

    public UUID getTurma_id() {
        return turma_id;
    }

    public void setTurma_id(UUID turma_id) {
        this.turma_id = turma_id;
    }

    public Date getCriado_em() {
        return criado_em;
    }

    public void setCriado_em(Date criado_em) {
        this.criado_em = criado_em;
    }

    public String getAluno_nome() {
        return aluno_nome;
    }

    public void setAluno_nome(String aluno_nome) {
        this.aluno_nome = aluno_nome;
    }

    public String getTurma_nome() {
        return turma_nome;
    }

    public void setTurma_nome(String turma_nome) {
        this.turma_nome = turma_nome;
    }
}
