// src/types.ts
export type Pessoa = {
  id: string;
  nome: string;
  valor: number;
  isEditado: boolean;
};

export type Conta = {
  id: string;
  nome: string;
  pessoas: Pessoa[];
  total: number;
};
