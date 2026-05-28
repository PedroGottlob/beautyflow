import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/services/api.service';
import { Cliente } from '../../core/models/models';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatTableModule, MatIconModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h2>👥 Clientes</h2>
        <button mat-raised-button color="primary" (click)="abrirModal()">+ Novo Cliente</button>
      </div>

      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Buscar por nome</mat-label>
        <input matInput [(ngModel)]="busca" (input)="filtrar()" placeholder="Digite o nome..." />
      </mat-form-field>

      <mat-card>
        <table mat-table [dataSource]="clientesFiltrados" class="full-width">
          <ng-container matColumnDef="nome">
            <th mat-header-cell *matHeaderCellDef>Nome</th>
            <td mat-cell *matCellDef="let c">{{ c.name }}</td>
          </ng-container>
          <ng-container matColumnDef="telefone">
            <th mat-header-cell *matHeaderCellDef>Telefone</th>
            <td mat-cell *matCellDef="let c">{{ c.phone }}</td>
          </ng-container>
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>E-mail</th>
            <td mat-cell *matCellDef="let c">{{ c.email || '-' }}</td>
          </ng-container>
          <ng-container matColumnDef="acoes">
            <th mat-header-cell *matHeaderCellDef>Ações</th>
            <td mat-cell *matCellDef="let c">
              <button mat-icon-button (click)="editar(c)">✏️</button>
              <button mat-icon-button (click)="deletar(c.id)">🗑️</button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="colunas"></tr>
          <tr mat-row *matRowDef="let row; columns: colunas;"></tr>
        </table>
        <div *ngIf="clientesFiltrados.length === 0" class="empty">Nenhum cliente encontrado</div>
      </mat-card>
    </div>

    <!-- Modal -->
    <div class="modal-overlay" *ngIf="modalAberto" (click)="fecharModal()">
      <mat-card class="modal" (click)="$event.stopPropagation()">
        <h3>{{ editando ? 'Editar' : 'Novo' }} Cliente</h3>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome *</mat-label>
          <input matInput [(ngModel)]="form.name" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Telefone *</mat-label>
          <input matInput [(ngModel)]="form.phone" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>E-mail</mat-label>
          <input matInput type="email" [(ngModel)]="form.email" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Observações</mat-label>
          <textarea matInput [(ngModel)]="form.observations" rows="3"></textarea>
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
    .search-field { width: 100%; max-width: 400px; margin-bottom: 1rem; }
    .full-width { width: 100%; }
    .empty { padding: 2rem; text-align: center; color: #aaa; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { width: 100%; max-width: 480px; padding: 2rem !important; }
    .modal h3 { margin: 0 0 1.5rem; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem; }
    .erro { color: #e53935; font-size: 0.85rem; margin-bottom: 0.75rem; }
  `]
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  colunas = ['nome', 'telefone', 'email', 'acoes'];
  busca = '';
  modalAberto = false;
  editando = false;
  erro = '';
  idEditando = '';
  form: Cliente = { name: '', phone: '' };

  constructor(private api: ApiService) {}

  ngOnInit(): void { this.carregar(); }

  carregar(): void {
    this.api.getClientes().subscribe(c => {
      this.clientes = c;
      this.clientesFiltrados = c;
    });
  }

  filtrar(): void {
    this.clientesFiltrados = this.clientes.filter(c =>
      c.name.toLowerCase().includes(this.busca.toLowerCase())
    );
  }

  abrirModal(): void {
    this.form = { name: '', phone: '' };
    this.editando = false;
    this.erro = '';
    this.modalAberto = true;
  }

  editar(c: Cliente): void {
    this.form = { ...c };
    this.idEditando = c.id!;
    this.editando = true;
    this.erro = '';
    this.modalAberto = true;
  }

  fecharModal(): void { this.modalAberto = false; }

  salvar(): void {
    if (!this.form.name || !this.form.phone) {
      this.erro = 'Nome e telefone são obrigatórios';
      return;
    }
    const op = this.editando
      ? this.api.atualizarCliente(this.idEditando, this.form)
      : this.api.criarCliente(this.form);

    op.subscribe({
      next: () => { this.fecharModal(); this.carregar(); },
      error: e => this.erro = e.error?.message || 'Erro ao salvar'
    });
  }

  deletar(id: string): void {
    if (confirm('Excluir este cliente?')) {
      this.api.deletarCliente(id).subscribe(() => this.carregar());
    }
  }
}