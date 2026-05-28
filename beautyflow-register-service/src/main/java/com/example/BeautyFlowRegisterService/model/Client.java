package com.example.BeautyFlowRegisterService.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Document(collection = "clientes")
public class Client {

    @Id
    private String id;

    @NotBlank(message = "Nome é obrigatório")
    private String name;

    @Email(message = "E-mail inválido")
    private String email;

    @Indexed(unique = true)
    @NotBlank(message = "Telefone é obrigatório")
    private String phone;

    private String observations;

    @CreatedDate
    private LocalDateTime createdIn;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }

    public LocalDateTime getCreatedIn() { return createdIn; }
    public void setCreatedIn(LocalDateTime createdIn) { this.createdIn = createdIn; }
}