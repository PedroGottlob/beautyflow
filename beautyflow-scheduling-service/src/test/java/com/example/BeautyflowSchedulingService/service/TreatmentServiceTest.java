package com.example.BeautyflowSchedulingService.service;

import com.example.BeautyflowSchedulingService.model.Treatment;
import com.example.BeautyflowSchedulingService.repository.TreatmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TreatmentServiceTest {

    @Mock
    private TreatmentRepository treatmentRepository;

    @InjectMocks
    private TreatmentService treatmentService;

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
    void listarTodos_deveRetornarTodosOsServicos() {
        when(treatmentRepository.findAll()).thenReturn(List.of(treatment));

        List<Treatment> resultado = treatmentService.listarTodos();

        assertThat(resultado).hasSize(1).contains(treatment);
    }

    @Test
    void listarAtivos_deveRetornarApenasServicosAtivos() {
        when(treatmentRepository.findByAtivoTrue()).thenReturn(List.of(treatment));

        List<Treatment> resultado = treatmentService.listarAtivos();

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).isActive()).isTrue();
        verify(treatmentRepository).findByAtivoTrue();
    }

    @Test
    void buscarPorId_quandoEncontrado_deveRetornarServico() {
        when(treatmentRepository.findById("1")).thenReturn(Optional.of(treatment));

        Treatment resultado = treatmentService.buscarPorId("1");

        assertThat(resultado).isEqualTo(treatment);
    }

    @Test
    void buscarPorId_quandoNaoEncontrado_deveLancarExcecao() {
        when(treatmentRepository.findById("99")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> treatmentService.buscarPorId("99"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Serviço não encontrado: 99");
    }

    @Test
    void salvar_deveSalvarERetornarServico() {
        when(treatmentRepository.save(treatment)).thenReturn(treatment);

        Treatment resultado = treatmentService.salvar(treatment);

        assertThat(resultado).isEqualTo(treatment);
        verify(treatmentRepository).save(treatment);
    }

    @Test
    void atualizar_deveAtualizarCamposERetornarServicoSalvo() {
        Treatment atualizado = new Treatment();
        atualizado.setName("Coloração");
        atualizado.setDescription("Coloração completa");
        atualizado.setPrice(150.0);
        atualizado.setDurationMinutes(120);
        atualizado.setActive(false);

        when(treatmentRepository.findById("1")).thenReturn(Optional.of(treatment));
        when(treatmentRepository.save(any())).thenReturn(treatment);

        treatmentService.atualizar("1", atualizado);

        assertThat(treatment.getName()).isEqualTo("Coloração");
        assertThat(treatment.getDescription()).isEqualTo("Coloração completa");
        assertThat(treatment.getPrice()).isEqualTo(150.0);
        assertThat(treatment.getDurationMinutes()).isEqualTo(120);
        assertThat(treatment.isActive()).isFalse();
        verify(treatmentRepository).save(treatment);
    }

    @Test
    void atualizar_quandoNaoEncontrado_deveLancarExcecao() {
        when(treatmentRepository.findById("99")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> treatmentService.atualizar("99", treatment))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Serviço não encontrado: 99");

        verify(treatmentRepository, never()).save(any());
    }

    @Test
    void deletar_quandoExistente_deveChamarDeleteById() {
        when(treatmentRepository.findById("1")).thenReturn(Optional.of(treatment));

        treatmentService.deletar("1");

        verify(treatmentRepository).deleteById("1");
    }

    @Test
    void deletar_quandoNaoEncontrado_deveLancarExcecao() {
        when(treatmentRepository.findById("99")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> treatmentService.deletar("99"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Serviço não encontrado: 99");

        verify(treatmentRepository, never()).deleteById(any());
    }
}