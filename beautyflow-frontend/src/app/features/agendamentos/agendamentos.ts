import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../core/services/api.service';
import { Agendamento, Cliente, Profissional, Servico, StatusAgendamento } from '../../core/models/models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatTableModule, MatSelectModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h2>📅 Agendamentos</h2>
        <button mat-raised-button color="primary" (click)="abrirModal()">+ Novo Agendamento</button>
      </div>

      <div class="filtro">
        <mat-form-field appearance="outline">
          <mat-label>Filtrar por data</mat-label>
          <input matInput type="date" [(ngModel)]="dataSelecionada" (change)="filtrarPorData()" />
        </mat-form-field>
        <button mat-stroked-button (click)="verTodos()">Ver Todos</button>
      </div>

      <mat-card>
        <table mat-table [dataSource]="agendamentos" class="full-width">
          <ng-container matColumnDef="dataHora">
            <th mat-header-cell *matHeaderCellDef>Data/Hora</th>
            <td mat-cell *matCellDef="let a">{{ a.dateTime | date:'dd/MM/yyyy HH:mm' }}</td>
          </ng-container>
          <ng-container matColumnDef="cliente">
            <th mat-header-cell *matHeaderCellDef>Cliente</th>
            <td mat-cell *matCellDef="let a">{{ getNomeCliente(a.clientId) }}</td>
          </ng-container>
          <ng-container matColumnDef="profissional">
            <th mat-header-cell *matHeaderCellDef>Profissional</th>
            <td mat-cell *matCellDef="let a">{{ getNomeProfissional(a.professionalId) }}</td>
          </ng-container>
          <ng-container matColumnDef="servico">
            <th mat-header-cell *matHeaderCellDef>Serviço</th>
            <td mat-cell *matCellDef="let a">{{ getNomeServico(a.serviceId) }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let a">
              <span class="badge"
                [class.agendado]="a.status === 'SCHEDULED'"
                [class.concluido]="a.status === 'COMPLETED'"
                [class.cancelado]="a.status === 'CANCELLED'">
                {{ a.status }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="acoes">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let a">
              <button mat-icon-button *ngIf="a.status === 'SCHEDULED'" (click)="concluir(a.id)" title="Concluir">✅</button>
              <button mat-icon-button *ngIf="a.status === 'SCHEDULED'" (click)="cancelar(a.id)" title="Cancelar">❌</button>
              <button mat-icon-button (click)="deletar(a.id)" title="Excluir">🗑️</button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="colunas"></tr>
          <tr mat-row *matRowDef="let row; columns: colunas;"></tr>
        </table>
        <div *ngIf="agendamentos.length === 0" class="empty">Nenhum agendamento encontrado</div>
      </mat-card>
    </div>

    <div class="modal-overlay" *ngIf="modalAberto" (click)="fecharModal()">
      <mat-card class="modal" (click)="$event.stopPropagation()">
        <h3>Novo Agendamento</h3>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Cliente *</mat-label>
          <mat-select [(ngModel)]="form.clientId">
            <mat-option *ngFor="let c of clientes" [value]="c.id">{{ c.name }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Profissional *</mat-label>
          <mat-select [(ngModel)]="form.professionalId">
            <mat-option *ngFor="let p of profissionais" [value]="p.id">{{ p.name }} - {{ p.specialty }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Serviço *</mat-label>
          <mat-select [(ngModel)]="form.serviceId">
            <mat-option *ngFor="let s of servicos" [value]="s.id">{{ s.name }} ({{ s.durationMinutes }}min)</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Data e Hora *</mat-label>
          <input matInput type="datetime-local" [(ngModel)]="dateTimeInput" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Observações</mat-label>
          <textarea matInput [(ngModel)]="form.observations" rows="2"></textarea>
        </mat-form-field>
        <div *ngIf="erro" class="erro">{{ erro }}</div>
        <div class="modal-actions">
          <button mat-stroked-button (click)="fecharModal()">Cancelar</button>
          <button mat-raised-button color="primary" (click)="salvar()">Agendar</button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .page-header h2 { margin: 0; font-size: 1.6rem; }
    .filtro { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
    .full-width { width: 100%; }
    .empty { padding: 2rem; text-align: center; color: #aaa; }
    .badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    .agendado { background: #e3f2fd; color: #1565c0; }
    .concluido { background: #e8f5e9; color: #2e7d32; }
    .cancelado { background: #fce4ec; color: #c62828; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { width: 100%; max-width: 500px; padding: 2rem !important; max-height: 90vh; overflow-y: auto; }
    .modal h3 { margin: 0 0 1.5rem; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem; }
    .erro { color: #e53935; font-size: 0.85rem; margin-bottom: 0.75rem; }
  `]
})
export class AgendamentosComponent implements OnInit {
  agendamentos: Agendamento[] = [];
  clientes: Cliente[] = [];
  profissionais: Profissional[] = [];
  servicos: Servico[] = [];
  colunas = ['dataHora', 'cliente', 'profissional', 'servico', 'status', 'acoes'];
  modalAberto = false;
  erro = '';
  dataSelecionada = '';
  dateTimeInput = '';
  form: Partial<Agendamento> = { status: 'SCHEDULED' };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    forkJoin({
      clientes: this.api.getClientes(),
      profissionais: this.api.getProfissionais(true),
      servicos: this.api.getServicos(true),
      agendamentos: this.api.getAgendamentos()
    }).subscribe({
      next: ({ clientes, profissionais, servicos, agendamentos }) => {
        this.clientes = clientes;
        this.profissionais = profissionais;
        this.servicos = servicos;
        this.agendamentos = agendamentos;
      },
      error: () => {}
    });
  }

  getNomeCliente(id: string): string {
    return this.clientes.find(c => c.id === id)?.name ?? id;
  }

  getNomeProfissional(id: string): string {
    return this.profissionais.find(p => p.id === id)?.name ?? id;
  }

  getNomeServico(id: string): string {
    return this.servicos.find(s => s.id === id)?.name ?? id;
  }

  filtrarPorData(): void {
    if (this.dataSelecionada) {
      const iso = new Date(this.dataSelecionada).toISOString();
      this.api.getAgendamentosDia(iso).subscribe(a => this.agendamentos = a);
    }
  }

  verTodos(): void {
    this.dataSelecionada = '';
    this.api.getAgendamentos().subscribe(a => this.agendamentos = a);
  }

  abrirModal(): void {
    this.form = { status: 'SCHEDULED', clientId: '', professionalId: '', serviceId: '' };
    this.dateTimeInput = '';
    this.erro = '';
    this.modalAberto = true;
  }

  fecharModal(): void { this.modalAberto = false; }

  salvar(): void {
    if (!this.form.clientId || !this.form.professionalId || !this.form.serviceId || !this.dateTimeInput) {
      this.erro = 'Preencha todos os campos obrigatórios';
      return;
    }
    this.form.dateTime = new Date(this.dateTimeInput).toISOString();
    this.api.criarAgendamento(this.form as Agendamento).subscribe({
      next: () => { this.fecharModal(); this.api.getAgendamentos().subscribe(a => this.agendamentos = a); },
      error: e => this.erro = e.error?.message || 'Erro ao agendar'
    });
  }

  concluir(id: string): void {
    this.api.atualizarStatus(id, 'COMPLETED').subscribe(() => this.api.getAgendamentos().subscribe(a => this.agendamentos = a));
  }

  cancelar(id: string): void {
    if (confirm('Cancelar este agendamento?')) {
      this.api.atualizarStatus(id, 'CANCELLED').subscribe(() => this.api.getAgendamentos().subscribe(a => this.agendamentos = a));
    }
  }

  deletar(id: string): void {
    if (confirm('Excluir este agendamento?')) {
      this.api.deletarAgendamento(id).subscribe(() => this.api.getAgendamentos().subscribe(a => this.agendamentos = a));
    }
  }
}