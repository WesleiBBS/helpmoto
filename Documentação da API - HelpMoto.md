# Documentação da API - HelpMoto

## Visão Geral

A API do HelpMoto é uma RESTful API desenvolvida para suportar todas as funcionalidades do aplicativo de socorro para motociclistas. Esta documentação fornece informações detalhadas sobre endpoints, autenticação, estruturas de dados e exemplos de uso.

## Base URL

```
Desenvolvimento: http://localhost:3001/api/v1
Produção: https://api.helpmoto.com.br/v1
```

## Autenticação

### Tipos de Autenticação

#### JWT Bearer Token
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### API Key (para integrações)
```http
X-API-Key: sua_api_key_aqui
```

### Obter Token de Acesso

#### POST /auth/login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "userType": "client" // client, provider, admin
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_aqui",
    "expiresIn": 86400,
    "user": {
      "id": "user_123",
      "email": "usuario@exemplo.com",
      "name": "João Silva",
      "userType": "client",
      "verified": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### POST /auth/refresh
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token_aqui"
}
```

## Estruturas de Dados

### User (Usuário)
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "phone": "string",
  "userType": "client|provider|admin",
  "status": "active|inactive|suspended",
  "verified": "boolean",
  "profile": {
    "avatar": "string (URL)",
    "address": {
      "street": "string",
      "city": "string",
      "state": "string",
      "zipCode": "string",
      "coordinates": {
        "latitude": "number",
        "longitude": "number"
      }
    }
  },
  "preferences": {
    "notifications": "boolean",
    "locationSharing": "boolean",
    "marketing": "boolean"
  },
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

### Service Request (Solicitação de Serviço)
```json
{
  "id": "string",
  "clientId": "string",
  "providerId": "string|null",
  "type": "mechanical|electrical|tire|fuel|towing",
  "status": "pending|accepted|in_progress|completed|cancelled",
  "description": "string",
  "location": {
    "latitude": "number",
    "longitude": "number",
    "address": "string"
  },
  "destination": {
    "latitude": "number",
    "longitude": "number",
    "address": "string"
  },
  "estimatedPrice": "number",
  "finalPrice": "number|null",
  "estimatedArrival": "string (ISO 8601)",
  "completedAt": "string (ISO 8601)|null",
  "rating": {
    "score": "number (1-5)",
    "comment": "string"
  },
  "payment": {
    "method": "credit_card|debit_card|pix|cash",
    "status": "pending|processing|completed|failed",
    "transactionId": "string"
  },
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

### Provider (Prestador)
```json
{
  "id": "string",
  "userId": "string",
  "businessName": "string",
  "document": "string (CNPJ)",
  "services": ["mechanical", "electrical", "tire", "fuel", "towing"],
  "coverage": {
    "radius": "number (km)",
    "cities": ["string"]
  },
  "availability": {
    "status": "available|busy|offline",
    "workingHours": {
      "monday": {"start": "08:00", "end": "18:00"},
      "tuesday": {"start": "08:00", "end": "18:00"}
      // ... outros dias
    }
  },
  "location": {
    "latitude": "number",
    "longitude": "number",
    "lastUpdate": "string (ISO 8601)"
  },
  "rating": {
    "average": "number",
    "count": "number"
  },
  "stats": {
    "totalServices": "number",
    "completionRate": "number",
    "averageResponseTime": "number (minutes)"
  },
  "verification": {
    "status": "pending|approved|rejected",
    "documents": ["string (URLs)"],
    "verifiedAt": "string (ISO 8601)|null"
  }
}
```

## Endpoints da API

### Autenticação

#### POST /auth/register
Registra um novo usuário.

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "novo@exemplo.com",
  "password": "senha123",
  "name": "Maria Santos",
  "phone": "+5511999999999",
  "userType": "client",
  "acceptedTerms": true,
  "acceptedPrivacy": true
}
```

#### POST /auth/logout
Invalida o token atual.

```http
POST /api/v1/auth/logout
Authorization: Bearer token_aqui
```

#### POST /auth/forgot-password
Solicita redefinição de senha.

```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "usuario@exemplo.com"
}
```

### Usuários

#### GET /users/profile
Obtém perfil do usuário autenticado.

```http
GET /api/v1/users/profile
Authorization: Bearer token_aqui
```

#### PUT /users/profile
Atualiza perfil do usuário.

```http
PUT /api/v1/users/profile
Authorization: Bearer token_aqui
Content-Type: application/json

