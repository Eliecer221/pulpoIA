import { ChatRequest, ChatResponse, PROVIDERS } from '@/types/ai';

export class AIGateway {
  private apiKeys: Map<string, string> = new Map();

  setApiKey(provider: string, key: string) {
    this.apiKeys.set(provider, key);
  }

  getApiKey(provider: string): string | undefined {
    return this.apiKeys.get(provider);
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const provider = PROVIDERS.find(p => p.id === request.provider);
    if (!provider) {
      throw new Error(`Provider ${request.provider} not found`);
    }

    switch (provider.type) {
      case 'openai':
        return this.chatOpenAI(request, provider.baseUrl!);
      case 'anthropic':
        return this.chatAnthropic(request, provider.baseUrl!);
      case 'gemini':
        return this.chatGemini(request, provider.baseUrl!);
      case 'ollama':
        return this.chatOllama(request, provider.baseUrl!);
      default:
        throw new Error(`Unsupported provider type: ${provider.type}`);
    }
  }

  private async chatOpenAI(request: ChatRequest, baseUrl: string): Promise<ChatResponse> {
    const apiKey = this.getApiKey('openai') || process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OpenAI API key not set');

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 4096,
        stream: request.stream ?? false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || '',
      tokens: data.usage?.total_tokens || 0,
      model: request.model,
      provider: request.provider,
    };
  }

  private async chatAnthropic(request: ChatRequest, baseUrl: string): Promise<ChatResponse> {
    const apiKey = this.getApiKey('anthropic') || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('Anthropic API key not set');

    const systemMessage = request.messages.find(m => m.role === 'system');
    const messages = request.messages.filter(m => m.role !== 'system');

    const response = await fetch(`${baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: request.model,
        messages,
        system: systemMessage?.content,
        max_tokens: request.maxTokens ?? 4096,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${error}`);
    }

    const data = await response.json();
    return {
      content: data.content[0]?.text || '',
      tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      model: request.model,
      provider: request.provider,
    };
  }

  private async chatGemini(request: ChatRequest, baseUrl: string): Promise<ChatResponse> {
    const apiKey = this.getApiKey('gemini') || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('Gemini API key not set');

    const systemMessage = request.messages.find(m => m.role === 'system');
    const contents = request.messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const response = await fetch(
      `${baseUrl}/models/${request.model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: systemMessage ? {
            parts: [{ text: systemMessage.content }],
          } : undefined,
          generationConfig: {
            temperature: request.temperature ?? 0.7,
            maxOutputTokens: request.maxTokens ?? 4096,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${error}`);
    }

    const data = await response.json();
    return {
      content: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
      tokens: data.usageMetadata?.totalTokenCount || 0,
      model: request.model,
      provider: request.provider,
    };
  }

  private async chatOllama(request: ChatRequest, baseUrl: string): Promise<ChatResponse> {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        stream: request.stream ?? false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ollama API error: ${error}`);
    }

    const data = await response.json();
    return {
      content: data.message?.content || '',
      tokens: data.eval_count || 0,
      model: request.model,
      provider: request.provider,
    };
  }

  async *streamChat(request: ChatRequest): AsyncGenerator<string> {
    // Streaming implementation
    const response = await this.chat({ ...request, stream: true });
    yield response.content;
  }
}

export const aiGateway = new AIGateway();
