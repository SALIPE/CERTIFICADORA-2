package com.furiosos.dto;

import java.util.Date;
import java.util.UUID;

public class PresencaAlunoDTO {

    private UUID id;
    private UUID aluno_id;
    private UUID aula_id;
    private String status_presenca;
    private String observacoes;
    private Date criado_em;
    private Date atualizado_em;
    private String aluno_nome;
    private Date aula_data_hora;

    public PresencaAlunoDTO() {
    }

    public PresencaAlunoDTO(UUID id, UUID aluno_id, UUID aula_id, String status_presenca, String observacoes,
                            Date criado_em, Date atualizado_em) {
        this.id = id;
        this.aluno_id = aluno_id;
        this.aula_id = aula_id;
        this.status_presenca = status_presenca;
        this.observacoes = observacoes;
        this.criado_em = criado_em;
        this.atualizado_em = atualizado_em;
    }

    public PresencaAlunoDTO(UUID id, UUID aluno_id, UUID aula_id, String status_presenca, String observacoes,
                            Date criado_em, Date atualizado_em, String aluno_nome, Date aula_data_hora) {
        this.id = id;
        this.aluno_id = aluno_id;
        this.aula_id = aula_id;
        this.status_presenca = status_presenca;
        this.observacoes = observacoes;
        this.criado_em = criado_em;
        this.atualizado_em = atualizado_em;
        this.aluno_nome = aluno_nome;
        this.aula_data_hora = aula_data_hora;
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

    public UUID getAula_id() {
        return aula_id;
    }

    public void setAula_id(UUID aula_id) {
        this.aula_id = aula_id;
    }

    public String getStatus_presenca() {
        return status_presenca;
    }

    public void setStatus_presenca(String status_presenca) {
        this.status_presenca = status_presenca;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public Date getCriado_em() {
        return criado_em;
    }

    public void setCriado_em(Date criado_em) {
        this.criado_em = criado_em;
    }

    public Date getAtualizado_em() {
        return atualizado_em;
    }

    public void setAtualizado_em(Date atualizado_em) {
        this.atualizado_em = atualizado_em;
    }

    public String getAluno_nome() {
        return aluno_nome;
    }

    public void setAluno_nome(String aluno_nome) {
        this.aluno_nome = aluno_nome;
    }

    public Date getAula_data_hora() {
        return aula_data_hora;
    }

    public void setAula_data_hora(Date aula_data_hora) {
        this.aula_data_hora = aula_data_hora;
    }
}
