package com.furiosos.repository;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.furiosos.models.Aula;

@Repository
public interface AulaRepository extends JpaRepository<Aula, UUID> {

    List<Aula> findByTurma_id(UUID turmaId);

    @Query("SELECT a FROM Aula a WHERE a.data_hora BETWEEN :inicio AND :fim")
    List<Aula> findByDataHoraBetween(@Param("inicio") Date inicio, @Param("fim") Date fim);
}
