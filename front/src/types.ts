// src/types.ts

export interface User {
  email: string;
  password: string;
  name: string;
}

export interface Agent {
  id: number;
  name: string;
  prompt?: string;
  pdfs: string[];
}

export interface Draft {
  id: number;
  title: string;
  agent: string;
  recipient: string;
  content: string;
  isRead: boolean;
}

export const ItemTypes = {
  AGENT: 'AGENT',
};