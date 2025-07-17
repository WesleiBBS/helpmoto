# HelpMoto - Aplicativo de Socorro para Motociclistas

## Visão Geral

O HelpMoto é um aplicativo Progressive Web App (PWA) desenvolvido em React Native com Expo, projetado especificamente para oferecer serviços de socorro e assistência para motociclistas. O aplicativo conecta usuários que precisam de ajuda com prestadores de serviços qualificados, utilizando geolocalização inteligente para encontrar a assistência mais próxima.

## Características Principais

### 🚀 Tecnologia Moderna
- **React Native com Expo**: Framework multiplataforma para desenvolvimento mobile
- **Progressive Web App (PWA)**: Instalável em Android e iOS
- **Geolocalização Inteligente**: Localização precisa em tempo real
- **Interface Responsiva**: Adaptável a diferentes tamanhos de tela

### 🔒 Segurança e Privacidade
- **Conformidade LGPD**: Total adequação à Lei Geral de Proteção de Dados
- **Criptografia de Dados**: Proteção de informações sensíveis
- **Autenticação Segura**: Sistema robusto de login e sessões
- **Controle de Consentimento**: Gestão transparente de permissões

### 🛠️ Funcionalidades Completas
- **Solicitação de Socorro**: Interface intuitiva para pedidos de ajuda
- **Rastreamento em Tempo Real**: Acompanhamento do prestador de serviços
- **Sistema de Pagamentos**: Integração com métodos de pagamento seguros
- **Avaliações e Feedback**: Sistema de classificação de prestadores
- **Histórico de Serviços**: Registro completo de atendimentos

## Arquitetura do Sistema

### Estrutura de Pastas
```
HelpMoto/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   ├── screens/            # Telas do aplicativo
│   │   ├── auth/           # Autenticação
│   │   ├── client/         # Interface do cliente
│   │   ├── provider/       # Interface do prestador
│   │   ├── admin/          # Painel administrativo
│   │   └── privacy/        # Configurações de privacidade
│   ├── navigation/         # Configuração de navegação
│   ├── contexts/           # Contextos React (Auth, LGPD)
│   ├── utils/              # Utilitários e helpers
│   ├── services/           # Serviços de API
│   └── constants/          # Constantes da aplicação
├── public/                 # Arquivos públicos PWA
│   ├── manifest.json       # Manifest PWA
│   ├── sw.js              # Service Worker
│   └── icons/             # Ícones da aplicação
└── docs/                  # Documentação
```

### Componentes Principais

#### Autenticação e Segurança
- **AuthContext**: Gerenciamento de estado de autenticação
- **LGPDContext**: Controle de consentimentos e privacidade
- **SecurityManager**: Criptografia e armazenamento seguro
- **InputSanitizer**: Validação e sanitização de entradas

#### Interface do Usuário
- **Button**: Componente de botão personalizado
- **Input**: Campo de entrada com validação
- **LoadingScreen**: Tela de carregamento
- **Navigation**: Sistema de navegação por abas

#### Funcionalidades Core
- **LocationService**: Serviços de geolocalização
- **PaymentService**: Integração com pagamentos
- **NotificationService**: Sistema de notificações
- **PWAUtils**: Utilitários para funcionalidades PWA

## Tipos de Usuário

### 1. Cliente (Motociclista)
- Solicitar socorro em emergências
- Acompanhar prestador em tempo real
- Avaliar serviços recebidos
- Gerenciar histórico de atendimentos
- Configurar preferências de privacidade

### 2. Prestador de Serviços
- Receber solicitações de socorro
- Gerenciar status de disponibilidade
- Navegar até o local do cliente
- Atualizar progresso do atendimento
- Visualizar ganhos e estatísticas

### 3. Administrador
- Gerenciar usuários e prestadores
- Monitorar serviços em tempo real
- Gerar relatórios e estatísticas
- Configurar preços e políticas
- Supervisionar conformidade LGPD

## Funcionalidades Detalhadas

### Solicitação de Socorro
O sistema permite que motociclistas solicitem diferentes tipos de assistência:

- **Mecânica**: Problemas no motor, transmissão, freios
- **Elétrica**: Falhas no sistema elétrico, bateria
- **Pneu**: Furos, troca de pneus
- **Combustível**: Falta de combustível, problemas no tanque
- **Reboque**: Transporte da motocicleta

