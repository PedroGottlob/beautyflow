import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cliente, Profissional, Servico, Agendamento, StatusAgendamento } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private base = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // CLIENTES
    getClientes(nome?: string): Observable<Cliente[]> {
        const params = nome ? `?nome=${nome}` : '';
        return this.http.get<Cliente[]>(`${this.base}/clientes${params}`);
    }
    getCliente(id: string): Observable<Cliente> {
        return this.http.get<Cliente>(`${this.base}/clientes/${id}`);
    }
    criarCliente(c: Cliente): Observable<Cliente> {
        return this.http.post<Cliente>(`${this.base}/clientes`, c);
    }
    atualizarCliente(id: string, c: Cliente): Observable<Cliente> {
        return this.http.put<Cliente>(`${this.base}/clientes/${id}`, c);
    }
    deletarCliente(id: string): Observable<void> {
        return this.http.delete<void>(`${this.base}/clientes/${id}`);
    }

    // PROFISSIONAIS
    getProfissionais(apenasAtivos = false): Observable<Profissional[]> {
        return this.http.get<Profissional[]>(`${this.base}/profissionais?apenasAtivos=${apenasAtivos}`);
    }
    criarProfissional(p: Profissional): Observable<Profissional> {
        return this.http.post<Profissional>(`${this.base}/profissionais`, p);
    }
    atualizarProfissional(id: string, p: Profissional): Observable<Profissional> {
        return this.http.put<Profissional>(`${this.base}/profissionais/${id}`, p);
    }
    toggleAtivoProfissional(id: string): Observable<Profissional> {
        return this.http.patch<Profissional>(`${this.base}/profissionais/${id}/toggle-ativo`, {});
    }
    deletarProfissional(id: string): Observable<void> {
        return this.http.delete<void>(`${this.base}/profissionais/${id}`);
    }

    // SERVIÇOS
    getServicos(apenasAtivos = false): Observable<Servico[]> {
        return this.http.get<Servico[]>(`${this.base}/servicos?apenasAtivos=${apenasAtivos}`);
    }
    criarServico(s: Servico): Observable<Servico> {
        return this.http.post<Servico>(`${this.base}/servicos`, s);
    }
    atualizarServico(id: string, s: Servico): Observable<Servico> {
        return this.http.put<Servico>(`${this.base}/servicos/${id}`, s);
    }
    deletarServico(id: string): Observable<void> {
        return this.http.delete<void>(`${this.base}/servicos/${id}`);
    }

    // AGENDAMENTOS
    getAgendamentos(): Observable<Agendamento[]> {
        return this.http.get<Agendamento[]>(`${this.base}/agendamentos`);
    }
    getAgendamentosDia(data: string): Observable<Agendamento[]> {
        return this.http.get<Agendamento[]>(`${this.base}/agendamentos/dia?data=${data}`);
    }
    criarAgendamento(a: Agendamento): Observable<Agendamento> {
        return this.http.post<Agendamento>(`${this.base}/agendamentos`, a);
    }
    atualizarStatus(id: string, status: StatusAgendamento): Observable<Agendamento> {
        return this.http.patch<Agendamento>(`${this.base}/agendamentos/${id}/status?status=${status}`, {});
    }
    deletarAgendamento(id: string): Observable<void> {
        return this.http.delete<void>(`${this.base}/agendamentos/${id}`);
    }
}