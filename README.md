# Nina Care - Central de Monitoramento

Sistema inteligente de monitoramento de pacientes com interface moderna e integrações avançadas.

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Autenticação**: Supabase Auth (Email/Senha + Google OAuth)
- **Estado**: React Context + React Query
- **Roteamento**: React Router v6
- **Gráficos**: Recharts
- **Icons**: Lucide React

## 🛠️ Configuração do Projeto

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone [url-do-repositorio]
cd nina-care

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

### Configuração de Variáveis (Lovable)

**Importante**: O Lovable não usa arquivos `.env`. As configurações são gerenciadas via:

1. **URLs públicas**: Definidas diretamente no código
2. **Tokens secretos**: Configurados nas Supabase Secrets

Para configurar o WhatsApp, consulte: [LOVABLE_ENVIRONMENT_CONFIG.md](./LOVABLE_ENVIRONMENT_CONFIG.md)

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa verificação de código

## Estrutura do Projeto

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── ui/             # Componentes base do sistema de design
│   ├── admin/          # Componentes específicos para administração
│   └── dashboard/      # Componentes do dashboard
├── contexts/           # Contextos React (Auth, etc.)
├── hooks/              # Custom hooks
├── integrations/       # Integrações externas (Supabase)
├── lib/                # Bibliotecas e utilitários
├── pages/              # Páginas da aplicação
├── types/              # Definições de tipos TypeScript
├── utils/              # Funções utilitárias
└── main.tsx           # Ponto de entrada da aplicação

supabase/
├── functions/          # Edge Functions (serverless)
│   ├── send-whatsapp-message/
│   ├── whatsapp-qr/
│   ├── whatsapp-status/
│   └── whatsapp-disconnect/
└── config.toml         # Configuração do Supabase
```

## 🔐 Autenticação

O sistema suporta:
- ✅ Login com email/senha
- ✅ Login com Google OAuth  
- ✅ Recuperação de senha
- ✅ Gerenciamento de perfis

## 📱 Funcionalidades

### Dashboard
- Métricas em tempo real
- Gráficos interativos
- Monitoramento de pacientes
- Alertas e notificações

### WhatsApp Integration
- Envio de mensagens
- QR Code para conexão
- Status de conexão
- Gerenciamento via Edge Functions

### Administração
- Gerenciamento de usuários
- Configurações do sistema
- Logs e auditoria

## 🔧 Configuração do WhatsApp

1. Configure o token nas Supabase Secrets
2. Deploy das Edge Functions
3. Teste a conexão via QR Code

Ver documentação completa: [LOVABLE_ENVIRONMENT_CONFIG.md](./LOVABLE_ENVIRONMENT_CONFIG.md)

## 📚 Documentação Adicional

- [Configuração WhatsApp](./WHATSAPP_INTEGRATION.md)
- [Setup Google OAuth](./GOOGLE_OAUTH_SETUP.md)
- [Configuração Lovable](./LOVABLE_ENVIRONMENT_CONFIG.md)

## Licença

Este projeto é propriedade da Ninacare. Todos os direitos reservados.
