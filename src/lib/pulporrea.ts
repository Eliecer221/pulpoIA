// PulpoRea - Verified Applications Registry
// Inspired by REA (Reverse Engineer Anything)

export interface VerifiedApp {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: 'security' | 'development' | 'automation' | 'ai' | 'network' | 'forensics';
  icon: string;
  verified: boolean;
  verifiedDate?: string;
  downloads?: number;
  rating?: number;
  tags: string[];
  // REA-inspired features
  analysis?: {
    type: 'binary' | 'javascript' | 'electron' | 'web' | 'dotnet' | 'android' | 'firmware';
    engine?: 'hopper' | 'ghidra' | 'ida' | 'builtin';
    evidence?: boolean;
  };
}

export interface AppCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const APP_CATEGORIES: AppCategory[] = [
  { id: 'security', name: 'Seguridad', icon: '🛡️', description: 'Herramientas de seguridad y pentesting' },
  { id: 'development', name: 'Desarrollo', icon: '💻', description: 'IDEs, editores y herramientas de desarrollo' },
  { id: 'automation', name: 'Automatización', icon: '⚙️', description: 'Workflows y automatización' },
  { id: 'ai', name: 'Inteligencia Artificial', icon: '🤖', description: 'Modelos y herramientas de IA' },
  { id: 'network', name: 'Redes', icon: '🌐', description: 'Monitoreo y análisis de red' },
  { id: 'forensics', name: 'Forense', icon: '🔍', description: 'Análisis forense digital' },
];

export const VERIFIED_APPS: VerifiedApp[] = [
  // Security Tools (REA-inspired)
  {
    id: 'ghidra',
    name: 'Ghidra',
    description: 'Framework de ingeniería inversa de NSA',
    version: '11.0',
    author: 'NSA',
    category: 'security',
    icon: '🔓',
    verified: true,
    verifiedDate: '2024-01-01',
    downloads: 50000,
    rating: 4.8,
    tags: ['reverse-engineering', 'binary-analysis', 'decompiler'],
    analysis: { type: 'binary', engine: 'ghidra', evidence: true },
  },
  {
    id: 'hopper',
    name: 'Hopper Disassembler',
    description: 'Desensamblador y decompilador para macOS/Linux',
    version: '5.0',
    author: 'Cryptic Apps',
    category: 'security',
    icon: '🐰',
    verified: true,
    downloads: 20000,
    rating: 4.6,
    tags: ['disassembler', 'decompiler', 'reverse-engineering'],
    analysis: { type: 'binary', engine: 'hopper', evidence: true },
  },
  {
    id: 'ida-pro',
    name: 'IDA Pro',
    description: 'Desensamblador y depurador multi-arquitectura',
    version: '9.0',
    author: 'Hex-Rays',
    category: 'security',
    icon: '🔬',
    verified: true,
    downloads: 100000,
    rating: 4.9,
    tags: ['disassembler', 'debugger', 'decompiler'],
    analysis: { type: 'binary', engine: 'ida', evidence: true },
  },
  // Development Tools
  {
    id: 'vscode',
    name: 'VS Code',
    description: 'Editor de código de Microsoft',
    version: '1.96',
    author: 'Microsoft',
    category: 'development',
    icon: '📝',
    verified: true,
    downloads: 1000000,
    rating: 4.7,
    tags: ['editor', 'ide', 'extensions'],
    analysis: { type: 'javascript', engine: 'builtin', evidence: true },
  },
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'Editor de código con IA',
    version: '0.42',
    author: 'Anysphere',
    category: 'development',
    icon: '🎯',
    verified: true,
    downloads: 500000,
    rating: 4.6,
    tags: ['ai', 'editor', 'code'],
    analysis: { type: 'electron', engine: 'builtin', evidence: true },
  },
  // AI Tools
  {
    id: 'ollama',
    name: 'Ollama',
    description: 'Ejecuta modelos LLM localmente',
    version: '0.5',
    author: 'Ollama',
    category: 'ai',
    icon: '🦙',
    verified: true,
    downloads: 2000000,
    rating: 4.8,
    tags: ['llm', 'local', 'ai'],
    analysis: { type: 'binary', engine: 'builtin', evidence: true },
  },
  {
    id: 'langchain',
    name: 'LangChain',
    description: 'Framework para aplicaciones LLM',
    version: '0.3',
    author: 'LangChain',
    category: 'ai',
    icon: '⛓️',
    verified: true,
    downloads: 800000,
    rating: 4.5,
    tags: ['llm', 'framework', 'agents'],
    analysis: { type: 'javascript', engine: 'builtin', evidence: true },
  },
  // Network Tools
  {
    id: 'wireshark',
    name: 'Wireshark',
    description: 'Analizador de protocolos de red',
    version: '4.4',
    author: 'Wireshark Foundation',
    category: 'network',
    icon: '🦈',
    verified: true,
    downloads: 5000000,
    rating: 4.7,
    tags: ['network', 'protocol', 'analysis'],
    analysis: { type: 'binary', engine: 'builtin', evidence: true },
  },
  {
    id: 'nmap',
    name: 'Nmap',
    description: 'Escáner de redes y puertos',
    version: '7.95',
    author: 'Gordon Lyon',
    category: 'network',
    icon: '🗺️',
    verified: true,
    downloads: 10000000,
    rating: 4.8,
    tags: ['scanner', 'network', 'security'],
    analysis: { type: 'binary', engine: 'builtin', evidence: true },
  },
  // Forensics
  {
    id: 'autopsy',
    name: 'Autopsy',
    description: 'Plataforma forense digital',
    version: '4.21',
    author: 'Basis Technology',
    category: 'forensics',
    icon: '🔎',
    verified: true,
    downloads: 300000,
    rating: 4.6,
    tags: ['forensics', 'digital', 'evidence'],
    analysis: { type: 'binary', engine: 'builtin', evidence: true },
  },
  {
    id: 'volatility',
    name: 'Volatility',
    description: 'Framework de análisis de memoria RAM',
    version: '3.0',
    author: 'Volatility Foundation',
    category: 'forensics',
    icon: '💾',
    verified: true,
    downloads: 200000,
    rating: 4.7,
    tags: ['memory', 'forensics', 'ram'],
    analysis: { type: 'binary', engine: 'builtin', evidence: true },
  },
  // Automation
  {
    id: 'n8n',
    name: 'n8n',
    description: 'Automatización de workflows open source',
    version: '1.70',
    author: 'n8n',
    category: 'automation',
    icon: '🔄',
    verified: true,
    downloads: 500000,
    rating: 4.7,
    tags: ['workflow', 'automation', 'integration'],
    analysis: { type: 'javascript', engine: 'builtin', evidence: true },
  },
  {
    id: 'activepieces',
    name: 'Activepieces',
    description: 'Automatización sin código',
    version: '0.40',
    author: 'Activepieces',
    category: 'automation',
    icon: '🧩',
    verified: true,
    downloads: 100000,
    rating: 4.5,
    tags: ['no-code', 'automation', 'workflow'],
    analysis: { type: 'javascript', engine: 'builtin', evidence: true },
  },
];

