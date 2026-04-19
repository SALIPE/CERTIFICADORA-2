package com.furiosos.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.furiosos.auth.AuthJjwt;
import com.furiosos.dto.LoginRequestDTO;
import com.furiosos.dto.LoginResponseDTO;
import com.furiosos.exceptions.ApiRequestException;
import com.furiosos.models.User;
import com.furiosos.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        if (loginRequest.getEmail() == null || loginRequest.getEmail().isEmpty()) {
            throw new ApiRequestException("Email é obrigatório");
        }

        if (loginRequest.getSenha() == null || loginRequest.getSenha().isEmpty()) {
            throw new ApiRequestException("Senha é obrigatória");
        }

        // Buscar usuário por email
        User user = userRepository.findByEmail(loginRequest.getEmail());

        if (user == null) {
            throw new ApiRequestException("Usuário não encontrado");
        }

        if (!user.isAtivo()) {
            throw new ApiRequestException("Usuário inativo");
        }

        // Validar senha usando BCrypt
        if (!passwordEncoder.matches(loginRequest.getSenha(), user.getSenha_hash())) {
            throw new ApiRequestException("Email ou senha inválidos");
        }

        // Gerar token JWT com claims
        String token = AuthJjwt.generateTokenWithClaims(
                user.getId().toString(),
                user.getNome(),
                user.getPerfil());

        // Tempo de expiração em milissegundos (24 horas)
        Long expiresIn = 1000L * 60 * 60 * 24;

        return new LoginResponseDTO(
                token,
                user.getId().toString(),
                user.getNome(),
                user.getEmail(),
                user.getPerfil(),
                expiresIn);
    }

    public boolean validarTokenEExtrairRole(String bearerToken, String rolaEsperada) {
        try {
            String role = AuthJjwt.extractUserRoleFromToken(bearerToken);
            return role.equals(rolaEsperada);
        } catch (ApiRequestException e) {
            return false;
        }
    }

    public String extrairIdDoToken(String bearerToken) {
        return AuthJjwt.extractUserIdFromToken(bearerToken);
    }

    public String extrairRoleDoToken(String bearerToken) {
        return AuthJjwt.extractUserRoleFromToken(bearerToken);
    }

    public String extrairNomeDoToken(String bearerToken) {
        return AuthJjwt.extractUserNameFromToken(bearerToken);
    }
}
