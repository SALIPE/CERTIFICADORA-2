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

import com.furiosos.dto.AulaDTO;
import com.furiosos.exceptions.ApiRequestException;
import com.furiosos.services.AulaService;
import com.furiosos.utils.AuthUtils;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping(value = "/furiosos/aulas")
@Api(value = "API REST Aulas")
@CrossOrigin(origins = "*")
public class AulaController {

    @Autowired
    private AulaService aulaService;

    @PostMapping
    @ApiOperation(value = "Cria uma nova aula (apenas ADMIN)")
    public ResponseEntity<AulaDTO> create(@RequestBody AulaDTO aulaDTO) {
        if (!AuthUtils.isAdmin()) {
            throw new ApiRequestException("Apenas administradores podem criar aulas");
        }
        AulaDTO created = aulaService.create(aulaDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    @ApiOperation(value = "Lista todas as aulas")
    public ResponseEntity<List<AulaDTO>> findAll() {
        List<AulaDTO> aulas = aulaService.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(aulas);
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "Obtém uma aula por ID")
    public ResponseEntity<AulaDTO> findById(@PathVariable UUID id) {
        AulaDTO aula = aulaService.findById(id);
        return ResponseEntity.status(HttpStatus.OK).body(aula);
    }

    @GetMapping("/turma/{turmaId}")
    @ApiOperation(value = "Lista aulas de uma turma específica")
    public ResponseEntity<List<AulaDTO>> findByTurmaId(@PathVariable UUID turmaId) {
        List<AulaDTO> aulas = aulaService.findByTurmaId(turmaId);
        return ResponseEntity.status(HttpStatus.OK).body(aulas);
    }

    @PutMapping("/{id}")
    @ApiOperation(value = "Atualiza uma aula (apenas ADMIN)")
    public ResponseEntity<AulaDTO> update(@PathVariable UUID id, @RequestBody AulaDTO aulaDTO) {
        if (!AuthUtils.isAdmin()) {
            throw new ApiRequestException("Apenas administradores podem atualizar aulas");
        }
        AulaDTO updated = aulaService.update(id, aulaDTO);
        return ResponseEntity.status(HttpStatus.OK).body(updated);
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "Deleta uma aula (apenas ADMIN)")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        if (!AuthUtils.isAdmin()) {
            throw new ApiRequestException("Apenas administradores podem deletar aulas");
        }
        aulaService.delete(id);
        return ResponseEntity.status(HttpStatus.OK).body("Aula deletada com sucesso");
    }
}
