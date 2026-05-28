package com.example.BeautyflowSchedulingService.controller;

import com.example.BeautyflowSchedulingService.model.Scheduling;
import com.example.BeautyflowSchedulingService.service.SchedulingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SchedulingController.class)
class SchedulingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SchedulingService schedulingService;

    @Autowired
    private ObjectMapper objectMapper;

    private Scheduling scheduling;

    @BeforeEach
    void setUp() {
        scheduling = new Scheduling();
        scheduling.setId("1");
        scheduling.setClientId("cliente1");
        scheduling.setProfessionalId("prof1");
        scheduling.setServiceId("serv1");
        scheduling.setLocalDateTime(LocalDateTime.of(2026, 6, 1, 10, 0));
        scheduling.setStatus(Scheduling.StatusScheduling.SCHEDULED);
    }

    @Test
    void listScheduling_deveRetornar200ComListaDeAgendamentos() throws Exception {
        when(schedulingService.listarTodos()).thenReturn(List.of(scheduling));

        mockMvc.perform(get("/agendamentos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].clientId").value("cliente1"))
                .andExpect(jsonPath("$[0].status").value("SCHEDULED"));
    }

    @Test
    void findScheduling_quandoEncontrado_deveRetornar200ComAgendamento() throws Exception {
        when(schedulingService.buscarPorId("1")).thenReturn(scheduling);

        mockMvc.perform(get("/agendamentos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.professionalId").value("prof1"));
    }

    @Test
    void findScheduling_quandoNaoEncontrado_deveRetornar500() throws Exception {
        when(schedulingService.buscarPorId("99"))
                .thenThrow(new RuntimeException("Agendamento não encontrado: 99"));

        mockMvc.perform(get("/agendamentos/99"))
                .andExpect(status().is5xxServerError());
    }

    @Test
    void byClient() throws Exception {
        when(schedulingService.buscarPorCliente("cliente1")).thenReturn(List.of(scheduling));

        mockMvc.perform(get("/agendamentos/cliente/cliente1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].clientId").value("cliente1"));
    }

    @Test
    void createScheduling_comDadosValidos_deveRetornar201ComAgendamentoCriado() throws Exception {
        when(schedulingService.salvar(any())).thenReturn(scheduling);

        mockMvc.perform(post("/agendamentos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(scheduling)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.serviceId").value("serv1"));
    }

    @Test
    void createScheduling_semCamposObrigatorios_deveRetornar400() throws Exception {
        Scheduling invalido = new Scheduling();

        mockMvc.perform(post("/agendamentos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalido)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateStatus_deveRetornar200ComStatusAtualizado() throws Exception {
        scheduling.setStatus(Scheduling.StatusScheduling.COMPLETED);
        when(schedulingService.atualizarStatus("1", Scheduling.StatusScheduling.COMPLETED))
                .thenReturn(scheduling);

        mockMvc.perform(patch("/agendamentos/1/status")
                        .param("status", "COMPLETED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    void deleteScheduling_deveRetornar204() throws Exception {
        doNothing().when(schedulingService).deletar("1");

        mockMvc.perform(delete("/agendamentos/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void scheduleDay() throws Exception {
        when(schedulingService.buscarAgendaDia(any())).thenReturn(List.of(scheduling));

        mockMvc.perform(get("/agendamentos/dia")
                        .param("data", "2026-06-01T00:00:00"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"));
    }
}