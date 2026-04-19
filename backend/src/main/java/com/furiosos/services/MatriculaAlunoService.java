package com.furiosos.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.furiosos.dto.MatriculaAlunoDTO;
import com.furiosos.exceptions.ApiRequestException;
import com.furiosos.models.MatriculaAluno;
import com.furiosos.models.Turma;
import com.furiosos.models.User;
import com.furiosos.repository.MatriculaAlunoRepository;
import com.furiosos.repository.TurmaRepository;
import com.furiosos.repository.UserRepository;

@Service
public class MatriculaAlunoService {

    @Autowired
    private MatriculaAlunoRepository matriculaRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TurmaRepository turmaRepository;

    public MatriculaAlunoDTO matricularAluno(MatriculaAlunoDTO matriculaDTO) {
        if (matriculaDTO.getAluno_id() == null) {
            throw new ApiRequestException("ID do aluno é obrigatório");
        }

        if (matriculaDTO.getTurma_id() == null) {
            throw new ApiRequestException("ID da turma é obrigatório");
        }

        // Validar se aluno existe
        User aluno = userRepository.findById(matriculaDTO.getAluno_id()).get();
        if (aluno == null) {
            throw new ApiRequestException("Aluno não encontrado");
        }

        // Validar se turma existe
        Optional<Turma> turmaOpt = turmaRepository.findById(matriculaDTO.getTurma_id());
        if (!turmaOpt.isPresent()) {
            throw new ApiRequestException("Turma não encontrada");
        }

        // Validar matrícula duplicada
        Optional<MatriculaAluno> existente = matriculaRepository.findByAluno_idAndTurma_id(
                matriculaDTO.getAluno_id(),
                matriculaDTO.getTurma_id());

        if (existente.isPresent()) {
            throw new ApiRequestException("Aluno já está matriculado nesta turma");
        }

        MatriculaAluno matricula = new MatriculaAluno();
        matricula.setId(UUID.randomUUID());
        matricula.setAluno_id(matriculaDTO.getAluno_id());
        matricula.setTurma_id(matriculaDTO.getTurma_id());
        matricula.setCriado_em(new Date());

        MatriculaAluno saved = matriculaRepository.save(matricula);
        return convertToDTO(saved, aluno.getNome(), turmaOpt.get().getNome());
    }

    public List<MatriculaAlunoDTO> findAlunosByTurma(UUID turmaId) {
        // Validar se turma existe
        if (!turmaRepository.existsById(turmaId)) {
            throw new ApiRequestException("Turma não encontrada");
        }

        return matriculaRepository.findByTurma_id(turmaId).stream()
                .map(m -> {
                    User aluno = userRepository.findById(m.getAluno_id()).get();
                    String alunoNome = aluno != null ? aluno.getNome() : "Desconhecido";
                    return convertToDTO(m, alunoNome, "");
                })
                .collect(Collectors.toList());
    }

    public List<MatriculaAlunoDTO> findTurmasByAluno(UUID alunoId) {
        // Validar se aluno existe
        User aluno = userRepository.findById(alunoId).get();
        if (aluno == null) {
            throw new ApiRequestException("Aluno não encontrado");
        }

        return matriculaRepository.findByAluno_id(alunoId).stream()
                .map(m -> {
                    Optional<Turma> turmaOpt = turmaRepository.findById(m.getTurma_id());
                    String turmaNome = turmaOpt.isPresent() ? turmaOpt.get().getNome() : "Desconhecida";
                    return convertToDTO(m, aluno.getNome(), turmaNome);
                })
                .collect(Collectors.toList());
    }

    public void cancelarMatricula(UUID alunoId, UUID turmaId) {
        Optional<MatriculaAluno> matriculaOpt = matriculaRepository.findByAluno_idAndTurma_id(alunoId, turmaId);
        if (!matriculaOpt.isPresent()) {
            throw new ApiRequestException("Matrícula não encontrada");
        }

        matriculaRepository.deleteById(matriculaOpt.get().getId());
    }

    private MatriculaAlunoDTO convertToDTO(MatriculaAluno matricula, String alunoNome, String turmaNome) {
        return new MatriculaAlunoDTO(
                matricula.getId(),
                matricula.getAluno_id(),
                matricula.getTurma_id(),
                matricula.getCriado_em(),
                alunoNome,
                turmaNome);
    }
}
