package com.furiosos.models;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.UniqueConstraint;

@Entity
@Table(name = "presenca_aluno", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "aluno_id", "aula_id" })
})
public class PresencaAluno implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private UUID id;

    @Column(name = "aluno_id", nullable = false)
    private UUID aluno_id;

    @Column(name = "aula_id", nullable = false)
    private UUID aula_id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_presenca", nullable = false)
    private StatusPresenca status_presenca;

    private String observacoes;

    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
    private Date criado_em;

    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
    private Date atualizado_em;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", insertable = false, updatable = false)
    private User aluno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aula_id", insertable = false, updatable = false)
    private Aula aula;

    public PresencaAluno() {
    }

    public PresencaAluno(UUID id, UUID aluno_id, UUID aula_id, StatusPresenca status_presenca,
                         String observacoes, Date criado_em, Date atualizado_em) {
        this.id = id;
        this.aluno_id = aluno_id;
        this.aula_id = aula_id;
        this.status_presenca = status_presenca;
        this.observacoes = observacoes;
        this.criado_em = criado_em;
        this.atualizado_em = atualizado_em;
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

    public StatusPresenca getStatus_presenca() {
        return status_presenca;
    }

    public void setStatus_presenca(StatusPresenca status_presenca) {
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

    public User getAluno() {
        return aluno;
    }

    public void setAluno(User aluno) {
        this.aluno = aluno;
    }

    public Aula getAula() {
        return aula;
    }

    public void setAula(Aula aula) {
        this.aula = aula;
    }

    public enum StatusPresenca {
        PRESENTE, AUSENTE, FALTA_JUSTIFICADA
    }
}
