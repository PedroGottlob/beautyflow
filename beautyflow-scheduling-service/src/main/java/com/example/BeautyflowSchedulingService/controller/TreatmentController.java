package com.example.BeautyflowSchedulingService.controller;

import com.example.BeautyflowSchedulingService.model.Treatment;
import com.example.BeautyflowSchedulingService.service.TreatmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/servicos")
@Tag(name = "Treatments", description = "Endpoints for treatment management")
public class TreatmentController {

    private final TreatmentService treatmentService;

    public TreatmentController(TreatmentService treatmentService) {
        this.treatmentService = treatmentService;
    }

    @Operation(summary = "List all treatments")
    @GetMapping
    public ResponseEntity<List<Treatment>> listTreatment(
            @RequestParam(defaultValue = "false") boolean onlyActive) {
        if (onlyActive) return ResponseEntity.ok(treatmentService.findAllActive());
        return ResponseEntity.ok(treatmentService.findAll());
    }

    @Operation(summary = "Find treatment by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Treatment> findTreatment(@PathVariable String id) {
        return ResponseEntity.ok(treatmentService.findById(id));
    }

    @Operation(summary = "Create new treatment")
    @PostMapping
    public ResponseEntity<Treatment> createTreatment(@Valid @RequestBody Treatment treatment) {
        return ResponseEntity.status(HttpStatus.CREATED).body(treatmentService.save(treatment));
    }

    @Operation(summary = "Update existing treatment")
    @PutMapping("/{id}")
    public ResponseEntity<Treatment> updateTreatment(
            @PathVariable String id, @Valid @RequestBody Treatment treatment) {
        return ResponseEntity.ok(treatmentService.update(id, treatment));
    }

    @Operation(summary = "Delete treatment")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTreatment(@PathVariable String id) {
        treatmentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}