package com.furiosos.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.furiosos.models.PresencaAluno;

@Repository
public interface PresencaAlunoRepository extends JpaRepository<PresencaAluno, UUID> {

    List<PresencaAluno> findByAluno_id(UUID alunoId);

    List<PresencaAluno> findByAula_id(UUID aulaId);

    Optional<PresencaAluno> findByAluno_idAndAula_id(UUID alunoId, UUID aulaId);
}
