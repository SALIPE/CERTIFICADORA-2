package com.furiosos.controllers;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.furiosos.dto.MatriculaAlunoDTO;
import com.furiosos.dto.TextResponse;
import com.furiosos.exceptions.ApiRequestException;
import com.furiosos.services.MatriculaAlunoService;
import com.furiosos.utils.AuthUtils;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping(value = "/furiosos/matriculas")
@Api(value = "API REST Matrículas")
@CrossOrigin(origins = "*")
public class MatriculaAlunoController {

    @Autowired
    private MatriculaAlunoService matriculaService;

    @PostMapping
    @ApiOperation(value = "Matricula um aluno em uma turma (apenas ADMIN)")
    public ResponseEntity<MatriculaAlunoDTO> matricular(@RequestBody MatriculaAlunoDTO matriculaDTO) {
        if (!AuthUtils.isAdmin()) {
            throw new ApiRequestException("Apenas administradores podem matricular alunos");
        }
        MatriculaAlunoDTO created = matriculaService.matricularAluno(matriculaDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/aluno/{alunoId}")
    @ApiOperation(value = "Lista todas as turmas de um aluno (ALUNO vê apenas suas turmas)")
    public ResponseEntity<List<MatriculaAlunoDTO>> findTurmasByAluno(@PathVariable UUID alunoId) {
        // ALUNO pode ver apenas suas próprias matrículas
        if (AuthUtils.isAluno() && !alunoId.equals(AuthUtils.getCurrentUserId())) {
            throw new ApiRequestException("Você pode visualizar apenas suas próprias matrículas");
        }
        List<MatriculaAlunoDTO> turmas = matriculaService.findTurmasByAluno(alunoId);
        return ResponseEntity.status(HttpStatus.OK).body(turmas);
    }

    @GetMapping("/turma/{turmaId}")
    @ApiOperation(value = "Lista todos os alunos matriculados em uma turma")
    public ResponseEntity<List<MatriculaAlunoDTO>> findAlunosByTurma(@PathVariable UUID turmaId) {
        List<MatriculaAlunoDTO> alunos = matriculaService.findAlunosByTurma(turmaId);
        return ResponseEntity.status(HttpStatus.OK).body(alunos);
    }

    @DeleteMapping
    @ApiOperation(value = "Cancela a matrícula de um aluno em uma turma (apenas ADMIN)")
    public ResponseEntity<TextResponse> cancelarMatricula(
            @RequestParam String alunoId,
            @RequestParam String turmaId) {
        if (!AuthUtils.isAdmin()) {
            throw new ApiRequestException("Apenas administradores podem cancelar matrículas");
        }
        matriculaService.cancelarMatricula(
                UUID.fromString(alunoId),
                UUID.fromString(turmaId));
        return ResponseEntity.status(HttpStatus.OK).body(new TextResponse("Matrícula cancelada com sucesso"));
    }
}
