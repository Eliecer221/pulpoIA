"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Settings, Workflow, Code, Terminal, Plus, MessageSquare, Upload, File, X, Paperclip, Key, Trash2, Globe, Search, Grid, List, Check, Play, Pause, User, Crown, Mail } from 'lucide-react';
import clsx from 'clsx';
import { translations, languages, type Language } from '@/lib/translations';
import { VERIFIED_APPS, APP_CATEGORIES, searchApps } from '@/lib/pulporrea';
import { AI_PROVIDERS, PROVIDER_CATEGORIES, type AIProvider } from '@/lib/providers';
import { WORKFLOW_TEMPLATES, type Workflow as WorkflowType } from '@/lib/workflows';

interface Message { role: 'user' | 'assistant'; content: string; files?: string[]; }
interface CustomProvider extends AIProvider { apiKey?: string; isCustom?: boolean; }
interface Agent { id: string; name: string; description: string; systemPrompt: string; provider: string; model: string; }

const DEFAULT_PROVIDER_FORM: Partial<CustomProvider> = { name: 'My Provider', type: 'openai', baseUrl: 'https://api.openai.com/v1', apiKey: '', models: ['gpt-4o', 'gpt-4o-mini'] };
const DEFAULT_AGENT_FORM: Partial<Agent> = { name: '', description: '', systemPrompt: '', provider: 'openai', model: 'gpt-4o' };

