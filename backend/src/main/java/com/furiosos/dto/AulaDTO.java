package com.furiosos.dto;

import java.util.Date;
import java.util.UUID;

public class AulaDTO {

    private String id;
    private String turma_id;
    private Date data_hora;
    private String topico;
    private String descricao;
    private String status;
    private Date criado_em;
    private Date atualizado_em;

    public AulaDTO() {
    }

    public AulaDTO(UUID id, UUID turma_id, Date data_hora, String topico, String descricao, String status,
            Date criado_em, Date atualizado_em) {
        this.id = id.toString();
        this.turma_id = turma_id.toString();
        this.data_hora = data_hora;
        this.topico = topico;
        this.descricao = descricao;
        this.status = status;
        this.criado_em = criado_em;
        this.atualizado_em = atualizado_em;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTurma_id() {
        return turma_id;
    }

    public void setTurma_id(String turma_id) {
        this.turma_id = turma_id;
    }

    public Date getData_hora() {
        return data_hora;
    }

    public void setData_hora(Date data_hora) {
        this.data_hora = data_hora;
    }

    public String getTopico() {
        return topico;
    }

    public void setTopico(String topico) {
        this.topico = topico;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
}
