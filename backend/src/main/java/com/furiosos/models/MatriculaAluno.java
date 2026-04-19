package com.furiosos.models;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.UniqueConstraint;

@Entity
@Table(name = "matricula_aluno", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "aluno_id", "turma_id" })
})
public class MatriculaAluno implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private UUID id;

    @Column(name = "aluno_id", nullable = false)
    private UUID aluno_id;

    @Column(name = "turma_id", nullable = false)
    private UUID turma_id;

    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
    private Date criado_em;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", insertable = false, updatable = false)
    private User aluno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turma_id", insertable = false, updatable = false)
    private Turma turma;

    public MatriculaAluno() {
    }

    public MatriculaAluno(UUID id, UUID aluno_id, UUID turma_id, Date criado_em) {
        this.id = id;
        this.aluno_id = aluno_id;
        this.turma_id = turma_id;
        this.criado_em = criado_em;
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

    public User getAluno() {
        return aluno;
    }

    public void setAluno(User aluno) {
        this.aluno = aluno;
    }

    public Turma getTurma() {
        return turma;
    }

    public void setTurma(Turma turma) {
        this.turma = turma;
    }
}