export default function Home() {
  const [language, setLanguage] = useState<Language>('es');
  const t = translations[language];
  const isRTL = language === 'ar';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [customProviders, setCustomProviders] = useState<CustomProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [apiKey, setApiKey] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'workflows' | 'agents' | 'code' | 'providers' | 'rea'>('chat');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [providerSearch, setProviderSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [workflows, setWorkflows] = useState<WorkflowType[]>([]);
  const [showAddWorkflow, setShowAddWorkflow] = useState(false);
  const [newProvider, setNewProvider] = useState<Partial<CustomProvider>>(DEFAULT_PROVIDER_FORM);
  const [newModel, setNewModel] = useState('');
  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [newAgent, setNewAgent] = useState<Partial<Agent>>(DEFAULT_AGENT_FORM);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('pulpoai-custom-providers');
    if (saved) try { setCustomProviders(JSON.parse(saved)); } catch {}
    const savedLang = localStorage.getItem('pulpoai-language') as Language;
    if (savedLang && translations[savedLang]) setLanguage(savedLang);
    const savedWorkflows = localStorage.getItem('pulpoai-workflows');
    if (savedWorkflows) try { setWorkflows(JSON.parse(savedWorkflows)); } catch {}
    const savedAgents = localStorage.getItem('pulpoai-agents');
    if (savedAgents) try { setAgents(JSON.parse(savedAgents)); } catch {}
  }, []);

  useEffect(() => { localStorage.setItem('pulpoai-custom-providers', JSON.stringify(customProviders)); }, [customProviders]);
  useEffect(() => { localStorage.setItem('pulpoai-language', language); }, [language]);
  useEffect(() => { localStorage.setItem('pulpoai-workflows', JSON.stringify(workflows)); }, [workflows]);
  useEffect(() => { localStorage.setItem('pulpoai-agents', JSON.stringify(agents)); }, [agents]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const allProviders = [...AI_PROVIDERS, ...customProviders.map(cp => ({ ...cp, isCustom: true }))];
  const filteredProviders = allProviders.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(providerSearch.toLowerCase()) || p.description.toLowerCase().includes(providerSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true); else if (e.type === 'dragleave') setDragActive(false); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files) { const files = Array.from(e.dataTransfer.files); setUploadedFiles(prev => [...prev, ...files]); } };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) { const files = Array.from(e.target.files); setUploadedFiles(prev => [...prev, ...files]); } };
  const removeFile = (index: number) => setUploadedFiles(prev => prev.filter((_, i) => i !== index));

  const sendMessage = async () => {
    if ((!input.trim() && uploadedFiles.length === 0) || loading) return;
    let messageContent = input;
    if (uploadedFiles.length > 0) { const fileInfo = uploadedFiles.map(f => `[${t.file}: ${f.name}]`).join('\n'); messageContent = input ? `${input}\n\n${fileInfo}` : fileInfo; }
    const userMessage: Message = { role: 'user', content: messageContent, files: uploadedFiles.map(f => f.name) };
    setMessages(prev => [...prev, userMessage]); setInput(''); setUploadedFiles([]); setLoading(true);
    try {
      let fileContents = '';
      if (uploadedFiles.length > 0) { for (const file of uploadedFiles) { const text = await file.text(); fileContents += `\n\n--- ${t.file}: ${file.name} ---\n${text}`; } }
      const selectedCustomProvider = customProviders.find(cp => cp.id === selectedProvider);
      const effectiveApiKey = apiKey || selectedCustomProvider?.apiKey || '';
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider: selectedProvider, model: selectedModel, messages: [...messages, { ...userMessage, content: messageContent + fileContents }], apiKey: effectiveApiKey, baseUrl: selectedCustomProvider?.baseUrl }) });
      const data = await response.json(); if (data.error) throw new Error(data.error); setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) { setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }]); }
    finally { setLoading(false); }
  };

  const addCustomProvider = () => {
    if (!newProvider.name || !newProvider.apiKey) return;
    const provider: CustomProvider = { id: `custom-${Date.now()}`, name: newProvider.name, description: 'Custom', type: newProvider.type || 'openai', baseUrl: newProvider.baseUrl || 'https://api.openai.com/v1', apiKey: newProvider.apiKey, models: newProvider.models || [], apiKeyRequired: true, freeTier: false, category: 'cloud', icon: '🔧' };
    setCustomProviders(prev => [...prev, provider]);
    setNewProvider(DEFAULT_PROVIDER_FORM);
    setShowAddProvider(false);
  };

  const deleteCustomProvider = (id: string) => { setCustomProviders(prev => prev.filter(p => p.id !== id)); if (selectedProvider === id) { setSelectedProvider('openai'); setSelectedModel('gpt-4o'); } };
  const addModelToProvider = (id: string) => { if (!newModel.trim()) return; setCustomProviders(prev => prev.map(p => p.id === id ? { ...p, models: [...p.models, newModel.trim()] } : p)); setNewModel(''); };
  const removeModelFromProvider = (id: string, model: string) => { setCustomProviders(prev => prev.map(p => p.id === id ? { ...p, models: p.models.filter(m => m !== model) } : p)); };
  const selectProvider = (p: CustomProvider) => { setSelectedProvider(p.id); if (p.models[0]) setSelectedModel(p.models[0]); setShowAddProvider(false); };
  const addWorkflowFromTemplate = (template: Omit<WorkflowType, 'id'>) => { const wf: WorkflowType = { ...template, id: `wf-${Date.now()}` }; setWorkflows(prev => [...prev, wf]); setShowAddWorkflow(false); };
  const deleteWorkflow = (id: string) => { setWorkflows(prev => prev.filter(w => w.id !== id)); };
  const toggleWorkflow = (id: string) => { setWorkflows(prev => prev.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w)); };
  const addAgent = () => { if (!newAgent.name) return; const agent: Agent = { id: `agent-${Date.now()}`, name: newAgent.name, description: newAgent.description || '', systemPrompt: newAgent.systemPrompt || '', provider: newAgent.provider || 'openai', model: newAgent.model || 'gpt-4o' }; setAgents(prev => [...prev, agent]); setNewAgent(DEFAULT_AGENT_FORM); setShowAddAgent(false); };
  const deleteAgent = (id: string) => { setAgents(prev => prev.filter(a => a.id !== id)); };

  const currentProvider = allProviders.find(p => p.id === selectedProvider);
  const models = currentProvider?.models || [];
  const formatFileSize = (bytes: number) => { if (bytes === 0) return '0 Bytes'; const k = 1024; const sizes = ['Bytes', 'KB', 'MB', 'GB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]; };

  return (
    <div className="flex h-screen bg-gray-900 text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold flex items-center gap-2"><Bot className="w-6 h-6 text-blue-500" />{t.title}</h1>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <Crown className="w-4 h-4 text-yellow-500" />
            <span>Creador: eliecerdepablos@gmail.com</span>
          </div>
        </div>
        <nav className="flex-1 p-2">
          {[{ id: 'rea' as const, icon: Search, label: 'PulpoRea' }, { id: 'chat' as const, icon: MessageSquare, label: t.chat }, { id: 'workflows' as const, icon: Workflow, label: t.workflows }, { id: 'agents' as const, icon: Bot, label: t.agents }, { id: 'code' as const, icon: Code, label: t.code }, { id: 'providers' as const, icon: Key, label: t.providers }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={clsx('w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors', activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700')}><tab.icon className="w-5 h-5" />{tab.label}</button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700"><div className="flex items-center gap-2 text-gray-400 mb-2"><Globe className="w-4 h-4" /><span className="text-sm">{t.selectLanguage}</span></div><div className="flex flex-wrap gap-1">{languages.map(lang => <button key={lang.code} onClick={() => setLanguage(lang.code)} className={clsx('px-2 py-1 rounded text-sm transition-colors', language === lang.code ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600')} title={lang.name}>{lang.flag}</button>)}</div></div>
        <div className="p-4 border-t border-gray-700"><div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2 text-gray-400"><Settings className="w-4 h-4" /><span className="text-sm">{t.config}</span></div><button onClick={() => { setNewProvider(DEFAULT_PROVIDER_FORM); setShowAddProvider(true); }} className="text-blue-400 hover:text-blue-300"><Plus className="w-4 h-4" /></button></div><select value={selectedProvider} onChange={e => { setSelectedProvider(e.target.value); const p = allProviders.find(p => p.id === e.target.value); if (p?.models[0]) setSelectedModel(p.models[0]); }} className="w-full bg-gray-700 rounded px-2 py-1 text-sm mb-2">{allProviders.map(p => <option key={p.id} value={p.id}>{p.name} {(p as any).isCustom ? `(${t.custom})` : ''}</option>)}</select><select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} className="w-full bg-gray-700 rounded px-2 py-1 text-sm mb-2">{models.map(m => <option key={m} value={m}>{m}</option>)}</select><input type="password" placeholder={t.apiKey} value={apiKey} onChange={e => setApiKey(e.target.value)} className="w-full bg-gray-700 rounded px-2 py-1 text-sm" /></div>
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Mail className="w-3 h-3" />
            <span>eliecerdepablos@gmail.com</span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {activeTab === 'chat' && (<><div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && <div className="h-full flex flex-col items-center justify-center text-gray-400"><Bot className="w-16 h-16 mb-4 text-blue-500" /><h2 className="text-2xl font-bold mb-2">{t.welcome}</h2><p className="text-center max-w-md">{t.welcomeDesc}</p><div className="flex gap-2 mt-6">{[t.analyzeCode, t.generateIdeas, t.debugging].map(s => <button key={s} onClick={() => setInput(s)} className="px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-gray-700">{s}</button>)}</div></div>}
          {messages.map((msg, i) => <div key={i} className={clsx('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>{msg.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0"><Bot className="w-5 h-5" /></div>}<div className={clsx('max-w-[70%] rounded-lg px-4 py-2', msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-800')}>{msg.files && msg.files.length > 0 && <div className="flex flex-wrap gap-1 mb-2">{msg.files.map((f, idx) => <span key={idx} className="flex items-center gap-1 bg-gray-700 rounded px-2 py-1 text-xs"><File className="w-3 h-3" />{f}</span>)}</div>}<p className="whitespace-pre-wrap">{msg.content}</p></div></div>)}
          {loading && <div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center"><Bot className="w-5 h-5 animate-pulse" /></div><div className="bg-gray-800 rounded-lg px-4 py-2"><div className="flex gap-1"><div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" /><div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} /><div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} /></div></div></div>}
          <div ref={messagesEndRef} />
        </div>{uploadedFiles.length > 0 && <div className="px-4 py-2 bg-gray-800 border-t border-gray-700"><div className="flex flex-wrap gap-2">{uploadedFiles.map((f, i) => <div key={i} className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2"><File className="w-4 h-4 text-blue-400" /><div className="flex flex-col"><span className="text-sm">{f.name}</span><span className="text-xs text-gray-400">{formatFileSize(f.size)}</span></div><button onClick={() => removeFile(i)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button></div>)}</div></div>}<div className="p-4 border-t border-gray-700">
          {dragActive && <div className="absolute inset-0 bg-blue-600/20 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center z-50"><div className="text-center"><Upload className="w-12 h-12 mx-auto mb-2 text-blue-400" /><p className="text-lg font-semibold">{t.dropFiles}</p></div></div>}
          <div className="mb-2" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}><button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"><Paperclip className="w-5 h-5" /><span className="text-sm">{t.attachFiles}</span></button><input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" /></div>
          <div className="flex gap-2"><input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()} placeholder={t.inputPlaceholder} className="flex-1 bg-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={loading} /><button onClick={sendMessage} disabled={loading || (!input.trim() && uploadedFiles.length === 0)} className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"><Send className="w-5 h-5" /></button></div>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500"><span>{selectedProvider}</span><span>-</span><span>{selectedModel}</span>{apiKey && <><span>-</span><span className="text-green-500">{t.apiKeyConfigured}</span></>}</div>
        </div></>)}
        {activeTab === 'workflows' && <div className="flex-1 p-6 overflow-y-auto"><div className="flex items-center justify-between mb-6"><div><h2 className="text-2xl font-bold">{t.workflows}</h2><p className="text-gray-400">Automatiza tareas</p></div><button onClick={() => setShowAddWorkflow(true)} className="px-4 py-2 bg-blue-600 rounded-lg flex items-center gap-2 hover:bg-blue-700"><Plus className="w-4 h-4" />Nuevo</button></div>{workflows.length === 0 ? <div className="text-center py-12"><Workflow className="w-16 h-16 mx-auto mb-4 text-gray-500" /><h3 className="text-lg font-semibold mb-2">No tienes workflows</h3><p className="text-gray-400 mb-4">Crea workflows para automatizar</p><button onClick={() => setShowAddWorkflow(true)} className="px-4 py-2 bg-blue-600 rounded-lg">Crear Workflow</button></div> : <div className="grid gap-4">{workflows.map(wf => <div key={wf.id} className="bg-gray-800 rounded-lg p-4"><div className="flex items-center justify-between mb-2"><div className="flex items-center gap-3"><div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', wf.enabled ? 'bg-green-600' : 'bg-gray-600')}><Workflow className="w-6 h-6" /></div><div><h3 className="font-semibold">{wf.name}</h3><p className="text-sm text-gray-400">{wf.description}</p></div></div><div className="flex items-center gap-2"><button onClick={() => toggleWorkflow(wf.id)} className={clsx('px-3 py-1 rounded text-sm', wf.enabled ? 'bg-green-600' : 'bg-gray-600')}>{wf.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button><button onClick={() => deleteWorkflow(wf.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-5 h-5" /></button></div></div><div className="flex gap-2 mt-3">{wf.nodes.map((node: any) => <div key={node.id} className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded text-sm"><span>{node.icon}</span><span>{node.name}</span></div>)}</div></div>)}</div>}</div>}
        {activeTab === 'agents' && <div className="flex-1 p-6 overflow-y-auto"><div className="flex items-center justify-between mb-6"><div><h2 className="text-2xl font-bold">{t.agents}</h2><p className="text-gray-400">Crea agentes especializados</p></div><button onClick={() => { setNewAgent(DEFAULT_AGENT_FORM); setShowAddAgent(true); }} className="px-4 py-2 bg-blue-600 rounded-lg flex items-center gap-2 hover:bg-blue-700"><Plus className="w-4 h-4" />{t.newAgent}</button></div>{agents.length === 0 ? <div className="text-center py-12"><User className="w-16 h-16 mx-auto mb-4 text-gray-500" /><h3 className="text-lg font-semibold mb-2">No tienes agentes</h3><p className="text-gray-400 mb-4">Crea agentes especializados</p><button onClick={() => { setNewAgent(DEFAULT_AGENT_FORM); setShowAddAgent(true); }} className="px-4 py-2 bg-blue-600 rounded-lg">Crear Agente</button></div> : <div className="grid gap-4">{agents.map(agent => <div key={agent.id} className="bg-gray-800 rounded-lg p-4"><div className="flex items-center justify-between mb-2"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center"><User className="w-6 h-6" /></div><div><h3 className="font-semibold">{agent.name}</h3><p className="text-sm text-gray-400">{agent.description}</p></div></div><button onClick={() => deleteAgent(agent.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-5 h-5" /></button></div><div className="flex gap-2 mt-3"><span className="px-2 py-1 bg-gray-700 rounded text-sm">{agent.provider}</span><span className="px-2 py-1 bg-gray-700 rounded text-sm">{agent.model}</span></div></div>)}</div>}</div>}
        {activeTab === 'code' && <div className="flex-1 p-6"><h2 className="text-2xl font-bold mb-4">{t.codeAssistant}</h2><p className="text-gray-400 mb-6">Analiza, genera y depura codigo</p><div className="bg-gray-800 rounded-lg p-4 font-mono text-sm"><div className="flex items-center gap-2 text-gray-400 mb-2"><Terminal className="w-4 h-4" />Terminal</div><p className="text-green-400">$ pulpoai --help</p><p className="text-gray-300">PulpoAI - {t.codeAssistant}</p></div></div>}
        {activeTab === 'providers' && <div className="flex-1 p-6 overflow-y-auto"><div className="flex items-center justify-between mb-6"><div><h2 className="text-2xl font-bold">{t.providers}</h2><p className="text-gray-400">Gestiona proveedores</p></div><button onClick={() => { setNewProvider(DEFAULT_PROVIDER_FORM); setShowAddProvider(true); }} className="px-4 py-2 bg-blue-600 rounded-lg flex items-center gap-2 hover:bg-blue-700"><Plus className="w-4 h-4" />{t.addProvider}</button></div><div className="mb-6"><h3 className="text-lg font-semibold mb-3 text-gray-400">{t.integrated}</h3><div className="grid gap-3">{AI_PROVIDERS.map(p => <div key={p.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-xl">{p.icon}</div><div><h4 className="font-semibold">{p.name}</h4><p className="text-sm text-gray-400">{p.description}</p></div></div><span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded">{t.integrated}</span></div>)}</div></div><div><h3 className="text-lg font-semibold mb-3 text-gray-400">{t.custom}</h3>{customProviders.length === 0 ? <div className="bg-gray-800 rounded-lg p-8 text-center"><Key className="w-12 h-12 mx-auto mb-4 text-gray-500" /><p className="text-gray-400 mb-2">{t.noProviders}</p><button onClick={() => { setNewProvider(DEFAULT_PROVIDER_FORM); setShowAddProvider(true); }} className="text-blue-400 hover:text-blue-300">{t.addFirstProvider}</button></div> : <div className="grid gap-3">{customProviders.map(p => <div key={p.id} className="bg-gray-800 rounded-lg p-4"><div className="flex items-center justify-between mb-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center text-xl">{p.icon || '🔧'}</div><div><h4 className="font-semibold">{p.name}</h4><p className="text-sm text-gray-400">{p.type} - {p.models.length} modelos</p></div></div><button onClick={() => deleteCustomProvider(p.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-5 h-5" /></button></div><div className="flex gap-2"><input type="text" placeholder="Nuevo modelo..." value={editingProvider === p.id ? newModel : ''} onChange={e => { setEditingProvider(p.id); setNewModel(e.target.value); }} onKeyDown={e => { if (e.key === 'Enter') addModelToProvider(p.id); }} className="flex-1 bg-gray-700 rounded px-3 py-1 text-sm" /><button onClick={() => addModelToProvider(p.id)} className="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-700">{t.add}</button></div></div>)}</div>}</div></div>}
        {activeTab === 'rea' && <div className="flex-1 p-6 overflow-y-auto"><div className="flex items-center justify-between mb-6"><div><h2 className="text-2xl font-bold">PulpoRea</h2><p className="text-gray-400">Apps verificadas - Inspirado en REA</p></div></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{VERIFIED_APPS.slice(0, 6).map(app => <div key={app.id} className="bg-gray-800 rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><span className="text-xl">{app.icon}</span><h3 className="font-semibold">{app.name}</h3>{app.verified && <Check className="w-4 h-4 text-green-500" />}</div><p className="text-sm text-gray-400">{app.description}</p></div>)}</div></div>}
      </div>
      {showAddProvider && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-gray-800 rounded-lg p-6 w-96 max-w-md max-h-[80vh] overflow-y-auto"><h3 className="text-xl font-bold mb-4">{t.addProvider}</h3><div className="space-y-4"><div><label className="block text-sm text-gray-400 mb-1">{t.providerName}</label><input type="text" value={newProvider.name || ''} onChange={e => setNewProvider(p => ({ ...p, name: e.target.value }))} className="w-full bg-gray-700 rounded px-3 py-2" /></div><div><label className="block text-sm text-gray-400 mb-1">{t.providerType}</label><select value={newProvider.type || 'openai'} onChange={e => setNewProvider(p => ({ ...p, type: e.target.value as any }))} className="w-full bg-gray-700 rounded px-3 py-2"><option value="openai">OpenAI</option><option value="anthropic">Anthropic</option></select></div><div><label className="block text-sm text-gray-400 mb-1">{t.baseUrl}</label><input type="text" value={newProvider.baseUrl || ''} onChange={e => setNewProvider(p => ({ ...p, baseUrl: e.target.value }))} className="w-full bg-gray-700 rounded px-3 py-2" /></div><div><label className="block text-sm text-gray-400 mb-1">{t.apiKeyLabel}</label><input type="password" value={newProvider.apiKey || ''} onChange={e => setNewProvider(p => ({ ...p, apiKey: e.target.value }))} className="w-full bg-gray-700 rounded px-3 py-2" /></div><div><label className="block text-sm text-gray-400 mb-1">{t.models}</label><textarea value={newProvider.models?.join('\n') || ''} onChange={e => setNewProvider(p => ({ ...p, models: e.target.value.split('\n').filter(m => m.trim()) }))} rows={4} className="w-full bg-gray-700 rounded px-3 py-2" /></div></div><div className="flex gap-2 mt-6"><button onClick={() => { setShowAddProvider(false); setNewProvider(DEFAULT_PROVIDER_FORM); }} className="flex-1 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">{t.cancel}</button><button onClick={addCustomProvider} disabled={!newProvider.name || !newProvider.apiKey} className="flex-1 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50">{t.add}</button></div></div></div>}
      {showAddWorkflow && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-gray-800 rounded-lg p-6 w-96 max-w-md max-h-[80vh] overflow-y-auto"><h3 className="text-xl font-bold mb-4">Crear Workflow</h3><div className="space-y-3">{WORKFLOW_TEMPLATES.map((template, i) => <button key={i} onClick={() => addWorkflowFromTemplate(template)} className="w-full p-3 bg-gray-700 rounded-lg text-left hover:bg-gray-600"><h4 className="font-semibold">{template.name}</h4><p className="text-sm text-gray-400">{template.description}</p></button>)}</div><div className="mt-4"><button onClick={() => setShowAddWorkflow(false)} className="w-full px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">{t.cancel}</button></div></div></div>}
      {showAddAgent && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-gray-800 rounded-lg p-6 w-96 max-w-md max-h-[80vh] overflow-y-auto"><h3 className="text-xl font-bold mb-4">Crear Agente</h3><div className="space-y-4"><div><label className="block text-sm text-gray-400 mb-1">Nombre</label><input type="text" value={newAgent.name || ''} onChange={e => setNewAgent(p => ({ ...p, name: e.target.value }))} className="w-full bg-gray-700 rounded px-3 py-2" /></div><div><label className="block text-sm text-gray-400 mb-1">Descripcion</label><input type="text" value={newAgent.description || ''} onChange={e => setNewAgent(p => ({ ...p, description: e.target.value }))} className="w-full bg-gray-700 rounded px-3 py-2" /></div><div><label className="block text-sm text-gray-400 mb-1">Proveedor</label><select value={newAgent.provider || 'openai'} onChange={e => setNewAgent(p => ({ ...p, provider: e.target.value }))} className="w-full bg-gray-700 rounded px-3 py-2">{allProviders.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div><div><label className="block text-sm text-gray-400 mb-1">Modelo</label><select value={newAgent.model || 'gpt-4o'} onChange={e => setNewAgent(p => ({ ...p, model: e.target.value }))} className="w-full bg-gray-700 rounded px-3 py-2">{(allProviders.find(p => p.id === newAgent.provider)?.models || []).map(m => <option key={m} value={m}>{m}</option>)}</select></div><div><label className="block text-sm text-gray-400 mb-1">System Prompt</label><textarea value={newAgent.systemPrompt || ''} onChange={e => setNewAgent(p => ({ ...p, systemPrompt: e.target.value }))} rows={4} className="w-full bg-gray-700 rounded px-3 py-2" /></div></div><div className="flex gap-2 mt-6"><button onClick={() => { setShowAddAgent(false); setNewAgent(DEFAULT_AGENT_FORM); }} className="flex-1 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">{t.cancel}</button><button onClick={addAgent} disabled={!newAgent.name} className="flex-1 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50">{t.add}</button></div></div></div>}
    </div>
  );
}