{
  "name": "João Silva Santos",
  "phone": "+5511888888888",
  "profile": {
    "address": {
      "street": "Rua Nova, 456",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01234-567"
    }
  }
}
```

#### DELETE /users/account
Exclui conta do usuário (LGPD).

```http
DELETE /api/v1/users/account
Authorization: Bearer token_aqui
```

### Serviços

#### POST /services/request
Cria nova solicitação de serviço.

```http
POST /api/v1/services/request
Authorization: Bearer token_aqui
Content-Type: application/json

{
  "type": "mechanical",
  "description": "Moto não liga, problema no motor",
  "location": {
    "latitude": -23.5505,
    "longitude": -46.6333,
    "address": "Rua Augusta, 123 - Centro, São Paulo - SP"
  },
  "destination": {
    "latitude": -23.5515,
    "longitude": -46.6343,
    "address": "Oficina do João - Rua Consolação, 456"
  },
  "urgency": "high"
}
```

#### GET /services/requests
Lista solicitações do usuário.

```http
GET /api/v1/services/requests?page=1&limit=10&status=completed
Authorization: Bearer token_aqui
```

#### GET /services/requests/:id
Obtém detalhes de uma solicitação.

```http
GET /api/v1/services/requests/service_123
Authorization: Bearer token_aqui
```

#### PUT /services/requests/:id/cancel
Cancela uma solicitação.

```http
PUT /api/v1/services/requests/service_123/cancel
Authorization: Bearer token_aqui
Content-Type: application/json

{
  "reason": "Não preciso mais do serviço"
}
```

#### POST /services/requests/:id/rating
Avalia um serviço concluído.

```http
POST /api/v1/services/requests/service_123/rating
Authorization: Bearer token_aqui
Content-Type: application/json

{
  "score": 5,
  "comment": "Excelente atendimento, muito rápido!"
}
```

### Prestadores

#### GET /providers/nearby
Busca prestadores próximos.

```http
GET /api/v1/providers/nearby?lat=-23.5505&lng=-46.6333&radius=10&service=mechanical
Authorization: Bearer token_aqui
```

#### POST /providers/register
Registra como prestador de serviços.

```http
POST /api/v1/providers/register
Authorization: Bearer token_aqui
Content-Type: application/json

{
  "businessName": "Oficina do João",
  "document": "12.345.678/0001-90",
  "services": ["mechanical", "electrical"],
  "coverage": {
    "radius": 15,
    "cities": ["São Paulo", "Osasco"]
  },
  "workingHours": {
    "monday": {"start": "08:00", "end": "18:00"},
    "tuesday": {"start": "08:00", "end": "18:00"}
  }
}
```

#### PUT /providers/availability
Atualiza disponibilidade do prestador.

```http
PUT /api/v1/providers/availability
Authorization: Bearer token_aqui
Content-Type: application/json

{
  "status": "available",
  "location": {
    "latitude": -23.5505,
    "longitude": -46.6333
  }
}
```

#### GET /providers/requests
Lista solicitações disponíveis para o prestador.

```http
GET /api/v1/providers/requests?page=1&limit=10
Authorization: Bearer token_aqui
```

#### POST /providers/requests/:id/accept
Aceita uma solicitação de serviço.

```http
POST /api/v1/providers/requests/service_123/accept
Authorization: Bearer token_aqui
Content-Type: application/json

{
  "estimatedArrival": "2024-01-15T15:30:00Z",
  "estimatedPrice": 45.00
}
```

#### PUT /providers/requests/:id/status
Atualiza status de um serviço.

```http
PUT /api/v1/providers/requests/service_123/status
Authorization: Bearer token_aqui
Content-Type: application/json

{
  "status": "in_progress",
  "location": {
    "latitude": -23.5505,
    "longitude": -46.6333
  },
  "notes": "Chegando ao local"
}
```

### Localização

#### POST /location/update
Atualiza localização atual.

```http
POST /api/v1/location/update
Authorization: Bearer token_aqui
Content-Type: application/json

