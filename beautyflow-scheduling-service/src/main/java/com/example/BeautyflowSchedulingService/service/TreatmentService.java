package com.example.BeautyflowSchedulingService.service;

import com.example.BeautyflowSchedulingService.model.Treatment;
import com.example.BeautyflowSchedulingService.repository.TreatmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TreatmentService {

    private final TreatmentRepository treatmentRepository;

    public TreatmentService(TreatmentRepository treatmentRepository) {
        this.treatmentRepository = treatmentRepository;
    }

    public List<Treatment> findAll() {
        return treatmentRepository.findAll();
    }

    public List<Treatment> findAllActive() {
        return treatmentRepository.findByActiveTrue();
    }

    public Treatment findById(String id) {
        return treatmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Treatment not found: " + id));
    }

    public Treatment save(Treatment treatment) {
        return treatmentRepository.save(treatment);
    }

    public Treatment update(String id, Treatment updated) {
        Treatment existing = findById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setDurationMinutes(updated.getDurationMinutes());
        existing.setActive(updated.isActive());
        return treatmentRepository.save(existing);
    }

    public void delete(String id) {
        findById(id);
        treatmentRepository.deleteById(id);
    }
}