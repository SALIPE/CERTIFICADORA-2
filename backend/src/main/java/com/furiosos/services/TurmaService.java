package com.furiosos.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.furiosos.dto.TurmaDTO;
import com.furiosos.exceptions.ApiRequestException;
import com.furiosos.models.Turma;
import com.furiosos.models.Turma.StatusTurma;
import com.furiosos.repository.AulaRepository;
import com.furiosos.repository.TurmaRepository;

@Service
public class TurmaService {

    @Autowired
    private TurmaRepository turmaRepository;

    @Autowired
    private AulaRepository aulaRepository;

    public TurmaDTO create(TurmaDTO turmaDTO) {
        if (turmaDTO.getNome() == null || turmaDTO.getNome().isEmpty()) {
            throw new ApiRequestException("Nome da turma é obrigatório");
        }

        Date now = new Date();

        Turma turma = new Turma();
        turma.setId(UUID.randomUUID());
        turma.setNome(turmaDTO.getNome());
        turma.setDescricao(turmaDTO.getDescricao());
        turma.setStatus(turmaDTO.getStatus().toUpperCase());
        turma.setCriado_em(now);
        turma.setAtualizado_em(now);

        Turma saved = turmaRepository.inserirTurma(turmaDTO.getNome(),
                turmaDTO.getDescricao(),turmaDTO.getStatus().toUpperCase());
        return convertToDTO(saved);
    }

    public List<TurmaDTO> findAll() {
        return turmaRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TurmaDTO findById(UUID id) {
        Optional<Turma> turma = turmaRepository.findById(id);
        if (!turma.isPresent()) {
            throw new ApiRequestException("Turma não encontrada");
        }
        return convertToDTO(turma.get());
    }

    public TurmaDTO update(UUID id, TurmaDTO turmaDTO) {
        Optional<Turma> turmaOpt = turmaRepository.findById(id);
        if (!turmaOpt.isPresent()) {
            throw new ApiRequestException("Turma não encontrada");
        }

        Turma turma = turmaOpt.get();
        if (turmaDTO.getNome() != null && !turmaDTO.getNome().isEmpty()) {
            turma.setNome(turmaDTO.getNome());
        }
        if (turmaDTO.getDescricao() != null) {
            turma.setDescricao(turmaDTO.getDescricao());
        }
        if (turmaDTO.getStatus() != null) {
            try {
                turma.setStatus(turmaDTO.getStatus().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new ApiRequestException("Status inválido. Use: ATIVA, CONCLUIDA, CANCELADA");
            }
        }
        turma.setAtualizado_em(new Date());

        Turma updated = turmaRepository.atualizarTurma(turma.getId(),turma.getNome(), turma.getDescricao(), turma.getStatus());
        return convertToDTO(updated);
    }


    public List<TurmaDTO> findByStatus(String status) {
        try {
            StatusTurma.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new ApiRequestException("Status inválido. Use: ATIVA, CONCLUIDA, CANCELADA");
        }
        return turmaRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TurmaDTO> findByNome(String nome) {
        return turmaRepository.findByNomeContaining(nome).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private TurmaDTO convertToDTO(Turma turma) {
        return new TurmaDTO(
                turma.getId(),
                turma.getNome(),
                turma.getDescricao(),
                turma.getStatus(),
                turma.getCriado_em(),
                turma.getAtualizado_em());
    }
}