### Geolocalização Inteligente
- Detecção automática da localização atual
- Busca de prestadores em raio configurável
- Cálculo de rotas otimizadas
- Estimativa de tempo de chegada
- Rastreamento em tempo real

### Sistema de Pagamentos
- Múltiplas formas de pagamento
- Cálculo automático de preços
- Processamento seguro de transações
- Histórico financeiro completo
- Relatórios de faturamento

### Avaliações e Feedback
- Sistema de estrelas (1-5)
- Comentários detalhados
- Histórico de avaliações
- Ranking de prestadores
- Moderação de conteúdo

## Conformidade LGPD

### Princípios Implementados
- **Transparência**: Informações claras sobre uso de dados
- **Finalidade**: Coleta limitada ao necessário
- **Minimização**: Apenas dados essenciais
- **Consentimento**: Controle total pelo usuário
- **Segurança**: Proteção técnica e administrativa

### Direitos dos Titulares
- Acesso aos dados pessoais
- Correção de informações
- Exclusão de dados (direito ao esquecimento)
- Portabilidade de dados
- Revogação de consentimento
- Informações sobre compartilhamento

### Medidas de Segurança
- Criptografia AES-256
- Armazenamento seguro (SecureStore)
- Logs de auditoria
- Controle de acesso
- Backup criptografado
- Monitoramento de segurança

## Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Expo CLI
- Conta Expo (opcional)

### Instalação
```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/helpmoto.git
cd helpmoto

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Iniciar o servidor de desenvolvimento
npm start
```

### Configuração PWA
```bash
# Gerar ícones PWA
npm run generate-icons

# Build para produção
npm run build

# Deploy
npm run deploy
```

### Variáveis de Ambiente
```env
REACT_APP_API_BASE_URL=https://api.helpmoto.com.br
REACT_APP_GOOGLE_MAPS_API_KEY=sua_chave_aqui
REACT_APP_VAPID_PUBLIC_KEY=chave_vapid_publica
REACT_APP_ENVIRONMENT=development
```

## Testes

### Testes Unitários
```bash
npm run test
```

### Testes de Integração
```bash
npm run test:integration
```

### Testes E2E
```bash
npm run test:e2e
```

### Cobertura de Testes
```bash
npm run test:coverage
```

## Deploy

### Ambiente de Desenvolvimento
- Expo Development Server
- Hot Reload ativo
- Debug habilitado

### Ambiente de Produção
- Build otimizado
- Service Worker ativo
- Compressão de assets
- Cache estratégico

### Plataformas Suportadas
- **Web**: PWA instalável
- **Android**: Via Google Play Store ou APK
- **iOS**: Via App Store (requer conta Apple Developer)

## Monitoramento e Analytics

### Métricas Coletadas
- Tempo de resposta da aplicação
- Taxa de conversão de solicitações
- Satisfação do usuário
- Performance de prestadores
- Uso de funcionalidades

### Ferramentas de Monitoramento
- Expo Analytics
- Google Analytics
- Sentry (Error Tracking)
- Performance Monitoring

## Suporte e Manutenção

### Canais de Suporte
- **Email**: suporte@helpmoto.com.br
- **Chat**: Disponível no aplicativo
- **Telefone**: (11) 3000-0000
- **FAQ**: Central de ajuda online

### Atualizações
- Atualizações automáticas via PWA
- Notificações de novas versões
- Changelog detalhado
- Migração de dados automática

## Contribuição

### Como Contribuir
1. Fork do repositório
2. Criar branch para feature
3. Implementar mudanças
4. Escrever testes
5. Submeter Pull Request

### Padrões de Código
- ESLint configurado
- Prettier para formatação
- Conventional Commits
- Documentação obrigatória

### Processo de Review
- Code review obrigatório
- Testes automatizados
- Verificação de segurança
- Aprovação de maintainer

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contato

**Equipe HelpMoto**
- Website: https://helpmoto.com.br
- Email: contato@helpmoto.com.br
- LinkedIn: /company/helpmoto
- GitHub: /helpmoto

---

**Desenvolvido com ❤️ pela equipe HelpMoto**

