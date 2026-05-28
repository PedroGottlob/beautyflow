package com.example.BeautyflowSchedulingService.repository;

import com.example.BeautyflowSchedulingService.model.Treatment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TreatmentRepository extends MongoRepository<Treatment, String> {
    List<Treatment> findByActiveTrue();

    List<Treatment> findByNameContainingIgnoreCase(String name);
}