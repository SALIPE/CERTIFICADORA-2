package com.furiosos.dto;

public class LoginResponseDTO {

    private String token;
    private String usuario_id;
    private String nome;
    private String email;
    private String perfil;
    private Long expiresIn;

    public LoginResponseDTO() {
    }

    public LoginResponseDTO(String token, String usuario_id, String nome, String email, String perfil, Long expiresIn) {
        this.token = token;
        this.usuario_id = usuario_id;
        this.nome = nome;
        this.email = email;
        this.perfil = perfil;
        this.expiresIn = expiresIn;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
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

    public Long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }
}
