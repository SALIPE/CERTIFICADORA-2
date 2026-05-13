package com.furiosos.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.furiosos.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    User findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.perfil = 'ALUNO'")
    List<User> findAlunos();
    
    @Query("SELECT u FROM User u WHERE u.perfil = 'ADMIN'")
    List<User> findAdmins();

    @Query(value = "INSERT INTO usuario (id, nome, email, senha_hash, perfil, criado_em, atualizado_em, ativo) VALUES (gen_random_uuid(), :nome, :email, :senha, CAST(:perfil AS perfil_usuario), NOW(), NOW(), true) RETURNING *", nativeQuery = true)
    User createUsuario(
            @Param("nome") String nome,
            @Param("email") String email,
            @Param("senha") String senha,
            @Param("perfil") String perfil);

}
