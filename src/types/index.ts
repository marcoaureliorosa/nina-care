export interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

export interface Paciente {
  id: string;
  nome: string;
  telefone: string;
  // Add other paciente properties as needed
}

export interface FollowUp {
  id: string;
  user_number: string;
  created_at: string;
  tag: string;
  userid: string;
  status: 'pendente' | 'enviado' | 'falhou';
  dt_envio: string;
}

export interface Organizacao {
  id: string;
  nome: string;
  procedimentos_realizados: number;
  telefone_emergencia?: string;
} 