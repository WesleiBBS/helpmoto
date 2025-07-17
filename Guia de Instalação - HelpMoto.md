# Guia de Instalação - HelpMoto

## Visão Geral

Este guia fornece instruções detalhadas para instalar, configurar e executar o aplicativo HelpMoto em diferentes ambientes. O HelpMoto é um Progressive Web App (PWA) desenvolvido com React Native e Expo, projetado para funcionar em dispositivos móveis e desktop.

## Pré-requisitos do Sistema

### Requisitos Mínimos

#### Para Desenvolvimento
- **Sistema Operacional**: Windows 10+, macOS 10.15+, ou Linux Ubuntu 18.04+
- **Node.js**: Versão 18.0.0 ou superior
- **npm**: Versão 8.0.0 ou superior (incluído com Node.js)
- **Memória RAM**: Mínimo 8GB recomendado
- **Espaço em Disco**: 5GB livres
- **Conexão com Internet**: Necessária para download de dependências

#### Para Produção
- **Servidor Web**: Nginx, Apache, ou similar
- **HTTPS**: Certificado SSL válido (obrigatório para PWA)
- **Banco de Dados**: PostgreSQL 12+ ou MongoDB 4.4+
- **Redis**: Para cache e sessões
- **Node.js**: Versão 18+ para APIs backend

### Ferramentas Necessárias

#### Obrigatórias
```bash
# Node.js e npm
node --version  # deve ser >= 18.0.0
npm --version   # deve ser >= 8.0.0

# Git
git --version
```

#### Opcionais (Recomendadas)
```bash
# Yarn (alternativa ao npm)
yarn --version

# Expo CLI Global
npm install -g @expo/cli

# VS Code (editor recomendado)
code --version
```

## Instalação Passo a Passo

### 1. Preparação do Ambiente

#### Instalação do Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS (usando Homebrew)
brew install node@18

# Windows
# Baixar e instalar do site oficial: https://nodejs.org
```

#### Verificação da Instalação
```bash
node --version
npm --version
```

### 2. Clonagem do Projeto

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/helpmoto.git

# Navegar para o diretório
cd helpmoto

# Verificar a estrutura
ls -la
```

### 3. Instalação de Dependências

#### Dependências Principais
```bash
# Instalar todas as dependências
npm install

# Ou usando Yarn
yarn install
```

#### Dependências Específicas (se necessário)
```bash
# React Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs

# Componentes nativos
npm install react-native-screens react-native-safe-area-context

# Expo específicos
npm install expo-location expo-notifications expo-secure-store

# Mapas
npm install react-native-maps expo-maps

# Ícones
npm install @expo/vector-icons

# Criptografia
npm install crypto-js

# Utilitários
npm install moment lodash
```

### 4. Configuração do Ambiente

#### Arquivo de Configuração (.env)
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar configurações
nano .env
```

#### Conteúdo do .env
```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3001
REACT_APP_API_TIMEOUT=30000

# Google Maps
REACT_APP_GOOGLE_MAPS_API_KEY=sua_chave_google_maps_aqui

# Push Notifications
REACT_APP_VAPID_PUBLIC_KEY=sua_chave_vapid_publica
REACT_APP_VAPID_PRIVATE_KEY=sua_chave_vapid_privada

# Environment
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=true

# Security
REACT_APP_ENCRYPTION_KEY=sua_chave_criptografia_segura

# External Services
REACT_APP_PAYMENT_GATEWAY_URL=https://api.pagamento.com
REACT_APP_PAYMENT_PUBLIC_KEY=chave_publica_pagamento

# Analytics
REACT_APP_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
REACT_APP_SENTRY_DSN=https://sentry.io/dsn

# PWA
REACT_APP_PWA_NAME=HelpMoto
REACT_APP_PWA_SHORT_NAME=HelpMoto
REACT_APP_PWA_THEME_COLOR=#FF6B35
```

### 5. Configuração de Serviços Externos

#### Google Maps API
1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione existente
3. Ative as APIs necessárias:
   - Maps JavaScript API
   - Geocoding API
   - Directions API
   - Places API
4. Crie credenciais (API Key)
5. Configure restrições de domínio

#### Notificações Push (VAPID)
```bash
# Gerar chaves VAPID
npx web-push generate-vapid-keys

# Adicionar as chaves ao .env
```

#### Configuração de Pagamentos
```javascript
// Exemplo para Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Exemplo para PagSeguro
const pagseguro = require('pagseguro')(process.env.PAGSEGURO_TOKEN);
```

### 6. Configuração do Banco de Dados

#### PostgreSQL (Recomendado)
```sql
-- Criar banco de dados
CREATE DATABASE helpmoto;

-- Criar usuário
CREATE USER helpmoto_user WITH PASSWORD 'senha_segura';

-- Conceder permissões
GRANT ALL PRIVILEGES ON DATABASE helpmoto TO helpmoto_user;
```

#### MongoDB (Alternativa)
```javascript
// Configuração de conexão
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/helpmoto', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

### 7. Configuração do Service Worker

#### Registro Automático
O service worker é registrado automaticamente quando o app é carregado na web. Verifique se o arquivo `public/sw.js` está presente.

#### Configuração Manual (se necessário)
```javascript
// Em src/utils/pwa.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('SW registrado:', registration);
    })
    .catch(error => {
      console.log('Erro no SW:', error);
    });
}
```

## Execução do Aplicativo

