"use client";

import { useState } from 'react';
import { Shield, Lock, Eye, Server, Wifi, Code, AlertTriangle, CheckCircle, Search, BookOpen, Terminal, Globe } from 'lucide-react';
import clsx from 'clsx';
import { SECURITY_FRAMEWORKS, CRYPTOGRAPHY, WEB_SECURITY, NETWORK_SECURITY, SYSTEM_HARDENING, SECURE_CODING, THREAT_MODELING, INCIDENT_RESPONSE, COMPLIANCE, SECURITY_TOOLS } from '@/lib/security';

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="border-b border-gray-700 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Security Knowledge Base</h1>
              <p className="text-gray-400">Conocimiento avanzado de ciberseguridad para construir sistemas protegidos</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Buscar..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-3" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'crypto', label: 'Criptografia', icon: Lock },
            { id: 'web', label: 'Web Security', icon: Globe },
            { id: 'hardening', label: 'Hardening', icon: Server },
            { id: 'coding', label: 'Secure Coding', icon: Code },
            { id: 'threats', label: 'Threat Modeling', icon: AlertTriangle },
            { id: 'response', label: 'Incident Response', icon: Eye },
            { id: 'compliance', label: 'Compliance', icon: CheckCircle },
            { id: 'tools', label: 'Tools', icon: Terminal },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={clsx('flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors',
                activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700')}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SECURITY_FRAMEWORKS.map(framework => (
                <div key={framework.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer">
                  <div className="text-3xl mb-2">{framework.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{framework.name}</h3>
                  <p className="text-gray-400">{framework.description}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Top 10 Vulnerabilidades Web (OWASP)</h2>
              <div className="space-y-3">
                {WEB_SECURITY.map((vuln, i) => (
                  <div key={vuln.name} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    <span className="text-lg">{i + 1}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold">{vuln.name}</h4>
                      <p className="text-sm text-gray-400">{vuln.prevention}</p>
                    </div>
                    <span className={clsx('px-2 py-1 rounded text-xs font-semibold',
                      vuln.severity === 'critical' ? 'bg-red-600/20 text-red-400' :
                      vuln.severity === 'high' ? 'bg-orange-600/20 text-orange-400' : 'bg-yellow-600/20 text-yellow-400')}>
                      {vuln.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'crypto' && (
          <div className="space-y-6">
            {Object.entries(CRYPTOGRAPHY).map(([category, items]) => (
              <div key={category} className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 capitalize">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map(item => (
                    <div key={item.name} className="bg-gray-700 rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                      <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">{item.use}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'web' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">OWASP Top 10 - Vulnerabilidades Web</h2>
            <div className="space-y-3">
              {WEB_SECURITY.map(vuln => (
                <div key={vuln.name} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{vuln.name}</h3>
                    <span className={clsx('px-2 py-1 rounded text-xs font-semibold',
                      vuln.severity === 'critical' ? 'bg-red-600/20 text-red-400' :
                      vuln.severity === 'high' ? 'bg-orange-600/20 text-orange-400' : 'bg-yellow-600/20 text-yellow-400')}>
                      {vuln.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400"><strong>Prevencion:</strong> {vuln.prevention}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'hardening' && (
          <div className="space-y-6">
            {Object.entries(SYSTEM_HARDENING).map(([platform, items]) => (
              <div key={platform} className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 capitalize">{platform} Hardening</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {items.map(item => (
                    <div key={item} className="flex items-center gap-2 p-2 bg-gray-700 rounded">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'coding' && (
          <div className="space-y-6">
            {SECURE_CODING.map(lang => (
              <div key={lang.language} className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">{lang.language} Secure Coding</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {lang.practices.map(practice => (
                    <div key={practice} className="flex items-center gap-2 p-2 bg-gray-700 rounded">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{practice}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'threats' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Threat Modeling Methodologies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {THREAT_MODELING.methodologies.map(method => (
                  <div key={method.name} className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-1">{method.name}</h3>
                    <p className="text-gray-400 text-sm">{method.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Threat Modeling Steps</h2>
              <div className="space-y-3">
                {THREAT_MODELING.steps.map((step, i) => (
                  <div key={step} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-semibold">{i + 1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'response' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Incident Response Phases</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {INCIDENT_RESPONSE.phases.map((phase, i) => (
                  <div key={phase.phase} className="bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400 mb-2">{i + 1}</div>
                    <h3 className="font-semibold mb-1">{phase.phase}</h3>
                    <p className="text-gray-400 text-sm">{phase.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Security Tools</h2>
              <div className="flex flex-wrap gap-2">
                {INCIDENT_RESPONSE.tools.map(tool => (
                  <span key={tool} className="px-3 py-1 bg-gray-700 rounded-lg text-sm">{tool}</span>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'compliance' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Compliance Standards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COMPLIANCE.map(std => (
                <div key={std.standard} className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-1">{std.standard}</h3>
                  <p className="text-gray-400 text-sm">{std.focus}</p>
                  <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded mt-2 inline-block">{std.region}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            {Object.entries(SECURITY_TOOLS).map(([category, tools]) => (
              <div key={category} className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 capitalize">{category} Tools</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {tools.map(tool => (
                    <div key={tool} className="p-3 bg-gray-700 rounded-lg text-center">
                      <span className="text-sm font-medium">{tool}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}