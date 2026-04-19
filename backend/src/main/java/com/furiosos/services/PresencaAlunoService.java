package com.furiosos.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.furiosos.dto.PresencaAlunoDTO;
import com.furiosos.exceptions.ApiRequestException;
import com.furiosos.models.Aula;
import com.furiosos.models.MatriculaAluno;
import com.furiosos.models.PresencaAluno;
import com.furiosos.models.PresencaAluno.StatusPresenca;
import com.furiosos.models.User;
import com.furiosos.repository.AulaRepository;
import com.furiosos.repository.MatriculaAlunoRepository;
import com.furiosos.repository.PresencaAlunoRepository;
import com.furiosos.repository.UserRepository;

@Service
public class PresencaAlunoService {

    @Autowired
    private PresencaAlunoRepository presencaRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AulaRepository aulaRepository;

    @Autowired
    private MatriculaAlunoRepository matriculaRepository;

    public PresencaAlunoDTO registrarPresenca(PresencaAlunoDTO presencaDTO) {
        if (presencaDTO.getAluno_id() == null) {
            throw new ApiRequestException("ID do aluno é obrigatório");
        }

        if (presencaDTO.getAula_id() == null) {
            throw new ApiRequestException("ID da aula é obrigatório");
        }

        if (presencaDTO.getStatus_presenca() == null || presencaDTO.getStatus_presenca().isEmpty()) {
            throw new ApiRequestException("Status de presença é obrigatório");
        }

        // Validar se aluno existe
        User aluno = userRepository.findById(presencaDTO.getAluno_id()).get();
        if (aluno == null) {
            throw new ApiRequestException("Aluno não encontrado");
        }

        // Validar se aula existe
        Optional<Aula> aulaOpt = aulaRepository.findById(presencaDTO.getAula_id());
        if (!aulaOpt.isPresent()) {
            throw new ApiRequestException("Aula não encontrada");
        }

        Aula aula = aulaOpt.get();

        // Validar se aluno está matriculado na turma
        Optional<MatriculaAluno> matriculaOpt = matriculaRepository.findByAluno_idAndTurma_id(
                presencaDTO.getAluno_id(),
                aula.getTurma_id());

        if (!matriculaOpt.isPresent()) {
            throw new ApiRequestException("Aluno não está matriculado na turma desta aula");
        }

        // Validar presença duplicada
        Optional<PresencaAluno> existente = presencaRepository.findByAluno_idAndAula_id(
                presencaDTO.getAluno_id(),
                presencaDTO.getAula_id());

        if (existente.isPresent()) {
            throw new ApiRequestException("Presença já foi registrada para este aluno nesta aula");
        }

        // Validar status
        try {
            StatusPresenca.valueOf(presencaDTO.getStatus_presenca());
        } catch (IllegalArgumentException e) {
            throw new ApiRequestException("Status inválido. Use: PRESENTE, AUSENTE, FALTA_JUSTIFICADA");
        }

        PresencaAluno presenca = new PresencaAluno();
        presenca.setId(UUID.randomUUID());
        presenca.setAluno_id(presencaDTO.getAluno_id());
        presenca.setAula_id(presencaDTO.getAula_id());
        presenca.setStatus_presenca(StatusPresenca.valueOf(presencaDTO.getStatus_presenca()));
        presenca.setObservacoes(presencaDTO.getObservacoes());
        Date now = new Date();
        presenca.setCriado_em(now);
        presenca.setAtualizado_em(now);

        PresencaAluno saved = presencaRepository.save(presenca);
        return convertToDTO(saved, aluno.getNome(), aula.getData_hora());
    }

