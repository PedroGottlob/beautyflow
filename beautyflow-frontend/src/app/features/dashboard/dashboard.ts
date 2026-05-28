import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../core/services/api.service';
import { forkJoin } from 'rxjs';
import { Agendamento, Servico } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h2>Dashboard</h2>
        <span class="data-hoje">{{ hoje }}</span>
      </div>

      <!-- Cards de resumo -->
      <div class="cards-grid">
        <mat-card class="stat-card card-purple">
          <div class="card-content">
            <span class="card-icon">📅</span>
            <div>
              <div class="card-number">{{ agendamentosHoje }}</div>
              <div class="card-label">Agendamentos Hoje</div>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card card-blue">
          <div class="card-content">
            <span class="card-icon">👥</span>
            <div>
              <div class="card-number">{{ totalClientes }}</div>
              <div class="card-label">Clientes</div>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card card-green">
          <div class="card-content">
            <span class="card-icon">💼</span>
            <div>
              <div class="card-number">{{ totalProfissionais }}</div>
              <div class="card-label">Profissionais</div>
            </div>
          </div>
        </mat-card>
        <mat-card class="stat-card card-orange">
          <div class="card-content">
            <span class="card-icon">💰</span>
            <div>
              <div class="card-number">{{ faturamentoHoje | currency:'BRL' }}</div>
              <div class="card-label">Faturamento Hoje</div>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Gráficos -->
      <div class="charts-grid">

        <!-- Agendamentos por status -->
        <mat-card class="chart-card">
          <h3>📊 Agendamentos por Status</h3>
          <div class="bar-chart">
            <div class="bar-item" *ngFor="let item of statusData">
              <div class="bar-label">{{ item.label }}</div>
              <div class="bar-track">
                <div class="bar-fill" [style.width.%]="item.percent" [style.background]="item.color"></div>
              </div>
              <div class="bar-value">{{ item.value }}</div>
            </div>
          </div>
        </mat-card>

        <!-- Serviços mais agendados -->
        <mat-card class="chart-card">
          <h3>✨ Serviços Mais Agendados</h3>
          <div class="bar-chart">
            <div class="bar-item" *ngFor="let item of servicosData">
              <div class="bar-label">{{ item.label }}</div>
              <div class="bar-track">
                <div class="bar-fill" [style.width.%]="item.percent" style="background: #7b1fa2"></div>
              </div>
              <div class="bar-value">{{ item.value }}</div>
            </div>
          </div>
          <div *ngIf="servicosData.length === 0" class="empty-chart">Nenhum agendamento ainda</div>
        </mat-card>

        <!-- Agendamentos por dia da semana -->
        <mat-card class="chart-card full-width-chart">
          <h3>📅 Agendamentos por Dia da Semana</h3>
          <div class="week-chart">
            <div class="week-item" *ngFor="let item of semanaData">
              <div class="week-bar-container">
                <div class="week-bar" [style.height.%]="item.percent" style="background: #7b1fa2"></div>
              </div>
              <div class="week-label">{{ item.label }}</div>
              <div class="week-value">{{ item.value }}</div>
            </div>
          </div>
        </mat-card>

      </div>

      <!-- Ações Rápidas -->
      <h3>Ações Rápidas</h3>
      <div class="quick-actions">
        <button mat-raised-button color="primary" routerLink="/agendamentos">➕ Novo Agendamento</button>
        <button mat-raised-button routerLink="/clientes">👤 Novo Cliente</button>
        <button mat-raised-button routerLink="/profissionais">💼 Novo Profissional</button>
        <button mat-raised-button routerLink="/servicos">✨ Novo Serviço</button>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .page-header h2 { margin: 0; font-size: 1.6rem; color: #222; }
    .data-hoje { color: #888; }

    /* Cards */
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 2rem; }
    .stat-card { padding: 1.5rem !important; }
    .card-content { display: flex; align-items: center; gap: 1rem; }
    .card-icon { font-size: 2.5rem; }
    .card-number { font-size: 1.8rem; font-weight: 700; line-height: 1; }
    .card-label { font-size: 0.8rem; color: #888; margin-top: 0.25rem; }
    .card-purple .card-number { color: #7b1fa2; }
    .card-blue .card-number { color: #1565c0; }
    .card-green .card-number { color: #2e7d32; }
    .card-orange .card-number { color: #e65100; }

    /* Gráficos */
    .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 2rem; }
    .chart-card { padding: 1.5rem !important; }
    .chart-card h3 { margin: 0 0 1.5rem; font-size: 1rem; color: #444; }
    .full-width-chart { grid-column: 1 / -1; }

    /* Barras horizontais */
    .bar-chart { display: flex; flex-direction: column; gap: 0.75rem; }
    .bar-item { display: flex; align-items: center; gap: 0.75rem; }
    .bar-label { width: 100px; font-size: 0.85rem; color: #555; text-align: right; flex-shrink: 0; }
    .bar-track { flex: 1; background: #f0f0f0; border-radius: 4px; height: 24px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; min-width: 4px; }
    .bar-value { width: 30px; font-size: 0.85rem; font-weight: 600; color: #333; }

    /* Barras verticais (semana) */
    .week-chart { display: flex; align-items: flex-end; gap: 1rem; height: 150px; padding-top: 1rem; }
    .week-item { display: flex; flex-direction: column; align-items: center; flex: 1; height: 100%; }
    .week-bar-container { flex: 1; width: 100%; display: flex; align-items: flex-end; }
    .week-bar { width: 100%; border-radius: 4px 4px 0 0; transition: height 0.5s ease; min-height: 4px; }
    .week-label { font-size: 0.75rem; color: #666; margin-top: 0.5rem; }
    .week-value { font-size: 0.8rem; font-weight: 600; color: #333; }

    .empty-chart { text-align: center; color: #aaa; padding: 2rem; font-size: 0.9rem; }

    h3 { color: #444; margin-bottom: 1rem; }
    .quick-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
  `]
})
export class DashboardComponent implements OnInit {
  hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  agendamentosHoje = 0;
  totalClientes = 0;
  totalProfissionais = 0;
  faturamentoHoje = 0;

  statusData: { label: string; value: number; percent: number; color: string }[] = [];
  servicosData: { label: string; value: number; percent: number }[] = [];
  semanaData: { label: string; value: number; percent: number }[] = [];

  private diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    forkJoin({
      clientes: this.api.getClientes(),
      profissionais: this.api.getProfissionais(),
      servicos: this.api.getServicos(),
      agendamentos: this.api.getAgendamentos(),
      agendamentosHoje: this.api.getAgendamentosDia(new Date().toISOString())
    }).subscribe({
      next: ({ clientes, profissionais, servicos, agendamentos, agendamentosHoje }) => {
        this.totalClientes = clientes.length;
        this.totalProfissionais = profissionais.length;
        this.agendamentosHoje = agendamentosHoje.length;

        this.calcularFaturamento(agendamentosHoje, servicos);
        this.calcularStatusData(agendamentos);
        this.calcularServicosData(agendamentos, servicos);
        this.calcularSemanaData(agendamentos);
      },
      error: () => {}
    });
  }

  private calcularFaturamento(agendamentos: Agendamento[], servicos: Servico[]): void {
    this.faturamentoHoje = agendamentos
      .filter(a => a.status === 'COMPLETED')
      .reduce((total, a) => {
        const servico = servicos.find(s => s.id === a.serviceId);
        return total + (servico?.price || 0);
      }, 0);
  }

  private calcularStatusData(agendamentos: Agendamento[]): void {
    const scheduled = agendamentos.filter(a => a.status === 'SCHEDULED').length;
    const completed = agendamentos.filter(a => a.status === 'COMPLETED').length;
    const cancelled = agendamentos.filter(a => a.status === 'CANCELLED').length;
    const total = agendamentos.length || 1;

    this.statusData = [
      { label: 'Agendado', value: scheduled, percent: (scheduled / total) * 100, color: '#1565c0' },
      { label: 'Concluído', value: completed, percent: (completed / total) * 100, color: '#2e7d32' },
      { label: 'Cancelado', value: cancelled, percent: (cancelled / total) * 100, color: '#c62828' }
    ];
  }

  private calcularServicosData(agendamentos: Agendamento[], servicos: Servico[]): void {
    const contagem: { [key: string]: number } = {};
    agendamentos.forEach(a => {
      contagem[a.serviceId] = (contagem[a.serviceId] || 0) + 1;
    });

    const max = Math.max(...Object.values(contagem), 1);

    this.servicosData = Object.entries(contagem)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, value]) => ({
        label: servicos.find(s => s.id === id)?.name || id,
        value,
        percent: (value / max) * 100
      }));
  }

  private calcularSemanaData(agendamentos: Agendamento[]): void {
    const contagem = [0, 0, 0, 0, 0, 0, 0];
    agendamentos.forEach(a => {
      const dia = new Date(a.dateTime).getDay();
      contagem[dia]++;
    });

    const max = Math.max(...contagem, 1);

    this.semanaData = this.diasSemana.map((label, i) => ({
      label,
      value: contagem[i],
      percent: (contagem[i] / max) * 100
    }));
  }
}