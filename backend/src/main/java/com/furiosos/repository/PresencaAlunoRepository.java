package com.furiosos.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.furiosos.models.PresencaAluno;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface PresencaAlunoRepository extends JpaRepository<PresencaAluno, UUID> {

    List<PresencaAluno> findByAluno_id(UUID alunoId);

    List<PresencaAluno> findByAula_id(UUID aulaId);

    Optional<PresencaAluno> findByAluno_idAndAula_id(UUID alunoId, UUID aulaId);
    
  
  
    @Query(value = "INSERT INTO presenca_aluno (id, aluno_id, aula_id, status_presenca, observacoes, criado_em, atualizado_em) VALUES (gen_random_uuid(), :aluno_id, :aula_id, CAST(:status_presenca AS status_presenca), :observacoes, NOW(), NOW()) RETURNING *", nativeQuery = true)
    PresencaAluno createPresenca(
            @Param("aluno_id") UUID aluno_id,
            @Param("aula_id") UUID aula_id,
            @Param("status_presenca") String status_presenca,
            @Param("observacoes") String obervacoes);

    @Query(value = "UPDATE presenca_aluno SET observacoes = :observacoes, status_presenca = CAST(:status_presenca AS status_presenca), atualizado_em = NOW() WHERE id = :id RETURNING *", nativeQuery = true)
    PresencaAluno atualizarPresenca(
            @Param("id") UUID id,
            @Param("status_presenca") String status_presenca,
            @Param("observacoes") String obervacoes);
}
