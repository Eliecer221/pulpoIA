import { NextResponse } from 'next/server';

export async function GET() {
  const providers = [
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
      id: 'groq',
      name: 'Groq',
      type: 'openai',
      baseUrl: 'https://api.groq.com/openai/v1',
      models: ['llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    },
    {
      id: 'ollama',
      name: 'Ollama (Local)',
      type: 'ollama',
      baseUrl: 'http://localhost:11434',
      models: ['llama3.2', 'codellama', 'mistral', 'phi3'],
    },
  ];

  return NextResponse.json({ providers });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, model, messages, apiKey, baseUrl, temperature, maxTokens } = body;

    let response: Response;
    let data: any;

    // Handle different provider types
    switch (provider) {
      case 'openai':
      case 'groq':
        response = await fetch(`${baseUrl || 'https://api.openai.com/v1'}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: temperature ?? 0.7,
            max_tokens: maxTokens ?? 4096,
          }),
        });
        data = await response.json();
        break;

      case 'anthropic':
        const systemMessage = messages.find((m: any) => m.role === 'system');
        const anthropicMessages = messages.filter((m: any) => m.role !== 'system');
        
        response = await fetch(`${baseUrl || 'https://api.anthropic.com/v1'}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model,
            messages: anthropicMessages,
            system: systemMessage?.content,
            max_tokens: maxTokens ?? 4096,
          }),
        });
        data = await response.json();
        break;

      case 'gemini':
        const geminiSystemMessage = messages.find((m: any) => m.role === 'system');
        const geminiContents = messages
          .filter((m: any) => m.role !== 'system')
          .map((m: any) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          }));

        response = await fetch(
          `${baseUrl || 'https://generativelanguage.googleapis.com/v1beta'}/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: geminiContents,
              systemInstruction: geminiSystemMessage ? {
                parts: [{ text: geminiSystemMessage.content }],
              } : undefined,
              generationConfig: {
                temperature: temperature ?? 0.7,
                maxOutputTokens: maxTokens ?? 4096,
              },
            }),
          }
        );
        data = await response.json();
        break;

      case 'ollama':
        response = await fetch(`${baseUrl || 'http://localhost:11434'}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            messages,
            stream: false,
          }),
        });
        data = await response.json();
        break;

      default:
        // Custom OpenAI-compatible provider
        response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: temperature ?? 0.7,
            max_tokens: maxTokens ?? 4096,
          }),
        });
        data = await response.json();
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'API request failed' },
        { status: response.status }
      );
    }

    // Parse response based on provider type
    let content = '';
    let tokens = 0;

    if (provider === 'anthropic') {
      content = data.content?.[0]?.text || '';
      tokens = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);
    } else if (provider === 'gemini') {
      content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      tokens = data.usageMetadata?.totalTokenCount || 0;
    } else if (provider === 'ollama') {
      content = data.message?.content || '';
      tokens = data.eval_count || 0;
    } else {
      content = data.choices?.[0]?.message?.content || '';
      tokens = data.usage?.total_tokens || 0;
    }

    return NextResponse.json({
      content,
      tokens,
      model,
      provider,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}