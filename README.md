# PulpoAI - Unified AI Development Hub

Una aplicacion independiente y autonoma que combina lo mejor de multiples herramientas de IA en una sola experiencia unificada.

## Caracteristicas

### Gateway Multi-Proveedor
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude 3)
- Google Gemini
- Groq (Velocidad ultra)
- Ollama (Local)

### Interfaz Unificada
- Chat con IA multi-proveedor
- Sistema de workflows visuales
- Agentes especializados
- Asistente de codigo

### Ventajas
- **Independiente**: No depende de proyectos externos
- **Conectado**: Acceso directo a internet
- **Unificado**: Todo en una sola aplicacion
- **Flexible**: Multi-proveedor sin restricciones

## Instalacion

```bash
# Clonar o descargar
cd pulpoai

# Instalar dependencias
npm install

# Iniciar
npm run dev
```

## Uso

1. Abre http://localhost:3000
2. Selecciona tu proveedor de IA
3. Configura tu API key (opcional)
4. Comienza a chatear

## Proveedores Soportados

| Proveedor | Modelos | Velocidad |
|-----------|---------|-----------|
| OpenAI | GPT-4, GPT-3.5 | Rapido |
| Anthropic | Claude 3 | Rapido |
| Gemini | Gemini 1.5 | Rapido |
| Groq | Llama 3.1 | Ultra Rapido |
| Ollama | Local | Variable |

## Estructura

```
pulpoai/
├── src/
│   ├── app/
│   │   ├── api/chat/      # API de chat
│   │   └── page.tsx       # Interfaz principal
│   ├── components/        # Componentes UI
│   ├── db/                # Base de datos
│   ├── lib/               # Logica de negocio
│   └── types/             # TypeScript types
├── package.json
└── README.md
```

## Configuracion

### Variables de Entorno

```env
OPENAI_API_KEY=tu_key
ANTHROPIC_API_KEY=tu_key
GEMINI_API_KEY=tu_key
GROQ_API_KEY=tu_key
```

### Base de Datos

SQLite local - sin configuracion adicional.

## Roadmap

- [x] Gateway multi-proveedor
- [x] Chat unificado
- [x] Interfaz moderna
- [ ] Workflows visuales
- [ ] Sistema de agentes
- [ ] Asistente de codigo
- [ ] Plugins
- [ ] API publica

## Licencia

MIT - Uso libre y sin restricciones.