// REA-inspired analysis functions
export function analyzeApplication(app: VerifiedApp): {
  insights: string[];
  recommendations: string[];
} {
  const insights: string[] = [];
  const recommendations: string[] = [];

  if (app.analysis?.type === 'binary') {
    insights.push('🔍 Binario nativo - Análisis con ' + (app.analysis.engine || 'Ghidra'));
    insights.push('📊 Arquitectura: x86/x64/ARM');
    recommendations.push('Usar Ghidra para decompilación');
    recommendations.push('Verificar firmas digitales');
  } else if (app.analysis?.type === 'electron') {
    insights.push('⚡ App Electron - JavaScript + Node.js');
    insights.push('📦 ASAR archive detectable');
    recommendations.push('Extraer con npx asar extract');
    recommendations.push('Analizar con ESLint/SAST');
  } else if (app.analysis?.type === 'javascript') {
    insights.push('📜 Código JavaScript');
    insights.push('🔗 Dependencies rastreables');
    recommendations.push('Usar npm audit');
    recommendations.push('Análisis con Snyk');
  }

  return { insights, recommendations };
}

export function getAppsByCategory(category: string): VerifiedApp[] {
  return VERIFIED_APPS.filter(app => app.category === category);
}

export function searchApps(query: string): VerifiedApp[] {
  const q = query.toLowerCase();
  return VERIFIED_APPS.filter(app =>
    app.name.toLowerCase().includes(q) ||
    app.description.toLowerCase().includes(q) ||
    app.tags.some(tag => tag.toLowerCase().includes(q))
  );
}