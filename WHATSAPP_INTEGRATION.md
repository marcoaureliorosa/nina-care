# Integração WhatsApp - Nina Care

## Resumo da Implementação

Foi implementada uma nova funcionalidade na tela de **Configurações** para gerenciar a conexão do WhatsApp do agente, permitindo que a organização vincule e gerencie a instância do WhatsApp para envio e recebimento de mensagens automatizadas.

## Funcionalidades Implementadas

### 1. **Hook personalizado (`useWhatsApp.ts`)**
- **Status da Instância**: Monitora automaticamente o status da conexão do WhatsApp (conectado/desconectado/conectando)
- **QR Code**: Busca e gerencia a exibição do QR Code para conexão
- **Atualizações automáticas**: Status é atualizado automaticamente a cada 10 segundos
- **Tratamento de erros**: Gerenciamento robusto de erros da API

### 2. **Componente WhatsAppManagement**
- **Interface visual moderna**: Cards organizados com status, QR Code e instruções
- **Status em tempo real**: Exibição visual do status com ícones e cores apropriadas
- **Geração de QR Code**: Botão para solicitar novo QR Code quando necessário
- **Instruções passo a passo**: Guia claro para conectar o WhatsApp
- **Feedback visual**: Loading states, toasts e alertas informativos

### 3. **Nova aba na página de Configurações**
- **Aba WhatsApp**: Adicionada junto com "Organização" e "Usuários"
- **Permissões**: Disponível apenas para usuários administradores
- **Layout consistente**: Segue o padrão visual existente do projeto

## Endpoints da API

A integração utiliza a API da **AvisaAPI** com os seguintes endpoints:

### Status da Instância
```
GET https://www.avisaapi.com.br/api/instance/status
```
- **Função**: Verifica o status atual da instância do WhatsApp
- **Resposta esperada**: 
  ```json
  {
    "status": "connected|disconnected|connecting",
    "instance": "nome_da_instancia"
  }
  ```

### QR Code para Conexão
```
GET https://www.avisaapi.com.br/api/instance/qr
```
- **Função**: Obtém o QR Code para conectar a instância do WhatsApp
- **Resposta esperada**:
  ```json
  {
    "qr": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
  ```

## Fluxo de Uso

1. **Acesso**: Usuário administrador acessa "Configurações" → aba "WhatsApp"
2. **Verificação de Status**: O sistema automaticamente verifica o status da instância
3. **Conexão** (se desconectado):
   - Clicar em "Gerar QR Code"
   - Escanear o código com o WhatsApp do celular
   - Aguardar confirmação da conexão
4. **Monitoramento**: O status é atualizado automaticamente a cada 10 segundos

## Estados da Interface

### 🟢 **Conectado**
- Badge verde com ícone de check
- Mensagem confirmando conexão ativa
- QR Code não é exibido

### 🔴 **Desconectado**
- Badge vermelho com ícone de X
- Botão para gerar QR Code disponível
- Instruções de conexão visíveis

### 🟡 **Conectando**
- Badge amarelo com ícone de loading
- Interface indica processo em andamento

### ⚫ **Erro**
- Badge cinza com ícone de alerta
- Mensagem de erro específica exibida

## Tecnologias Utilizadas

- **React Query (@tanstack/react-query)**: Gerenciamento de estado e cache das requisições
- **Fetch API**: Requisições HTTP para a AvisaAPI
- **Lucide React**: Ícones da interface
- **Tailwind CSS**: Estilização dos componentes
- **shadcn/ui**: Componentes de interface (Cards, Buttons, Badges, etc.)

## Tratamento de Erros

- **Timeout de requisições**: Implementado retry automático
- **Erros de rede**: Mensagens claras para o usuário
- **API indisponível**: Feedback visual com instruções
- **Dados inválidos**: Validação e fallbacks apropriados

## Configuração de Variáveis de Ambiente

⚠️ **IMPORTANTE**: Por questões de segurança, todas as configurações sensíveis são gerenciadas via variáveis de ambiente.

### Arquivo `.env`
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# WhatsApp API Configuration (AvisaAPI)
VITE_WHATSAPP_API_BASE_URL=https://www.avisaapi.com.br/api
VITE_WHATSAPP_API_TOKEN=seu_token_bearer_aqui
```

### Exemplo de Token
```env
VITE_WHATSAPP_API_TOKEN=vnyfGu1YPpbmukD53g8hdA30nEwB3QJWXDmGZIiHwhRTNlUcApTu0z94h5G4
```

### Validação Automática
O sistema automaticamente:
- ✅ Verifica se as variáveis estão configuradas
- ⚠️ Exibe alertas visuais se alguma configuração estiver faltando
- 🔒 Adiciona automaticamente o header `Authorization: Bearer {token}` nas requisições

## Melhorias Futuras Sugeridas

1. **Configuração avançada**: Permitir configurar diferentes instâncias/organizações
2. **Logs**: Adicionar logging das ações e eventos de conexão
3. **Notificações**: Push notifications quando a conexão for perdida
4. **Backup**: Sistema de backup/restauração das configurações
5. **Métricas**: Dashboard com estatísticas de uso do WhatsApp
6. **Rate limiting**: Implementar controle de taxa de requisições

## Segurança

- ✅ **Variáveis de ambiente**: URLs e tokens são gerenciados via `.env` (não commitados)
- ✅ **Permissões**: Funcionalidade restrita a usuários administradores
- ✅ **Headers de autenticação**: Bearer token automaticamente incluído nas requisições
- ✅ **Dados sensíveis**: QR Code não é armazenado permanentemente
- ✅ **Cache**: Dados são invalidados automaticamente para segurança
- ✅ **Validação**: Configuração é validada antes de fazer requisições

---

**Implementado em**: Janeiro 2025  
**Status**: ✅ Funcional e testado  
**Dependências**: AvisaAPI ativa e configurada 