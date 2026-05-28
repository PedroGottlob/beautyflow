package com.example.BeautyFlowRegisterService.service;

import com.example.BeautyFlowRegisterService.model.Professional;
import com.example.BeautyFlowRegisterService.repository.ProfissionalRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProfessionalService {

    private final ProfissionalRepository profissionalRepository;

    public ProfessionalService(ProfissionalRepository profissionalRepository) {
        this.profissionalRepository = profissionalRepository;
    }

    public List<Professional> listAll() {
        return profissionalRepository.findAll();
    }

    public List<Professional> listAssets() {
        return profissionalRepository.findByActiveTrue();
    }

    public Professional searchById(String id) {
        return profissionalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profissional não encontrado: " + id));
    }

    public Professional saveProfessional(Professional professional) {
        return profissionalRepository.save(professional);
    }

    public Professional updateProfessional(String id, Professional update) {
        Professional exists = searchById(id);
        exists.setName(update.getName());
        exists.setSpecialty(update.getSpecialty());
        exists.setPhone(update.getPhone());
        exists.setEmail(update.getEmail());
        exists.setServicesIds(update.getServicesIds());
        return profissionalRepository.save(exists);
    }

    public Professional toggleActive(String id) {
        Professional professional = searchById(id);
        professional.setActive(!professional.isActive());
        return profissionalRepository.save(professional);
    }

    public void deleteProfessional(String id) {
        searchById(id);
        profissionalRepository.deleteById(id);
    }
}