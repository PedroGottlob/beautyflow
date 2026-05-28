package com.example.BeautyflowSchedulingService.controller;

import com.example.BeautyflowSchedulingService.model.Scheduling;
import com.example.BeautyflowSchedulingService.service.SchedulingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/agendamentos")
@Tag(name = "Schedulings", description = "Endpoints for scheduling management")
public class SchedulingController {

    private final SchedulingService schedulingService;

    public SchedulingController(SchedulingService schedulingService) {
        this.schedulingService = schedulingService;
    }

    @Operation(summary = "List all schedulings")
    @GetMapping
    public ResponseEntity<List<Scheduling>> listScheduling() {
        return ResponseEntity.ok(schedulingService.findAll());
    }

    @Operation(summary = "Find schedulings by day")
    @GetMapping("/dia")
    public ResponseEntity<List<Scheduling>> scheduleDay(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime data) {
        return ResponseEntity.ok(schedulingService.findByDay(data));
    }

    @Operation(summary = "Find schedulings by client")
    @GetMapping("/cliente/{clientId}")
    public ResponseEntity<List<Scheduling>> byClient(@PathVariable String clientId) {
        return ResponseEntity.ok(schedulingService.findByClientId(clientId));
    }

    @Operation(summary = "Find scheduling by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Scheduling> findScheduling(@PathVariable String id) {
        return ResponseEntity.ok(schedulingService.findById(id));
    }

    @Operation(summary = "Create new scheduling")
    @PostMapping
    public ResponseEntity<Scheduling> createScheduling(@Valid @RequestBody Scheduling scheduling) {
        return ResponseEntity.status(HttpStatus.CREATED).body(schedulingService.save(scheduling));
    }

    @Operation(summary = "Update scheduling status", description = "Possible status: SCHEDULED, COMPLETED, CANCELLED")
    @PatchMapping("/{id}/status")
    public ResponseEntity<Scheduling> updateStatus(
            @PathVariable String id,
            @RequestParam Scheduling.StatusScheduling status) {
        return ResponseEntity.ok(schedulingService.updateStatus(id, status));
    }

    @Operation(summary = "Delete scheduling")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScheduling(@PathVariable String id) {
        schedulingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}