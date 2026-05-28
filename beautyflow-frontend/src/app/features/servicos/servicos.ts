import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from '../../core/services/api.service';
import { Servico } from '../../core/models/models';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatTableModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h2>✨ Serviços</h2>
        <button mat-raised-button color="primary" (click)="abrirModal()">+ Novo Serviço</button>
      </div>

      <mat-card>
        <table mat-table [dataSource]="servicos" class="full-width">
          <ng-container matColumnDef="nome">
            <th mat-header-cell *matHeaderCellDef>Nome</th>
            <td mat-cell *matCellDef="let s">{{ s.name }}</td>
          </ng-container>
          <ng-container matColumnDef="duracao">
            <th mat-header-cell *matHeaderCellDef>Duração</th>
            <td mat-cell *matCellDef="let s">{{ s.durationMinutes }} min</td>
          </ng-container>
          <ng-container matColumnDef="preco">
            <th mat-header-cell *matHeaderCellDef>Preço</th>
            <td mat-cell *matCellDef="let s">{{ s.price | currency:'BRL' }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let s">
              <span class="badge" [class.ativo]="s.active" [class.inativo]="!s.active">
                {{ s.active ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="acoes">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let s">
              <button mat-icon-button (click)="editar(s)">✏️</button>
              <button mat-icon-button (click)="deletar(s.id)">🗑️</button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="colunas"></tr>
          <tr mat-row *matRowDef="let row; columns: colunas;"></tr>
        </table>
      </mat-card>
    </div>

    <div class="modal-overlay" *ngIf="modalAberto" (click)="fecharModal()">
      <mat-card class="modal" (click)="$event.stopPropagation()">
        <h3>{{ editando ? 'Editar' : 'Novo' }} Serviço</h3>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome *</mat-label>
          <input matInput [(ngModel)]="form.name" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descrição</mat-label>
          <textarea matInput [(ngModel)]="form.description" rows="2"></textarea>
        </mat-form-field>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Preço (R$) *</mat-label>
            <input matInput type="number" [(ngModel)]="form.price" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Duração (min) *</mat-label>
            <input matInput type="number" [(ngModel)]="form.durationMinutes" />
          </mat-form-field>
        </div>
        <div *ngIf="erro" class="erro">{{ erro }}</div>
        <div class="modal-actions">
          <button mat-stroked-button (click)="fecharModal()">Cancelar</button>
          <button mat-raised-button color="primary" (click)="salvar()">Salvar</button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .page-header h2 { margin: 0; font-size: 1.6rem; }
    .full-width { width: 100%; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    .ativo { background: #e8f5e9; color: #2e7d32; }
    .inativo { background: #fce4ec; color: #c62828; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { width: 100%; max-width: 480px; padding: 2rem !important; }
    .modal h3 { margin: 0 0 1.5rem; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem; }
    .erro { color: #e53935; font-size: 0.85rem; margin-bottom: 0.75rem; }
  `]
})
export class ServicosComponent implements OnInit {
  servicos: Servico[] = [];
  colunas = ['nome', 'duracao', 'preco', 'status', 'acoes'];
  modalAberto = false;
  editando = false;
  erro = '';
  idEditando = '';
  form: Servico = { name: '', price: 0, durationMinutes: 60, active: true };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getServicos().subscribe(s => this.servicos = s);
  }

  abrirModal(): void {
    this.form = { name: '', price: 0, durationMinutes: 60, active: true };
    this.editando = false;
    this.erro = '';
    this.modalAberto = true;
  }

  editar(s: Servico): void {
    this.form = { ...s };
    this.idEditando = s.id!;
    this.editando = true;
    this.modalAberto = true;
  }

  fecharModal(): void { this.modalAberto = false; }

  salvar(): void {
    if (!this.form.name || !this.form.price || !this.form.durationMinutes) {
      this.erro = 'Nome, preço e duração são obrigatórios';
      return;
    }
    const op = this.editando
      ? this.api.atualizarServico(this.idEditando, this.form)
      : this.api.criarServico(this.form);

    op.subscribe({
      next: () => { this.fecharModal(); this.api.getServicos().subscribe(s => this.servicos = s); },
      error: e => this.erro = e.error?.message || 'Erro ao salvar'
    });
  }

  deletar(id: string): void {
    if (confirm('Excluir este serviço?')) {
      this.api.deletarServico(id).subscribe(() => this.api.getServicos().subscribe(s => this.servicos = s));
    }
  }
}