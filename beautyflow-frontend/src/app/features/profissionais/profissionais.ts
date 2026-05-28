import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../core/services/api.service';
import { Profissional } from '../../core/models/models';

@Component({
  selector: 'app-profissionais',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatTableModule, MatChipsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h2>💼 Profissionais</h2>
        <button mat-raised-button color="primary" (click)="abrirModal()">+ Novo Profissional</button>
      </div>

      <mat-card>
        <table mat-table [dataSource]="profissionais" class="full-width">
          <ng-container matColumnDef="nome">
            <th mat-header-cell *matHeaderCellDef>Nome</th>
            <td mat-cell *matCellDef="let p">{{ p.name }}</td>
          </ng-container>
          <ng-container matColumnDef="especialidade">
            <th mat-header-cell *matHeaderCellDef>Especialidade</th>
            <td mat-cell *matCellDef="let p">{{ p.specialty }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let p">
              <span class="badge" [class.ativo]="p.active" [class.inativo]="!p.active">
                {{ p.active ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="acoes">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let p">
              <button mat-icon-button (click)="editar(p)">✏️</button>
              <button mat-icon-button (click)="toggleAtivo(p.id)">{{ p.active ? '🚫' : '✅' }}</button>
              <button mat-icon-button (click)="deletar(p.id)">🗑️</button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="colunas"></tr>
          <tr mat-row *matRowDef="let row; columns: colunas;"></tr>
        </table>
      </mat-card>
    </div>

    <div class="modal-overlay" *ngIf="modalAberto" (click)="fecharModal()">
      <mat-card class="modal" (click)="$event.stopPropagation()">
        <h3>{{ editando ? 'Editar' : 'Novo' }} Profissional</h3>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome *</mat-label>
          <input matInput [(ngModel)]="form.name" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Especialidade *</mat-label>
          <input matInput [(ngModel)]="form.specialty" placeholder="Ex: Cabeleireiro, Manicure..." />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Telefone</mat-label>
          <input matInput [(ngModel)]="form.phone" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>E-mail</mat-label>
          <input matInput type="email" [(ngModel)]="form.email" />
        </mat-form-field>
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
export class ProfissionaisComponent implements OnInit {
  profissionais: Profissional[] = [];
  colunas = ['nome', 'especialidade', 'status', 'acoes'];
  modalAberto = false;
  editando = false;
  erro = '';
  idEditando = '';
  form: Profissional = { name: '', specialty: '', active: true };

  constructor(private api: ApiService) {}

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.api.getProfissionais().subscribe(p => this.profissionais = p);
  }

  abrirModal(): void {
    this.form = { name: '', specialty: '', active: true };
    this.editando = false;
    this.erro = '';
    this.modalAberto = true;
  }

  editar(p: Profissional): void {
    this.form = { ...p };
    this.idEditando = p.id!;
    this.editando = true;
    this.modalAberto = true;
  }

  fecharModal(): void { this.modalAberto = false; }

  salvar(): void {
    if (!this.form.name || !this.form.specialty) {
      this.erro = 'Nome e especialidade são obrigatórios';
      return;
    }
    const op = this.editando
      ? this.api.atualizarProfissional(this.idEditando, this.form)
      : this.api.criarProfissional(this.form);

    op.subscribe({
      next: () => { this.fecharModal(); this.carregar(); },
      error: e => this.erro = e.error?.message || 'Erro ao salvar'
    });
  }

  toggleAtivo(id: string): void {
    this.api.toggleAtivoProfissional(id).subscribe(() => this.carregar());
  }

  deletar(id: string): void {
    if (confirm('Excluir este profissional?')) {
      this.api.deletarProfissional(id).subscribe(() => this.carregar());
    }
  }
}