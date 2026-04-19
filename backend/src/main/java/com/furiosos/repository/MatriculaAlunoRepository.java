package com.furiosos.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.furiosos.models.MatriculaAluno;

@Repository
public interface MatriculaAlunoRepository extends JpaRepository<MatriculaAluno, UUID> {

    List<MatriculaAluno> findByAluno_id(UUID alunoId);

    List<MatriculaAluno> findByTurma_id(UUID turmaId);

    Optional<MatriculaAluno> findByAluno_idAndTurma_id(UUID alunoId, UUID turmaId);
}
