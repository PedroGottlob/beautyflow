export interface Cliente {
  id?: string;
  name: string;
  email?: string;
  phone: string;
  observations?: string;
  criadoEm?: string;
}

export interface Profissional {
  id?: string;
  name: string;
  specialty: string;
  phone?: string;
  email?: string;
  servicesIds?: string[];
  active: boolean;
}

export interface Servico {
  id?: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  active: boolean;
}

export type StatusAgendamento = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface Agendamento {
  id?: string;
  clientId: string;
  professionalId: string;
  serviceId: string;
  dateTime: string;
  status: StatusAgendamento;
  observations?: string;
  createdIn?: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  nome: string;
  email: string;
  role: string;
}