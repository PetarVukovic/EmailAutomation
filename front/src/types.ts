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
  sender: string;
  recipient: string;
  subject: string;
  content: string;
  unread: boolean;
}


// ... other type definitions


export const ItemTypes = {
  AGENT: 'AGENT',
};