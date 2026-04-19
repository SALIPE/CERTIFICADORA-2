package com.furiosos.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.furiosos.models.Turma;

@Repository
public interface TurmaRepository extends JpaRepository<Turma, UUID> {

    List<Turma> findByStatus(String status);

    List<Turma> findByNomeContaining(String nome);
}
