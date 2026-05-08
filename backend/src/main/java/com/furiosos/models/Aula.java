package com.furiosos.models;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;

@Entity
@Table(name = "aula")
public class Aula implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private UUID id;

    @Column(name = "turma_id", nullable = false)
    private UUID turma_id;

    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
    @Column(name = "data_hora", nullable = false)
    private Date data_hora;

    private String topico;
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "status_aula")
    private StatusAula status;

    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
    private Date criado_em;

    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
    private Date atualizado_em;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turma_id", insertable = false, updatable = false)
    private Turma turma;

    @OneToMany(mappedBy = "aula", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PresencaAluno> presenças;

    public Aula() {
    }

    public Aula(UUID id, UUID turma_id, Date data_hora, String topico, String descricao, Date criado_em,
            Date atualizado_em) {
        this.id = id;
        this.turma_id = turma_id;
        this.data_hora = data_hora;
        this.topico = topico;
        this.descricao = descricao;
        this.criado_em = criado_em;
        this.atualizado_em = atualizado_em;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getTurma_id() {
        return turma_id;
    }

    public void setTurma_id(UUID turma_id) {
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

    public Turma getTurma() {
        return turma;
    }

    public void setTurma(Turma turma) {
        this.turma = turma;
    }

    public List<PresencaAluno> getPresenças() {
        return presenças;
    }

    public void setPresenças(List<PresencaAluno> presenças) {
        this.presenças = presenças;
    }

    public String getStatus() {
        return status != null ? status.toString() : null;
    }

    public void setStatus(String status) {
        if (status != null) {
            this.status = StatusAula.valueOf(status.toUpperCase());
        }
    }

    public enum StatusAula {
        PROGRAMADA, REALIZADA, CANCELADA
    }
}
