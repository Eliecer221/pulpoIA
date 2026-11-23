export interface AIProvider {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'gemini' | 'custom' | 'ollama';
  baseUrl?: string;
  models: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  provider: string;
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatResponse {
  content: string;
  tokens: number;
  model: string;
  provider: string;
}

export const PROVIDERS: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    type: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    type: 'anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229'],
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    type: 'gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash-exp'],
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    type: 'ollama',
    baseUrl: 'http://localhost:11434',
    models: ['llama3.2', 'codellama', 'mistral', 'phi3'],
  },
  {
    id: 'groq',
    name: 'Groq (Fast)',
    type: 'openai',
    baseUrl: 'https://api.groq.com/openai/v1',
    models: ['llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
  },
];
