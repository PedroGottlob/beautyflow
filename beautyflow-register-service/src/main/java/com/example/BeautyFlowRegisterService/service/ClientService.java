package com.example.BeautyFlowRegisterService.service;

import com.example.BeautyFlowRegisterService.model.Client;
import com.example.BeautyFlowRegisterService.repository.ClientRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public List<Client> listAllClients() {
        return clientRepository.findAll();
    }

    public Client findById(String id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found: " + id));
    }

    public List<Client> findByName(String name) {
        return clientRepository.findByNameContainingIgnoreCase(name);
    }

    public Client save(Client client) {
        if (client.getId() == null) {
            clientRepository.findByPhone(client.getPhone())
                    .ifPresent(c -> {
                        throw new RuntimeException("Phone already registered");
                    });
        }
        return clientRepository.save(client);
    }

    public Client update(String id, Client updated) {
        Client existing = findById(id);
        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setObservations(updated.getObservations());
        return clientRepository.save(existing);
    }

    public void delete(String id) {
        findById(id);
        clientRepository.deleteById(id);
    }
}