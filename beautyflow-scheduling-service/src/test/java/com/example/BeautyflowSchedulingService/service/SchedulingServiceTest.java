package com.example.BeautyflowSchedulingService.service;

import com.example.BeautyflowSchedulingService.model.Scheduling;
import com.example.BeautyflowSchedulingService.repository.SchedulingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SchedulingServiceTest {

    @Mock
    private SchedulingRepository schedulingRepository;

    @InjectMocks
    private SchedulingService schedulingService;

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
    void listarTodos_deveRetornarListaDeAgendamentos() {
        when(schedulingRepository.findAll()).thenReturn(List.of(scheduling));

        List<Scheduling> resultado = schedulingService.listarTodos();

        assertThat(resultado).hasSize(1).contains(scheduling);
    }

    @Test
    void buscarPorId_quandoEncontrado_deveRetornarAgendamento() {
        when(schedulingRepository.findById("1")).thenReturn(Optional.of(scheduling));

        Scheduling resultado = schedulingService.buscarPorId("1");

        assertThat(resultado).isEqualTo(scheduling);
    }

    @Test
    void buscarPorId_quandoNaoEncontrado_deveLancarExcecao() {
        when(schedulingRepository.findById("99")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> schedulingService.buscarPorId("99"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Agendamento não encontrado: 99");
    }

    @Test
    void buscarPorCliente_deveRetornarAgendamentosDoCliente() {
        when(schedulingRepository.findByClientId("cliente1")).thenReturn(List.of(scheduling));

        List<Scheduling> resultado = schedulingService.buscarPorCliente("cliente1");

        assertThat(resultado).hasSize(1).contains(scheduling);
    }

    @Test
    void buscarAgendaDia_deveRetornarAgendamentosDoDia() {
        LocalDateTime dia = LocalDateTime.of(2026, 6, 1, 8, 0);
        when(schedulingRepository.findByDateTimeBetween(any(), any())).thenReturn(List.of(scheduling));

        List<Scheduling> resultado = schedulingService.buscarAgendaDia(dia);

        assertThat(resultado).hasSize(1).contains(scheduling);
        verify(schedulingRepository).findByDateTimeBetween(
                LocalDateTime.of(2026, 6, 1, 0, 0),
                LocalDateTime.of(2026, 6, 1, 23, 59, 59)
        );
    }

    @Test
    void salvar_semConflito_deveSalvarERetornarAgendamento() {
        when(schedulingRepository.findByProfissionalIdAndDataHoraBetween(anyString(), any(), any()))
                .thenReturn(Collections.emptyList());
        when(schedulingRepository.save(scheduling)).thenReturn(scheduling);

        Scheduling resultado = schedulingService.salvar(scheduling);

        assertThat(resultado).isEqualTo(scheduling);
        verify(schedulingRepository).save(scheduling);
    }

    @Test
    void salvar_comConflito_deveLancarExcecaoESemSalvar() {
        when(schedulingRepository.findByProfissionalIdAndDataHoraBetween(anyString(), any(), any()))
                .thenReturn(List.of(scheduling));

        assertThatThrownBy(() -> schedulingService.salvar(scheduling))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Profissional já possui agendamento neste horário");

        verify(schedulingRepository, never()).save(any());
    }

    @Test
    void atualizarStatus_deveAlterarStatusERetornarAgendamento() {
        when(schedulingRepository.findById("1")).thenReturn(Optional.of(scheduling));
        when(schedulingRepository.save(scheduling)).thenReturn(scheduling);

        Scheduling resultado = schedulingService.atualizarStatus("1", Scheduling.StatusScheduling.COMPLETED);

        assertThat(resultado.getStatus()).isEqualTo(Scheduling.StatusScheduling.COMPLETED);
        verify(schedulingRepository).save(scheduling);
    }

    @Test
    void deletar_quandoExistente_deveChamarDeleteById() {
        when(schedulingRepository.findById("1")).thenReturn(Optional.of(scheduling));

        schedulingService.deletar("1");

        verify(schedulingRepository).deleteById("1");
    }

    @Test
    void deletar_quandoNaoEncontrado_deveLancarExcecao() {
        when(schedulingRepository.findById("99")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> schedulingService.deletar("99"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Agendamento não encontrado: 99");

        verify(schedulingRepository, never()).deleteById(any());
    }
}