package com.furiosos.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.furiosos.dto.UsuarioCreateDTO;
import com.furiosos.dto.UsuarioDTO;
import com.furiosos.exceptions.ApiRequestException;
import com.furiosos.services.UserService;
import com.furiosos.utils.AuthUtils;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping(value = "/furiosos/alunos")
@Api(value = "API REST Alunos")
@CrossOrigin(origins = "*")
public class AlunoController {

    @Autowired
    UserService userService;

    @GetMapping
    @ApiOperation(value = "Lista todos os alunos")
    public ResponseEntity<List<UsuarioDTO>> findAlunos() {
        List<UsuarioDTO> alunos = userService.findAlunos();
        return ResponseEntity.status(HttpStatus.OK).body(alunos);
    }

    @PostMapping
    @ApiOperation(value = "Cria um novo aluno (apenas ADMIN)")
    public ResponseEntity<UsuarioDTO> create(@RequestBody UsuarioCreateDTO usuarioCreateDTO) {
        if (!AuthUtils.isAdmin()) {
            throw new ApiRequestException("Apenas administradores podem criar alunos");
        }
        UsuarioDTO created = userService.create(usuarioCreateDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

}
