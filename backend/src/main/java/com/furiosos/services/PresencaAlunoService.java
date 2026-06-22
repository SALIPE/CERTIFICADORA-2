package com.furiosos.services;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
import com.furiosos.repository.TurmaRepository;
import com.furiosos.repository.UserRepository;

@Service
public class PresencaAlunoService {

    @Autowired
    private PresencaAlunoRepository presencaRepository;
    @Autowired
    private TurmaRepository turmaRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AulaRepository aulaRepository;

    @Autowired
    private MatriculaAlunoRepository matriculaRepository;

    public void verificarHistoricoPresenca() {

    }

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

        // Validar status
        try {
            StatusPresenca.valueOf(presencaDTO.getStatus_presenca());
        } catch (IllegalArgumentException e) {
            throw new ApiRequestException("Status inválido. Use: PRESENTE, AUSENTE, FALTA_JUSTIFICADA");
        }

        // Se ID fornecido, fazer update
        if (presencaDTO.getId() != null) {
            Optional<PresencaAluno> existente = presencaRepository.findById(presencaDTO.getId());
            if (!existente.isPresent()) {
                throw new ApiRequestException("Presença não encontrada");
            }

            PresencaAluno presenca = existente.get();
            presenca.setStatus_presenca(StatusPresenca.valueOf(presencaDTO.getStatus_presenca()));
            presenca.setObservacoes(presencaDTO.getObservacoes());
            presenca.setAtualizado_em(new Date());

            PresencaAluno updated = presencaRepository.atualizarPresenca(
                    presencaDTO.getId(),
                    StatusPresenca.valueOf(presencaDTO.getStatus_presenca()).toString(),
                    presencaDTO.getObservacoes());
            return convertToDTO(updated, aluno.getNome(), aula.getData_hora());
        }

        // Criar nova presença
        // Validar presença duplicada
        Optional<PresencaAluno> existente = presencaRepository.findByAluno_idAndAula_id(
                presencaDTO.getAluno_id(),
                presencaDTO.getAula_id());

        if (existente.isPresent()) {
            throw new ApiRequestException("Presença já foi registrada para este aluno nesta aula");
        }

        PresencaAluno saved = presencaRepository.createPresenca(
                presencaDTO.getAluno_id(),
                presencaDTO.getAula_id(),
                StatusPresenca.valueOf(presencaDTO.getStatus_presenca()).toString(),
                presencaDTO.getObservacoes());
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

    public Map<String, Object> calcularFrequencia(UUID alunoId, UUID turmaId) {
        // Validar se aluno está matriculado na turma
        Optional<MatriculaAluno> matriculaOpt = matriculaRepository.findByAluno_idAndTurma_id(alunoId, turmaId);
        if (!matriculaOpt.isPresent()) {
            throw new ApiRequestException("Aluno não está matriculado nesta turma");
        }

        // Obter todas as aulas da turma
        List<Aula> aulasTotal = aulaRepository.findByTurma_id(turmaId);

        double frequencia = 0;

        if (!aulasTotal.isEmpty()) {
            // Contar presenças
            long presentes = aulasTotal.stream()
                    .flatMap(aula -> presencaRepository.findByAula_id(aula.getId()).stream())
                    .filter(p -> p.getAluno_id().equals(alunoId) && p.getStatus_presenca() == StatusPresenca.PRESENTE)
                    .count();

            frequencia = (presentes * 100.0) / aulasTotal.size();
            frequencia = Math.round(frequencia * 100.0) / 100.0;
        }

        Map<String, Object> response = new HashMap<>();
        response.put("aluno_id", alunoId.toString());
        response.put("turma_id", turmaId.toString());
        response.put("frequencia_percentual", frequencia + "%");
        response.put("frequencia_valor", frequencia);
        return response;
    }

    public List<Map<String, Object>> calcularFrequencias(UUID turmaId) {
        // Validar se turma existe
        if (!turmaRepository.existsById(turmaId)) {
            throw new ApiRequestException("Turma não encontrada");
        }

        List<Aula> aulasTotal = aulaRepository.findByTurma_id(turmaId);
        List<MatriculaAluno> matriculas = matriculaRepository.findByTurma_id(turmaId);

        return matriculas.stream()
                .map(m -> {
                    User aluno = userRepository.findById(m.getAluno_id()).orElse(null);
                    String alunoNome = aluno != null ? aluno.getNome() : "Desconhecido";

                    double frequencia = 0;
                    if (!aulasTotal.isEmpty()) {
                        long presentes = aulasTotal.stream()
                                .flatMap(aula -> presencaRepository.findByAula_id(aula.getId()).stream())
                                .filter(p -> p.getAluno_id().equals(m.getAluno_id())
                                        && p.getStatus_presenca() == StatusPresenca.PRESENTE)
                                .count();

                        frequencia = (presentes * 100.0) / aulasTotal.size();
                        frequencia = Math.round(frequencia * 100.0) / 100.0;
                    }

                    Map<String, Object> response = new HashMap<>();
                    response.put("aluno_id", m.getAluno_id().toString());
                    response.put("aluno_nome", alunoNome);
                    response.put("turma_id", turmaId.toString());
                    response.put("frequencia_percentual", frequencia + "%");
                    response.put("frequencia_valor", frequencia);
                    return response;
                })
                .collect(Collectors.toList());
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
