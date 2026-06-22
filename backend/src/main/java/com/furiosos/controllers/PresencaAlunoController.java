package com.furiosos.controllers;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.furiosos.dto.PresencaAlunoDTO;
import com.furiosos.exceptions.ApiRequestException;
import com.furiosos.services.PresencaAlunoService;
import com.furiosos.utils.AuthUtils;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping(value = "/furiosos/presencas")
@Api(value = "API REST Presenças")
@CrossOrigin(origins = "*")
public class PresencaAlunoController {

    @Autowired
    private PresencaAlunoService presencaService;

    @PostMapping
    @ApiOperation(value = "Registra ou atualiza a presença de um aluno em uma aula (apenas ADMIN). Se id for fornecido, atualiza; caso contrário, cria nova presença.")
    public ResponseEntity<PresencaAlunoDTO> registrarPresenca(@RequestBody PresencaAlunoDTO presencaDTO) {
        if (!AuthUtils.isAdmin()) {
            throw new ApiRequestException("Apenas administradores podem registrar presenças");
        }
        PresencaAlunoDTO created = presencaService.registrarPresenca(presencaDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/aula/{aulaId}")
    @ApiOperation(value = "Lista todas as presenças de uma aula específica")
    public ResponseEntity<List<PresencaAlunoDTO>> findPresencaByAula(@PathVariable UUID aulaId) {
        List<PresencaAlunoDTO> presenças = presencaService.findPresencaByAula(aulaId);
        return ResponseEntity.status(HttpStatus.OK).body(presenças);
    }

    @GetMapping("/aluno/{alunoId}")
    @ApiOperation(value = "Lista o histórico de presenças de um aluno (ALUNO vê apenas suas presenças)")
    public ResponseEntity<List<PresencaAlunoDTO>> findPresencaByAluno(@PathVariable UUID alunoId) {
        // ALUNO pode ver apenas suas próprias presenças
        if (AuthUtils.isAluno() && !alunoId.equals(AuthUtils.getCurrentUserId())) {
            throw new ApiRequestException("Você pode visualizar apenas suas próprias presenças");
        }
        List<PresencaAlunoDTO> presenças = presencaService.findPresencaByAluno(alunoId);
        return ResponseEntity.status(HttpStatus.OK).body(presenças);
    }

    @GetMapping("/frequencia")
    @ApiOperation(value = "Calcula a frequência (percentual) de um aluno em uma turma")
    public ResponseEntity<Map<String, Object>> calcularFrequencia(
            @RequestParam String alunoId,
            @RequestParam String turmaId) {
        Map<String, Object> response = presencaService.calcularFrequencia(
                UUID.fromString(alunoId), UUID.fromString(turmaId));

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/frequencias")
    @ApiOperation(value = "Calcula a frequência (percentual) de todos os aluno em uma turma")
    public ResponseEntity<List<Map<String, Object>>> calcularFrequencias(
            @RequestParam String turmaId) {
        List<Map<String, Object>> response = presencaService.calcularFrequencias(UUID.fromString(turmaId));

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
