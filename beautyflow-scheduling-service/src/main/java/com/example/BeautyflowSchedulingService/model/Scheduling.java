package com.example.BeautyflowSchedulingService.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Document(collection = "agendamentos")
public class Scheduling {

    @Id
    private String id;

    @NotBlank(message = "Client is required")
    private String clientId;

    @NotBlank(message = "Professional is required")
    private String professionalId;

    @NotBlank(message = "Service is required")
    private String serviceId;

    @NotNull(message = "Date/time is required")
    private LocalDateTime dateTime;

    private StatusScheduling status = StatusScheduling.SCHEDULED;

    private String observations;

    @CreatedDate
    private LocalDateTime createdIn;

    public enum StatusScheduling {
        SCHEDULED, COMPLETED, CANCELLED
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }

    public String getProfessionalId() { return professionalId; }
    public void setProfessionalId(String professionalId) { this.professionalId = professionalId; }

    public String getServiceId() { return serviceId; }
    public void setServiceId(String serviceId) { this.serviceId = serviceId; }

    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }

    public StatusScheduling getStatus() { return status; }
    public void setStatus(StatusScheduling status) { this.status = status; }

    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }

    public LocalDateTime getCreatedIn() { return createdIn; }
    public void setCreatedIn(LocalDateTime createdIn) { this.createdIn = createdIn; }
}