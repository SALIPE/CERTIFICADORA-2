package com.furiosos.models;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;

@Entity
@Table(name = "turma")
public class Turma implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private UUID id;
    private String nome;
    private String descricao;

    @Enumerated(EnumType.STRING)
    private StatusTurma status;

    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
    private Date criado_em;

    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
    private Date atualizado_em;

    @OneToMany(mappedBy = "turma", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Aula> aulas;

    public Turma() {
    }

    public Turma(UUID id, String nome, String descricao, StatusTurma status, Date criado_em, Date atualizado_em) {
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

    public StatusTurma getStatus() {
        return status;
    }

    public void setStatus(StatusTurma status) {
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

    public List<Aula> getAulas() {
        return aulas;
    }

    public void setAulas(List<Aula> aulas) {
        this.aulas = aulas;
    }

    public enum StatusTurma {
        ATIVA, CONCLUIDA, CANCELADA
    }
}

