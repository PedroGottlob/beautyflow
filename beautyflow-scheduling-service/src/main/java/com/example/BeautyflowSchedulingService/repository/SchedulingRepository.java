package com.example.BeautyflowSchedulingService.repository;

import com.example.BeautyflowSchedulingService.model.Scheduling;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface SchedulingRepository extends MongoRepository<Scheduling, String> {
    List<Scheduling> findByClientId(String clientId);
    List<Scheduling> findByProfessionalId(String professionalId);
    List<Scheduling> findByStatus(Scheduling.StatusScheduling status);
    List<Scheduling> findByDateTimeBetween(LocalDateTime start, LocalDateTime end);
    List<Scheduling> findByProfessionalIdAndDateTimeBetween(
            String professionalId, LocalDateTime start, LocalDateTime end
    );
}