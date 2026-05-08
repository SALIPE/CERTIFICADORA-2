package com.furiosos.dto;

import java.util.Date;
import java.util.UUID;

public class TurmaDTO {

    private UUID id;
    private String nome;
    private String descricao;
    private String status;
    private Date criado_em;
    private Date atualizado_em;

    public TurmaDTO() {
    }

    public TurmaDTO(UUID id, String nome, String descricao, String status, Date criado_em,
            Date atualizado_em) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.status = status;
        this.criado_em = criado_em;
        this.atualizado_em = atualizado_em;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
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
