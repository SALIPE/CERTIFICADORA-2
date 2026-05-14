package com.furiosos.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.furiosos.models.Turma;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface TurmaRepository extends JpaRepository<Turma, UUID> {

    List<Turma> findByStatus(String status);

    List<Turma> findByNomeContaining(String nome);

    @Query(value = "INSERT INTO turma (id, nome, descricao, status, criado_em, atualizado_em) VALUES (gen_random_uuid(), :nome, :descricao, CAST(:status AS status_turma), NOW(), NOW()) RETURNING *", nativeQuery = true)
    Turma inserirTurma(
            @Param("nome") String nome,
            @Param("descricao") String descricao,
            @Param("status") String status
    );


    @Query(value = "UPDATE turma SET nome = :nome, descricao = :descricao, status = CAST(:status AS status_turma), atualizado_em = NOW() WHERE id = :id RETURNING *", nativeQuery = true)
    Turma atualizarTurma(
            @Param("id") UUID id,
            @Param("nome") String nome,
            @Param("descricao") String descricao,
            @Param("status") String status
    );

}
