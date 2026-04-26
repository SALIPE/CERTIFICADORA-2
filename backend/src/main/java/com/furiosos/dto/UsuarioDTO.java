package com.furiosos.dto;

public class UsuarioDTO {

    private String usuario_id;
    private String nome;
    private String email;
    private String perfil;

    public UsuarioDTO() {
    }

    public UsuarioDTO(String usuario_id, String nome, String email, String perfil) {
        this.usuario_id = usuario_id;
        this.nome = nome;
        this.email = email;
        this.perfil = perfil;
    }

    public String getUsuario_id() {
        return usuario_id;
    }

    public void setUsuario_id(String usuario_id) {
        this.usuario_id = usuario_id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPerfil() {
        return perfil;
    }

    public void setPerfil(String perfil) {
        this.perfil = perfil;
    }

}
