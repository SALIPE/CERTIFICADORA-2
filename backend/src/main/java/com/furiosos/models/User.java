package com.furiosos.models;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Table;
import javax.persistence.Temporal;

import com.furiosos.exceptions.ApiRequestException;

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Table(name = "usuario")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private UUID id;
    private String senha_hash;
    private String nome;
    private String email;
    private String perfil;
    @Temporal(javax.persistence.TemporalType.DATE)
    private Date criado_em;

    @Temporal(javax.persistence.TemporalType.DATE)
    private Date atualizado_em;

    private boolean ativo;

    public User() {
    }

    public User(UUID id, String nome, String email, String perfil, Date criado_em, Date atualizado_em, boolean ativo) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.perfil = perfil;
        this.criado_em = criado_em;
        this.atualizado_em = atualizado_em;
        this.ativo = ativo;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getSenha_hash() {
        return senha_hash;
    }

    public void setSenha_hash(String senha_hash) {
        this.senha_hash = senha_hash;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
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

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public String getPerfil() {
        return perfil;
    }

    public void setPerfil(String role) {
        if (role.equals("ADMIN") || role.equals("ALUNO")) {
            this.perfil = role;
        } else {
            throw new ApiRequestException("Role inválida. Só é aceito 'ADMIN' ou 'ALUNO'.");
        }
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

}
