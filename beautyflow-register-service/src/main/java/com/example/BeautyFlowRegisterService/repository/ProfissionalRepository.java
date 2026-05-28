package com.example.BeautyFlowRegisterService.repository;

import com.example.BeautyFlowRegisterService.model.Professional;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ProfissionalRepository extends MongoRepository<Professional, String> {
    List<Professional> findByActiveTrue();
    List<Professional> findBySpecialtyIgnoreCase(String specialty);
}