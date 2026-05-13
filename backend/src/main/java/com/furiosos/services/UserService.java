package com.furiosos.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.furiosos.dto.UsuarioCreateDTO;
import com.furiosos.dto.UsuarioDTO;
import com.furiosos.exceptions.ApiRequestException;
import com.furiosos.models.User;
import com.furiosos.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public List<UsuarioDTO> findAlunos() {
        return userRepository.findAlunos().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<UsuarioDTO> findAdmins() {
        return userRepository.findAdmins().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UsuarioDTO create(UsuarioCreateDTO dto) {
        String hashedPassword = passwordEncoder.encode(dto.getSenha());
        User saved = userRepository.createUsuario(dto.getNome(), dto.getEmail(), hashedPassword, dto.getPerfil());
        return convertToDTO(saved);
    }

    public Optional<User> findById(UUID id) {
        return userRepository.findById(id);
    }

    public User save(User user) {
        if (user.getId() == null) {
            user.setId(UUID.randomUUID());
            user.setCriado_em(new Date());
        }
        user.setAtualizado_em(new Date());
        // Hash the password if it's not already hashed
        if (user.getSenha_hash() != null && !user.getSenha_hash().startsWith("$2a$")) {
            user.setSenha_hash(passwordEncoder.encode(user.getSenha_hash()));
        }
        return userRepository.save(user);
    }

    public void deleteById(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ApiRequestException("Usuário não encontrado");
        }
        userRepository.deleteById(id);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    private UsuarioDTO convertToDTO(User user) {
        return new UsuarioDTO(
                user.getId().toString(),
                user.getNome(),
                user.getEmail(),
                user.getPerfil());
    }
}