{
  "latitude": -23.5505,
  "longitude": -46.6333,
  "accuracy": 10,
  "timestamp": "2024-01-15T14:30:00Z"
}
```

#### GET /location/geocode
Converte endereço em coordenadas.

```http
GET /api/v1/location/geocode?address=Rua Augusta, 123, São Paulo
Authorization: Bearer token_aqui
```

#### GET /location/reverse-geocode
Converte coordenadas em endereço.

```http
GET /api/v1/location/reverse-geocode?lat=-23.5505&lng=-46.6333
Authorization: Bearer token_aqui
```

### Pagamentos

#### POST /payments/methods
Adiciona método de pagamento.

```http
POST /api/v1/payments/methods
Authorization: Bearer token_aqui
Content-Type: application/json

{
  "type": "credit_card",
  "cardToken": "card_token_from_gateway",
  "isDefault": true
}
```

#### GET /payments/methods
Lista métodos de pagamento.

```http
GET /api/v1/payments/methods
Authorization: Bearer token_aqui
```

#### POST /payments/process
Processa pagamento de um serviço.

```http
POST /api/v1/payments/process
Authorization: Bearer token_aqui
Content-Type: application/json

{
  "serviceId": "service_123",
  "methodId": "method_456",
  "amount": 45.00
}
```

### Notificações

#### GET /notifications
Lista notificações do usuário.

```http
GET /api/v1/notifications?page=1&limit=20&unread=true
Authorization: Bearer token_aqui
```

#### PUT /notifications/:id/read
Marca notificação como lida.

```http
PUT /api/v1/notifications/notif_123/read
Authorization: Bearer token_aqui
```

#### POST /notifications/push/subscribe
Registra para notificações push.

```http
POST /api/v1/notifications/push/subscribe
Authorization: Bearer token_aqui
Content-Type: application/json

{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": {
    "p256dh": "chave_p256dh",
    "auth": "chave_auth"
  }
}
```

### Administração

#### GET /admin/dashboard
Obtém dados do dashboard administrativo.

```http
GET /api/v1/admin/dashboard
Authorization: Bearer admin_token
```

#### GET /admin/users
Lista usuários (admin).

```http
GET /api/v1/admin/users?page=1&limit=50&userType=client&status=active
Authorization: Bearer admin_token
```

#### PUT /admin/users/:id/status
Altera status de um usuário.

```http
PUT /api/v1/admin/users/user_123/status
Authorization: Bearer admin_token
Content-Type: application/json

{
  "status": "suspended",
  "reason": "Violação dos termos de uso"
}
```

#### GET /admin/providers/pending
Lista prestadores pendentes de aprovação.

```http
GET /api/v1/admin/providers/pending
Authorization: Bearer admin_token
```

#### PUT /admin/providers/:id/verify
Aprova ou rejeita prestador.

```http
PUT /api/v1/admin/providers/provider_123/verify
Authorization: Bearer admin_token
Content-Type: application/json

{
  "status": "approved",
  "notes": "Documentação verificada com sucesso"
}
```

## Códigos de Status HTTP

### Sucesso (2xx)
- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso
- `204 No Content` - Operação bem-sucedida sem conteúdo de resposta

### Erro do Cliente (4xx)
- `400 Bad Request` - Dados inválidos na requisição
- `401 Unauthorized` - Token de autenticação inválido ou ausente
- `403 Forbidden` - Acesso negado para o recurso
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Conflito com estado atual do recurso
- `422 Unprocessable Entity` - Dados válidos mas não processáveis
- `429 Too Many Requests` - Limite de taxa excedido

### Erro do Servidor (5xx)
- `500 Internal Server Error` - Erro interno do servidor
- `502 Bad Gateway` - Erro de gateway
- `503 Service Unavailable` - Serviço temporariamente indisponível

## Tratamento de Erros

### Estrutura de Resposta de Erro
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados de entrada inválidos",
    "details": [
      {
        "field": "email",
        "message": "Email é obrigatório"
      },
      {
        "field": "password",
        "message": "Senha deve ter pelo menos 8 caracteres"
      }
    ]
  },
  "timestamp": "2024-01-15T14:30:00Z",
  "path": "/api/v1/auth/register"
}
```

### Códigos de Erro Comuns
- `VALIDATION_ERROR` - Erro de validação de dados
- `AUTHENTICATION_ERROR` - Erro de autenticação
- `AUTHORIZATION_ERROR` - Erro de autorização
- `NOT_FOUND` - Recurso não encontrado
- `CONFLICT` - Conflito de dados
- `RATE_LIMIT_EXCEEDED` - Limite de taxa excedido
- `SERVICE_UNAVAILABLE` - Serviço indisponível

