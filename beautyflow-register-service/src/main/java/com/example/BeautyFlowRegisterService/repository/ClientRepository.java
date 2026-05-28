package com.example.BeautyFlowRegisterService.repository;

import com.example.BeautyFlowRegisterService.model.Client;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends MongoRepository<Client, String> {
    Optional<Client> findByPhone(String phone);

    List<Client> findByNameContainingIgnoreCase(String name);
}