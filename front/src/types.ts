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

// src/types.ts

export interface Draft {
  id: number;
  title: string;
  recipient: string;
  content: string;
}

// ... other type definitions


export const ItemTypes = {
  AGENT: 'AGENT',
};