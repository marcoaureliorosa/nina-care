# Ninacare - Central de Monitoramento IA

Plataforma Ninacare para acompanhamento de agentes IA em cuidados perioperatórios.

## Sobre o Projeto

Sistema web desenvolvido para monitoramento e gestão de agentes de inteligência artificial especializados em cuidados perioperatórios. A plataforma oferece funcionalidades completas de gerenciamento de usuários, organizações, pacientes e conversas.

## Tecnologias Utilizadas

Este projeto foi construído com:

- **Vite** - Build tool e servidor de desenvolvimento
- **TypeScript** - Linguagem de programação
- **React** - Framework frontend
- **shadcn/ui** - Componentes de interface
- **Tailwind CSS** - Framework de estilização
- **Supabase** - Backend as a Service (banco de dados, autenticação, storage)
- **React Router** - Roteamento
- **React Hook Form** - Gerenciamento de formulários
- **Framer Motion** - Animações

## Funcionalidades

- 🔐 **Autenticação e Autorização** - Sistema completo de login/logout com diferentes níveis de acesso
- 👥 **Gerenciamento de Usuários** - CRUD completo com roles e permissões
- 🏢 **Gestão de Organizações** - Múltiplas organizações com isolamento de dados
- 💬 **Sistema de Conversas** - Interface para acompanhar interações com agentes IA
- 👤 **Perfis de Pacientes** - Cadastro e gerenciamento de informações dos pacientes
- 📊 **Dashboard** - Visualização de métricas e indicadores
- 🔧 **Configurações** - Painel administrativo com configurações do sistema

## Como Executar o Projeto

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta no Supabase (para backend)

### Instalação

```bash
# 1. Clone o repositório
git clone <URL_DO_REPOSITORIO>

# 2. Entre no diretório do projeto
cd nina-care

# 3. Instale as dependências
npm install

# 4. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite o arquivo .env.local com suas credenciais do Supabase

# 5. Execute o projeto em desenvolvimento
npm run dev
```

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

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
├── pages/              # Páginas da aplicação
├── types/              # Definições de tipos TypeScript
├── utils/              # Funções utilitárias
└── main.tsx           # Ponto de entrada da aplicação
```

## Licença

Este projeto é propriedade da Ninacare. Todos os direitos reservados.
