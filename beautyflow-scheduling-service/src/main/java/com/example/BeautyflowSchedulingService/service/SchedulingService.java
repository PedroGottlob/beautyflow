package com.example.BeautyflowSchedulingService.service;

import com.example.BeautyflowSchedulingService.model.Scheduling;
import com.example.BeautyflowSchedulingService.repository.SchedulingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SchedulingService {

    private final SchedulingRepository schedulingRepository;

    public SchedulingService(SchedulingRepository schedulingRepository) {
        this.schedulingRepository = schedulingRepository;
    }

    public List<Scheduling> findAll() {
        return schedulingRepository.findAll();
    }

    public Scheduling findById(String id) {
        return schedulingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Scheduling not found: " + id));
    }

    public List<Scheduling> findByClientId(String clientId) {
        return schedulingRepository.findByClientId(clientId);
    }

    public List<Scheduling> findByDay(LocalDateTime day) {
        LocalDateTime startOfDay = day.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusSeconds(1);
        return schedulingRepository.findByDateTimeBetween(startOfDay, endOfDay);
    }

    public Scheduling save(Scheduling scheduling) {
        checkConflict(scheduling);
        return schedulingRepository.save(scheduling);
    }

    public Scheduling updateStatus(String id, Scheduling.StatusScheduling newStatus) {
        Scheduling scheduling = findById(id);
        scheduling.setStatus(newStatus);
        return schedulingRepository.save(scheduling);
    }

    public void delete(String id) {
        findById(id);
        schedulingRepository.deleteById(id);
    }

    private void checkConflict(Scheduling newScheduling) {
        LocalDateTime start = newScheduling.getDateTime().minusMinutes(1);
        LocalDateTime end = newScheduling.getDateTime().plusMinutes(1);
        List<Scheduling> conflicts = schedulingRepository
                .findByProfessionalIdAndDateTimeBetween(newScheduling.getProfessionalId(), start, end);
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Professional already has a scheduling at this time");
        }
    }
}