package com.example.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class MHMovieController {
    @Autowired
    private MHMovieService service;

    @PostMapping("/CriarReserva")
    public ResponseEntity<?> criarReserva(@RequestBody MHMovieReserva reserva) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(reserva));
    }

    @GetMapping("/mostrarReserva")
    public List<MHMovieReserva> listarReservas() {
        return service.listarTodos();
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> excluirReserva(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
