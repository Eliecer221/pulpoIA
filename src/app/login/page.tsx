"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (email && password.length >= 6) {
      localStorage.setItem('pulpoai-user', JSON.stringify({ email, loginAt: new Date().toISOString() }));
      router.push('/');
    } else {
      setError('Email y password (min 6 caracteres) requeridos');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <Bot className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold">PulpoAI</h1>
          <p className="text-gray-400 mt-2">Tu hub unificado de IA</p>
        </div>

        <form onSubmit={handleLogin} className="bg-gray-800 rounded-2xl p-8 space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-gray-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimo 6 caracteres"
                className="w-full bg-gray-700 rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-600/20 text-red-400 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="text-center text-sm text-gray-400">
            Al entrar aceptas los terminos de uso
          </p>
        </form>
      </div>
    </div>
  );
}