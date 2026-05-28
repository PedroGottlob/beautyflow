package com.example.BeautyFlowRegisterService.controller;

import com.example.BeautyFlowRegisterService.model.Professional;
import com.example.BeautyFlowRegisterService.service.ProfessionalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profissionais")
@Tag(name = "Profissionais", description = "Endpoints para gerenciamento de profissionais")
public class ProfissionalController {

    private final ProfessionalService professionalService;

    public ProfissionalController(ProfessionalService professionalService) {
        this.professionalService = professionalService;
    }

    @Operation(summary = "Listar todos os profissionais")
    @GetMapping
    public ResponseEntity<List<Professional>> listProfessional(
            @RequestParam(defaultValue = "false") boolean apenasAtivos) {
        if (apenasAtivos) return ResponseEntity.ok(professionalService.listAssets());
        return ResponseEntity.ok(professionalService.listAll());
    }

    @Operation(summary = "Buscar profissional por ID")
    @GetMapping("/{id}")
    public ResponseEntity<Professional> searchProfessional(@PathVariable String id) {
        return ResponseEntity.ok(professionalService.searchById(id));
    }

    @Operation(summary = "Criar novo profissional")
    @PostMapping
    public ResponseEntity<Professional> createProfessional(@Valid @RequestBody Professional professional) {
        return ResponseEntity.status(HttpStatus.CREATED).body(professionalService.saveProfessional(professional));
    }

    @Operation(summary = "Atualizar profissional existente")
    @PutMapping("/{id}")
    public ResponseEntity<Professional> updateProfessional(
            @PathVariable String id, @Valid @RequestBody Professional professional) {
        return ResponseEntity.ok(professionalService.updateProfessional(id, professional));
    }

    @Operation(summary = "Ativar ou desativar profissional")
    @PatchMapping("/{id}/toggle-ativo")
    public ResponseEntity<Professional> toggleActive(@PathVariable String id) {
        return ResponseEntity.ok(professionalService.toggleActive(id));
    }

    @Operation(summary = "Deletar profissional")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfessional(@PathVariable String id) {
        professionalService.deleteProfessional(id);
        return ResponseEntity.noContent().build();
    }
}