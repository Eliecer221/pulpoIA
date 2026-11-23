export interface AIProvider {
  id: string;
  name: string;
  description: string;
  type: 'openai' | 'anthropic' | 'gemini' | 'custom' | 'ollama';
  baseUrl: string;
  models: string[];
  apiKeyRequired: boolean;
  freeTier?: boolean;
  category: 'cloud' | 'local' | 'enterprise';
  icon?: string;
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Gemini 1.5 Pro, Flash y 2.0 - GRATIS',
    type: 'gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash-exp'],
    apiKeyRequired: true,
    freeTier: true,
    category: 'cloud',
    icon: '✨',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4, GPT-3.5 y modelos o1',
    type: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
    apiKeyRequired: true,
    freeTier: false,
    category: 'cloud',
    icon: '🤖',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude 3.5 Sonnet, Opus y Haiku',
    type: 'anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229'],
    apiKeyRequired: true,
    freeTier: false,
    category: 'cloud',
    icon: '🧠',
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'Llama 3.1 ultra-rápido - GRATIS',
    type: 'openai',
    baseUrl: 'https://api.groq.com/openai/v1',
    models: ['llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    apiKeyRequired: true,
    freeTier: true,
    category: 'cloud',
    icon: '⚡',
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    description: 'Mistral Large, Medium y Small',
    type: 'openai',
    baseUrl: 'https://api.mistral.ai/v1',
    models: ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest'],
    apiKeyRequired: true,
    freeTier: true,
    category: 'cloud',
    icon: '🌬️',
  },
  {
    id: 'ollama',
    name: 'Ollama',
    description: 'Modelos locales en tu maquina',
    type: 'ollama',
    baseUrl: 'http://localhost:11434',
    models: ['llama3.2', 'codellama', 'mistral', 'phi3'],
    apiKeyRequired: false,
    freeTier: true,
    category: 'local',
    icon: '🦙',
  },
];

export const PROVIDER_CATEGORIES = {
  cloud: { name: 'Cloud', icon: '☁️', color: 'blue' },
  local: { name: 'Local', icon: '💻', color: 'green' },
  enterprise: { name: 'Enterprise', icon: '🏢', color: 'purple' },
};

export function getProvidersByCategory(category: string): AIProvider[] {
  return AI_PROVIDERS.filter(p => p.category === category);
}

export function searchProviders(query: string): AIProvider[] {
  const q = query.toLowerCase();
  return AI_PROVIDERS.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.models.some(m => m.toLowerCase().includes(q))
  );
}