## Rate Limiting

### Limites por Endpoint
- Autenticação: 5 tentativas por minuto por IP
- Solicitações de serviço: 10 por hora por usuário
- Atualizações de localização: 60 por minuto por usuário
- Geral: 1000 requisições por hora por token

### Headers de Rate Limit
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248000
```

## Paginação

### Parâmetros de Query
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 20, máximo: 100)
- `sort` - Campo para ordenação
- `order` - Direção da ordenação (asc/desc)

### Resposta Paginada
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtros e Busca

### Parâmetros de Filtro
- `status` - Filtrar por status
- `type` - Filtrar por tipo
- `dateFrom` - Data inicial (ISO 8601)
- `dateTo` - Data final (ISO 8601)
- `search` - Busca textual

### Exemplo
```http
GET /api/v1/services/requests?status=completed&dateFrom=2024-01-01&dateTo=2024-01-31&search=mecânica
```

## Webhooks

### Configuração
```http
POST /api/v1/webhooks/configure
Authorization: Bearer token_aqui
Content-Type: application/json

{
  "url": "https://seu-servidor.com/webhook",
  "events": ["service.created", "service.completed"],
  "secret": "webhook_secret_key"
}
```

### Eventos Disponíveis
- `service.created` - Nova solicitação criada
- `service.accepted` - Solicitação aceita por prestador
- `service.completed` - Serviço concluído
- `service.cancelled` - Serviço cancelado
- `payment.completed` - Pagamento processado
- `user.registered` - Novo usuário registrado

### Estrutura do Webhook
```json
{
  "event": "service.completed",
  "timestamp": "2024-01-15T14:30:00Z",
  "data": {
    "serviceId": "service_123",
    "clientId": "user_456",
    "providerId": "provider_789",
    "finalPrice": 45.00
  },
  "signature": "sha256=hash_da_assinatura"
}
```

## SDK e Bibliotecas

### JavaScript/Node.js
```javascript
const HelpMotoAPI = require('helpmoto-api-sdk');

const client = new HelpMotoAPI({
  baseURL: 'https://api.helpmoto.com.br/v1',
  apiKey: 'sua_api_key'
});

// Criar solicitação de serviço
const service = await client.services.create({
  type: 'mechanical',
  description: 'Problema no motor',
  location: { lat: -23.5505, lng: -46.6333 }
});
```

### Python
```python
from helpmoto_api import HelpMotoClient

client = HelpMotoClient(
    base_url='https://api.helpmoto.com.br/v1',
    api_key='sua_api_key'
)

# Listar serviços
services = client.services.list(status='completed')
```

## Ambientes

### Desenvolvimento
- Base URL: `http://localhost:3001/api/v1`
- Rate Limits: Relaxados
- Logs: Detalhados
- CORS: Permissivo

### Staging
- Base URL: `https://api-staging.helpmoto.com.br/v1`
- Rate Limits: Similares à produção
- Logs: Moderados
- CORS: Restrito

### Produção
- Base URL: `https://api.helpmoto.com.br/v1`
- Rate Limits: Rigorosos
- Logs: Essenciais
- CORS: Restrito
- HTTPS: Obrigatório

## Versionamento

### Estratégia de Versionamento
- Versionamento por URL: `/api/v1/`, `/api/v2/`
- Backward compatibility mantida por 12 meses
- Deprecation notices com 6 meses de antecedência

### Headers de Versão
```http
API-Version: 1.0
Deprecated-Version: false
Sunset-Date: 2025-01-15T00:00:00Z
```

## Monitoramento e Observabilidade

### Health Check
```http
GET /api/v1/health
```

**Resposta:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T14:30:00Z",
  "version": "1.0.0",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "external_apis": "healthy"
  }
}
```

### Métricas
- Tempo de resposta por endpoint
- Taxa de erro por endpoint
- Throughput de requisições
- Uso de recursos

## Suporte

### Canais de Suporte
- **Documentação**: https://docs.helpmoto.com.br/api
- **Issues**: https://github.com/helpmoto/api/issues
- **Email**: api-support@helpmoto.com.br
- **Slack**: #api-support

### SLA
- Uptime: 99.9%
- Tempo de resposta: < 200ms (95th percentile)
- Suporte: 24/7 para issues críticas

---

**Esta documentação é atualizada automaticamente. Versão atual: 1.0.0**