### Ambiente de Desenvolvimento

#### Iniciar Servidor de Desenvolvimento
```bash
# Usando npm
npm start

# Usando Yarn
yarn start

# Usando Expo CLI
expo start
```

#### Opções de Execução
```bash
# Web (navegador)
npm run web
# ou pressione 'w' no terminal do Expo

# Android (emulador ou dispositivo)
npm run android
# ou pressione 'a' no terminal do Expo

# iOS (apenas macOS)
npm run ios
# ou pressione 'i' no terminal do Expo
```

### Ambiente de Produção

#### Build para Produção
```bash
# Build web
expo build:web

# Build Android
expo build:android

# Build iOS
expo build:ios
```

#### Deploy Web
```bash
# Build estático
npm run build

# Servir arquivos estáticos
npx serve -s build

# Ou usar servidor web
# Copiar arquivos de build/ para /var/www/html/
```

## Configuração de Servidor Web

### Nginx
```nginx
server {
    listen 80;
    server_name helpmoto.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name helpmoto.com.br;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    root /var/www/helpmoto;
    index index.html;

    # PWA Configuration
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Service Worker
    location /sw.js {
        add_header Cache-Control "no-cache";
        proxy_cache_bypass $http_pragma;
        proxy_cache_revalidate on;
        expires off;
        access_log off;
    }

    # Manifest
    location /manifest.json {
        add_header Cache-Control "no-cache";
    }

    # API Proxy
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Apache
```apache
<VirtualHost *:80>
    ServerName helpmoto.com.br
    Redirect permanent / https://helpmoto.com.br/
</VirtualHost>

<VirtualHost *:443>
    ServerName helpmoto.com.br
    DocumentRoot /var/www/helpmoto
    
    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key
    
    # PWA Configuration
    <Directory /var/www/helpmoto>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Fallback for SPA
        FallbackResource /index.html
    </Directory>
    
    # Cache static assets
    <LocationMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
        Header append Cache-Control "public, immutable"
    </LocationMatch>
    
    # Service Worker no-cache
    <LocationMatch "sw\.js$">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
        Header set Pragma "no-cache"
        Header set Expires 0
    </LocationMatch>
</VirtualHost>
```

## Configuração de SSL/HTTPS

### Certificado Let's Encrypt
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d helpmoto.com.br

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Certificado Comercial
```bash
# Gerar CSR
openssl req -new -newkey rsa:2048 -nodes -keyout helpmoto.key -out helpmoto.csr

# Instalar certificado fornecido pela CA
# Configurar no servidor web
```

## Monitoramento e Logs

### Configuração de Logs
```javascript
// Winston para logs estruturados
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### PM2 para Produção
```bash
# Instalar PM2
npm install -g pm2

# Configurar aplicação
pm2 start ecosystem.config.js

# Monitoramento
pm2 monit

# Logs
pm2 logs
```

## Troubleshooting

### Problemas Comuns

#### Erro de Dependências
```bash
# Limpar cache npm
npm cache clean --force

# Remover node_modules
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

#### Problemas de Permissão
```bash
# Configurar npm para usuário atual
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

#### Service Worker não Funciona
```javascript
// Verificar HTTPS
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  console.warn('Service Worker requer HTTPS');
}

// Verificar registro
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('SW registrados:', registrations);
});
```

#### Problemas de CORS
```javascript
// Configurar CORS no backend
app.use(cors({
  origin: ['https://helpmoto.com.br', 'http://localhost:19006'],
  credentials: true
}));
```

### Logs de Debug

#### Ativar Debug Mode
```bash
# Variável de ambiente
export DEBUG=helpmoto:*

# Ou no .env
REACT_APP_DEBUG=true
```

#### Verificar Console
```javascript
// Logs detalhados no navegador
console.log('App iniciado:', new Date());
console.log('Configurações:', process.env);
```

## Backup e Recuperação

### Backup de Dados
```bash
# PostgreSQL
pg_dump helpmoto > backup_$(date +%Y%m%d).sql

# MongoDB
mongodump --db helpmoto --out backup_$(date +%Y%m%d)

# Arquivos de configuração
tar -czf config_backup.tar.gz .env nginx.conf
```

### Recuperação
```bash
# PostgreSQL
psql helpmoto < backup_20240116.sql

# MongoDB
mongorestore backup_20240116/helpmoto

# Configurações
tar -xzf config_backup.tar.gz
```

## Segurança

### Checklist de Segurança
- [ ] HTTPS configurado
- [ ] Certificado SSL válido
- [ ] Headers de segurança configurados
- [ ] CORS configurado corretamente
- [ ] Variáveis de ambiente protegidas
- [ ] Logs de auditoria ativados
- [ ] Backup automatizado
- [ ] Monitoramento de segurança

### Headers de Segurança
```nginx
# Nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'" always;
```

## Suporte

### Canais de Suporte
- **Documentação**: https://docs.helpmoto.com.br
- **Issues**: https://github.com/helpmoto/helpmoto/issues
- **Email**: dev@helpmoto.com.br
- **Discord**: https://discord.gg/helpmoto

### Informações para Suporte
Ao solicitar suporte, inclua:
- Versão do Node.js
- Sistema operacional
- Logs de erro
- Passos para reproduzir o problema
- Configurações relevantes (sem dados sensíveis)

---

**Este guia é atualizado regularmente. Verifique a versão mais recente na documentação oficial.**

