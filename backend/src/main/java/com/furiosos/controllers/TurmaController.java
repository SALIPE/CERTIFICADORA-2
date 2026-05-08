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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.furiosos.dto.TurmaDTO;
import com.furiosos.exceptions.ApiRequestException;
import com.furiosos.services.TurmaService;
import com.furiosos.utils.AuthUtils;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping(value = "/furiosos/turmas")
@Api(value = "API REST Turmas")
@CrossOrigin(origins = "http://localhost:3000")
public class TurmaController {

    @Autowired
    private TurmaService turmaService;

    @PostMapping
    @ApiOperation(value = "Cria uma nova turma (apenas ADMIN)")
    public ResponseEntity<TurmaDTO> create(@RequestBody TurmaDTO turmaDTO) {
        if (!AuthUtils.isAdmin()) {
            throw new ApiRequestException("Apenas administradores podem criar turmas");
        }
        TurmaDTO created = turmaService.create(turmaDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    @ApiOperation(value = "Lista todas as turmas")
    public ResponseEntity<List<TurmaDTO>> findAll() {
        List<TurmaDTO> turmas = turmaService.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(turmas);
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Obtém uma turma por ID")
    public ResponseEntity<TurmaDTO> findById(@PathVariable UUID id) {
        TurmaDTO turma = turmaService.findById(id);
        return ResponseEntity.status(HttpStatus.OK).body(turma);
    }

    @GetMapping("/nome/{nome}")
    @ApiOperation(value = "Busca turmas por nome")
    public ResponseEntity<List<TurmaDTO>> findByNome(@PathVariable String nome) {
        List<TurmaDTO> turmas = turmaService.findByNome(nome);
        return ResponseEntity.status(HttpStatus.OK).body(turmas);
    }

    @GetMapping("/status/{status}")
    @ApiOperation(value = "Busca turmas por status (ATIVA, CONCLUIDA, CANCELADA)")
    public ResponseEntity<List<TurmaDTO>> findByStatus(@PathVariable String status) {
        List<TurmaDTO> turmas = turmaService.findByStatus(status);
        return ResponseEntity.status(HttpStatus.OK).body(turmas);
    }

    @PutMapping("/{id}")
    @ApiOperation(value = "Atualiza uma turma (apenas ADMIN)")
    public ResponseEntity<TurmaDTO> update(@PathVariable UUID id, @RequestBody TurmaDTO turmaDTO) {
        if (!AuthUtils.isAdmin()) {
            throw new ApiRequestException("Apenas administradores podem atualizar turmas");
        }
        TurmaDTO updated = turmaService.update(id, turmaDTO);
        return ResponseEntity.status(HttpStatus.OK).body(updated);
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Deleta uma turma (apenas ADMIN)")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        if (!AuthUtils.isAdmin()) {
            throw new ApiRequestException("Apenas administradores podem deletar turmas");
        }
        turmaService.delete(id);
        return ResponseEntity.status(HttpStatus.OK).body("Turma deletada com sucesso");
    }
}
