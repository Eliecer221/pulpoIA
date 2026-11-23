export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'ai' | 'condition' | 'output';
  name: string;
  description: string;
  icon: string;
  config: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  connections: { from: string; to: string }[];
  enabled: boolean;
}

export const WORKFLOW_TEMPLATES: Omit<Workflow, 'id'>[] = [
  {
    name: 'Chat Bot con IA',
    description: 'Responde preguntas usando IA',
    nodes: [
      { id: '1', type: 'trigger', name: 'Mensaje', description: 'Recibe un mensaje', icon: '💬', config: {} },
      { id: '2', type: 'ai', name: 'Procesar con IA', description: 'Envía a OpenAI/Claude/etc', icon: '🤖', config: { provider: 'openai', model: 'gpt-4o' } },
      { id: '3', type: 'output', name: 'Respuesta', description: 'Devuelve la respuesta', icon: '📤', config: {} },
    ],
    connections: [{ from: '1', to: '2' }, { from: '2', to: '3' }],
    enabled: true,
  },
  {
    name: 'Análisis de Código',
    description: 'Analiza código y sugiere mejoras',
    nodes: [
      { id: '1', type: 'trigger', name: 'Código', description: 'Recibe código', icon: '📝', config: {} },
      { id: '2', type: 'ai', name: 'Analizar', description: 'Analiza con IA', icon: '🔍', config: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' } },
      { id: '3', type: 'output', name: 'Sugerencias', description: 'Devuelve sugerencias', icon: '💡', config: {} },
    ],
    connections: [{ from: '1', to: '2' }, { from: '2', to: '3' }],
    enabled: true,
  },
];

export const INTEGRATIONS = [
  { id: 'webhook', name: 'Webhook', description: 'Recibe datos HTTP', icon: '🔗', color: 'blue' },
  { id: 'http', name: 'HTTP Request', description: 'Hace peticiones HTTP', icon: '🌐', color: 'green' },
  { id: 'database', name: 'Base de Datos', description: 'SQLite/PostgreSQL/MySQL', icon: '🗄️', color: 'purple' },
  { id: 'file', name: 'Archivo', description: 'Lee/escribe archivos', icon: '📁', color: 'yellow' },
];