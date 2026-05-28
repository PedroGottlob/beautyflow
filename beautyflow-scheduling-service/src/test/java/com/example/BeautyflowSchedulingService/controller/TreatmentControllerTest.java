package com.example.BeautyflowSchedulingService.controller;

import com.example.BeautyflowSchedulingService.model.Treatment;
import com.example.BeautyflowSchedulingService.service.TreatmentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TreatmentController.class)
class TreatmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TreatmentService treatmentService;

    @Autowired
    private ObjectMapper objectMapper;

    private Treatment treatment;

    @BeforeEach
    void setUp() {
        treatment = new Treatment();
        treatment.setId("1");
        treatment.setName("Corte de Cabelo");
        treatment.setDescription("Corte feminino");
        treatment.setPrice(80.0);
        treatment.setDurationMinutes(60);
        treatment.setActive(true);
    }

    @Test
    void listar_semFiltro_deveRetornar200ComTodosServicos() throws Exception {
        when(treatmentService.listarTodos()).thenReturn(List.of(treatment));

        mockMvc.perform(get("/servicos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].nome").value("Corte de Cabelo"));
    }

    @Test
    void listar_apenasAtivos_deveRetornar200ComServicosAtivos() throws Exception {
        when(treatmentService.listarAtivos()).thenReturn(List.of(treatment));

        mockMvc.perform(get("/servicos").param("apenasAtivos", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].ativo").value(true));
    }

    @Test
    void searchTreatment_quandoEncontrado_deveRetornar200ComServico() throws Exception {
        when(treatmentService.buscarPorId("1")).thenReturn(treatment);

        mockMvc.perform(get("/servicos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Corte de Cabelo"))
                .andExpect(jsonPath("$.preco").value(80.0));
    }

    @Test
    void searchTreatment_quandoNaoEncontrado_deveRetornar500() throws Exception {
        when(treatmentService.buscarPorId("99"))
                .thenThrow(new RuntimeException("Serviço não encontrado: 99"));

        mockMvc.perform(get("/servicos/99"))
                .andExpect(status().is5xxServerError());
    }

    @Test
    void createTreatment_comDadosValidos_deveRetornar201ComServicoCriado() throws Exception {
        when(treatmentService.salvar(any())).thenReturn(treatment);

        mockMvc.perform(post("/servicos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(treatment)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.nome").value("Corte de Cabelo"));
    }

    @Test
    void createTreatment_semNome_deveRetornar400() throws Exception {
        Treatment invalido = new Treatment();
        invalido.setPrice(50.0);

        mockMvc.perform(post("/servicos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalido)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateTreatment_deveRetornar200ComServicoAtualizado() throws Exception {
        when(treatmentService.atualizar(eq("1"), any())).thenReturn(treatment);

        mockMvc.perform(put("/servicos/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(treatment)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"));
    }

    @Test
    void deleteTreatment_deveRetornar204() throws Exception {
        doNothing().when(treatmentService).deletar("1");

        mockMvc.perform(delete("/servicos/1"))
                .andExpect(status().isNoContent());
    }
}