    public List<PresencaAlunoDTO> findPresencaByAula(UUID aulaId) {
        // Validar se aula existe
        if (!aulaRepository.existsById(aulaId)) {
            throw new ApiRequestException("Aula não encontrada");
        }

        return presencaRepository.findByAula_id(aulaId).stream()
                .map(p -> {
                    User aluno = userRepository.findById(p.getAluno_id()).get();
                    String alunoNome = aluno != null ? aluno.getNome() : "Desconhecido";
                    Optional<Aula> aulaOpt = aulaRepository.findById(p.getAula_id());
                    Date aulaData = aulaOpt.isPresent() ? aulaOpt.get().getData_hora() : null;
                    return convertToDTO(p, alunoNome, aulaData);
                })
                .collect(Collectors.toList());
    }

    public List<PresencaAlunoDTO> findPresencaByAluno(UUID alunoId) {
        // Validar se aluno existe
        User aluno = userRepository.findById(alunoId).get();
        if (aluno == null) {
            throw new ApiRequestException("Aluno não encontrado");
        }

        return presencaRepository.findByAluno_id(alunoId).stream()
                .map(p -> {
                    Optional<Aula> aulaOpt = aulaRepository.findById(p.getAula_id());
                    Date aulaData = aulaOpt.isPresent() ? aulaOpt.get().getData_hora() : null;
                    return convertToDTO(p, aluno.getNome(), aulaData);
                })
                .collect(Collectors.toList());
    }

    public PresencaAlunoDTO atualizarPresenca(UUID id, String statusPresenca) {
        Optional<PresencaAluno> presencaOpt = presencaRepository.findById(id);
        if (!presencaOpt.isPresent()) {
            throw new ApiRequestException("Presença não encontrada");
        }

        // Validar status
        try {
            StatusPresenca.valueOf(statusPresenca);
        } catch (IllegalArgumentException e) {
            throw new ApiRequestException("Status inválido. Use: PRESENTE, AUSENTE, FALTA_JUSTIFICADA");
        }

        PresencaAluno presenca = presencaOpt.get();
        presenca.setStatus_presenca(StatusPresenca.valueOf(statusPresenca));
        presenca.setAtualizado_em(new Date());

        PresencaAluno updated = presencaRepository.save(presenca);
        User aluno = userRepository.findById(updated.getAluno_id()).get();
        Optional<Aula> aulaOpt = aulaRepository.findById(updated.getAula_id());
        String alunoNome = aluno != null ? aluno.getNome() : "Desconhecido";
        Date aulaData = aulaOpt.isPresent() ? aulaOpt.get().getData_hora() : null;

        return convertToDTO(updated, alunoNome, aulaData);
    }

    public double calcularFrequencia(UUID alunoId, UUID turmaId) {
        // Validar se aluno está matriculado na turma
        Optional<MatriculaAluno> matriculaOpt = matriculaRepository.findByAluno_idAndTurma_id(alunoId, turmaId);
        if (!matriculaOpt.isPresent()) {
            throw new ApiRequestException("Aluno não está matriculado nesta turma");
        }

        // Obter todas as aulas da turma
        List<Aula> aulasTotal = aulaRepository.findByTurma_id(turmaId);

        if (aulasTotal.isEmpty()) {
            return 0;
        }

        // Contar presenças
        long presentes = aulasTotal.stream()
                .flatMap(aula -> presencaRepository.findByAula_id(aula.getId()).stream())
                .filter(p -> p.getAluno_id().equals(alunoId) && p.getStatus_presenca() == StatusPresenca.PRESENTE)
                .count();

        double frequencia = (presentes * 100.0) / aulasTotal.size();
        return Math.round(frequencia * 100.0) / 100.0;
    }

    private PresencaAlunoDTO convertToDTO(PresencaAluno presenca, String alunoNome, Date aulaData) {
        return new PresencaAlunoDTO(
                presenca.getId(),
                presenca.getAluno_id(),
                presenca.getAula_id(),
                presenca.getStatus_presenca().toString(),
                presenca.getObservacoes(),
                presenca.getCriado_em(),
                presenca.getAtualizado_em(),
                alunoNome,
                aulaData);
    }
}
