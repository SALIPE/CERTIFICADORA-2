package com.furiosos.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.furiosos.dto.AulaDTO;
import com.furiosos.exceptions.ApiRequestException;
import com.furiosos.models.Aula;
import com.furiosos.models.Turma;
import com.furiosos.models.Turma.StatusTurma;
import com.furiosos.repository.AulaRepository;
import com.furiosos.repository.TurmaRepository;

@Service
public class AulaService {

    @Autowired
    private AulaRepository aulaRepository;

    @Autowired
    private TurmaRepository turmaRepository;

    public AulaDTO create(AulaDTO aulaDTO) {
        if (aulaDTO.getTurma_id() == null) {
            throw new ApiRequestException("ID da turma é obrigatório");
        }

        if (aulaDTO.getData_hora() == null) {
            throw new ApiRequestException("Data/hora da aula é obrigatória");
        }

        // Validar se turma existe e está ATIVA
        Optional<Turma> turmaOpt = turmaRepository.findById(UUID.fromString(aulaDTO.getTurma_id()));
        if (!turmaOpt.isPresent()) {
            throw new ApiRequestException("Turma não encontrada");
        }

        Turma turma = turmaOpt.get();
        if (turma.getStatus() != StatusTurma.ATIVA) {
            throw new ApiRequestException("Não é possível criar aula para turma " + turma.getStatus());
        }

        // Validar se data não está no passado
        if (aulaDTO.getData_hora().before(new Date())) {
            throw new ApiRequestException("Data/hora da aula não pode estar no passado");
        }

        Aula aula = new Aula();
        aula.setId(UUID.randomUUID());
        aula.setTurma_id(UUID.fromString(aulaDTO.getTurma_id()));
        aula.setData_hora(aulaDTO.getData_hora());
        aula.setTopico(aulaDTO.getTopico());
        aula.setDescricao(aulaDTO.getDescricao());
        Date now = new Date();
        aula.setCriado_em(now);
        aula.setAtualizado_em(now);

        Aula saved = aulaRepository.save(aula);
        return convertToDTO(saved);
    }

    public List<AulaDTO> findAll() {
        return aulaRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AulaDTO findById(UUID id) {
        Optional<Aula> aula = aulaRepository.findById(id);
        if (!aula.isPresent()) {
            throw new ApiRequestException("Aula não encontrada");
        }
        return convertToDTO(aula.get());
    }

    public List<AulaDTO> findByTurmaId(UUID turmaId) {
        // Validar se turma existe
        if (!turmaRepository.existsById(turmaId)) {
            throw new ApiRequestException("Turma não encontrada");
        }
        return aulaRepository.findByTurma_id(turmaId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AulaDTO update(UUID id, AulaDTO aulaDTO) {
        Optional<Aula> aulaOpt = aulaRepository.findById(id);
        if (!aulaOpt.isPresent()) {
            throw new ApiRequestException("Aula não encontrada");
        }

        Aula aula = aulaOpt.get();

        if (aulaDTO.getData_hora() != null) {
            // Validar se nova data não está no passado
            if (aulaDTO.getData_hora().before(new Date())) {
                throw new ApiRequestException("Data/hora da aula não pode estar no passado");
            }
            aula.setData_hora(aulaDTO.getData_hora());
        }

        if (aulaDTO.getTopico() != null) {
            aula.setTopico(aulaDTO.getTopico());
        }

        if (aulaDTO.getDescricao() != null) {
            aula.setDescricao(aulaDTO.getDescricao());
        }

        aula.setAtualizado_em(new Date());

        Aula updated = aulaRepository.save(aula);
        return convertToDTO(updated);
    }

    public void delete(UUID id) {
        Optional<Aula> aulaOpt = aulaRepository.findById(id);
        if (!aulaOpt.isPresent()) {
            throw new ApiRequestException("Aula não encontrada");
        }

        aulaRepository.deleteById(id);
    }

    private AulaDTO convertToDTO(Aula aula) {
        return new AulaDTO(
                aula.getId(),
                aula.getTurma_id(),
                aula.getData_hora(),
                aula.getTopico(),
                aula.getDescricao(),
                aula.getCriado_em(),
                aula.getAtualizado_em());
    }
}
