package com.example.BeautyFlowRegisterService.controller;

import com.example.BeautyFlowRegisterService.model.Client;
import com.example.BeautyFlowRegisterService.service.ClientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/clientes")
@Tag(name = "Clients", description = "Endpoints for client management")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @Operation(summary = "List all clients")
    @GetMapping
    public ResponseEntity<List<Client>> listClient(@RequestParam(required = false) String name) {
        if (name != null && !name.isBlank()) {
            return ResponseEntity.ok(clientService.findByName(name));
        }
        return ResponseEntity.ok(clientService.listAllClients());
    }

    @Operation(summary = "Find client by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Client> findClient(@PathVariable String id) {
        return ResponseEntity.ok(clientService.findById(id));
    }

    @Operation(summary = "Create new client")
    @PostMapping
    public ResponseEntity<Client> createClient(@Valid @RequestBody Client client) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clientService.save(client));
    }

    @Operation(summary = "Update existing client")
    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable String id, @Valid @RequestBody Client client) {
        return ResponseEntity.ok(clientService.update(id, client));
    }

    @Operation(summary = "Delete client")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable String id) {
        clientService.delete(id);
        return ResponseEntity.noContent().build();
    }
}