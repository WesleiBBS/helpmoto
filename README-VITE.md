# HelpMoto - PWA com Vite

Aplicativo PWA de socorro para motociclistas construído com React e Vite.

## 🚀 Como executar o projeto

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório ou navegue até a pasta do projeto
2. Instale as dependências:
```bash
npm install
```

### Executar em desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Build para produção

```bash
npm run build
```

### Visualizar build de produção

```bash
npm run preview
```

## 📱 Funcionalidades PWA

- ✅ Instalável no dispositivo
- ✅ Funciona offline (básico)
- ✅ Responsivo para mobile e desktop
- ✅ Service Worker para cache
- ✅ Manifest.json configurado

## 🛠️ Tecnologias utilizadas

- **React 18** - Interface de usuário
- **Vite** - Build tool e dev server
- **React Leaflet** - Mapas (substitui react-native-maps)
- **React Router** - Navegação
- **PWA Plugin** - Funcionalidades PWA

## 📁 Estrutura do projeto

```
src/
├── components/     # Componentes reutilizáveis
├── screens/        # Telas da aplicação  
├── contexts/       # Contextos React
├── navigation/     # Configuração de rotas
├── utils/          # Utilitários
├── constants/      # Constantes da aplicação
└── main.jsx        # Ponto de entrada
```

## 🔧 Scripts disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza build de produção
- `npm run serve` - Serve a aplicação (alias para preview)

## 📝 Notas importantes

1. **Mapas**: Migrado de react-native-maps para react-leaflet
2. **Ícones**: Substituídos por emojis Unicode (pode ser melhorado com uma biblioteca de ícones)
3. **Navegação**: Migrado de React Navigation para React Router
4. **Estilos**: Convertidos de StyleSheet para objetos CSS-in-JS
5. **PWA**: Configurado com service worker e manifest

## 🔄 Próximos passos

- [ ] Implementar biblioteca de ícones adequada
- [ ] Adicionar testes unitários
- [ ] Melhorar cache offline
- [ ] Implementar notificações push
- [ ] Adicionar mais funcionalidades PWA
