// src/api.ts

import axios from 'axios';
import { User, Agent, Draft } from './types';

// Set up base URL for axios
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Replace with your API base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication controllers
export const loginUser = async (email: string, password: string): Promise<User> => {
  const response = await apiClient.post<User>('/login', { email, password });
  return response.data;
};

export const registerUser = async (user: User): Promise<User> => {
  const response = await apiClient.post<User>('/register', user);
  return response.data;
};

// Agents controllers
export const getAgents = async (): Promise<Agent[]> => {
  const response = await apiClient.get<Agent[]>('/agents');
  return response.data;
};

export const createAgent = async (agent: Agent): Promise<Agent> => {
  const response = await apiClient.post<Agent>('/agents', agent);
  return response.data;
};

export const updateAgent = async (agent: Agent): Promise<Agent> => {
  const response = await apiClient.put<Agent>(`/agents/${agent.id}`, agent);
  return response.data;
};

// Additional controllers can be defined similarly