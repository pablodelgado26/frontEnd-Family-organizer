# 👨‍👩‍👧‍👦 Family Organizer - Frontend

> Sistema completo de organização familiar com múltiplas famílias, agenda, anotações, galeria e muito mais.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 📑 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Componentes](#-componentes)
- [Contexts e Hooks](#-contexts-e-hooks)
- [Rotas](#-rotas)
- [Sistema de Famílias](#-sistema-de-famílias)
- [Sistema de Autenticação](#-sistema-de-autenticação)
- [Estilização](#-estilização)
- [API Integration](#-api-integration)
- [Guia de Desenvolvimento](#-guia-de-desenvolvimento)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Sobre o Projeto

O **Family Organizer** é uma aplicação web moderna e responsiva desenvolvida para ajudar famílias a se organizarem de forma colaborativa. O sistema permite que múltiplas famílias gerenciem seus compromissos, anotações, fotos e lugares importantes, tudo em um só lugar.

### 🌟 Destaques

- **🏠 Múltiplas Famílias**: Um usuário pode pertencer e gerenciar várias famílias
- **📱 100% Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **🎨 Interface Moderna**: Design limpo com gradientes e animações suaves
- **⚡ Performance**: Utiliza Next.js 15 com Turbopack para builds ultra-rápidos
- **🔒 Seguro**: Sistema robusto de autenticação com JWT
- **♿ Acessível**: Componentes com suporte a navegação por teclado e leitores de tela

---

## ✨ Funcionalidades

### 👥 Gestão de Famílias
- ✅ Criar novas famílias (criador vira admin automaticamente)
- ✅ Entrar em famílias com códigos de convite
- ✅ Códigos permanentes (9 caracteres) que nunca expiram
- ✅ Códigos temporários (6 caracteres) válidos por 15 minutos
- ✅ Trocar entre famílias com dropdown elegante
- ✅ Gerenciar membros (admin pode remover)
- ✅ Sistema de roles: Admin e Member
- ✅ Sair de famílias quando desejar

### 📊 Dashboard
- ✅ Visão geral de todos os compromissos
- ✅ Estatísticas rápidas (eventos, notas, fotos, lugares)
- ✅ Próximos eventos e consultas
- ✅ Anotações recentes
- ✅ Fotos recentes da galeria
- ✅ Lista de membros da família
- ✅ Compartilhamento rápido de código de convite

### 📅 Agenda
- ✅ Gerenciar eventos e compromissos
- ✅ Visualizar próximos eventos
- ✅ Filtragem por tipo (consultas, eventos)
- ✅ Detalhes completos: data, hora, local, descrição

### 📝 Anotações
- ✅ Criar e editar anotações da família
- ✅ Categorias: Geral, Compras, Escola, Saúde, Trabalho, Finanças
- ✅ Sistema de prioridades (fixar no topo)
- ✅ Busca em tempo real
- ✅ Filtro por categoria
- ✅ Ordenação por data, título ou autor
- ✅ Cards coloridos com ícones

### 📍 Lugares
- ✅ Salvar lugares importantes da família
- ✅ Categorizar locais (restaurantes, hospitais, escolas, etc.)
- ✅ Endereço completo e observações
- ✅ Visualização em cards

### 📸 Galeria
- ✅ Upload de fotos da família
- ✅ Visualização em grade responsiva
- ✅ Descrições e legendas
- ✅ Fotos recentes no dashboard

### 👤 Perfil
- ✅ Editar informações pessoais
- ✅ Upload de foto de perfil
- ✅ Alterar senha
- ✅ Validação de campos
- ✅ Preview de foto antes de salvar
- ✅ Mensagens de sucesso/erro

---

## 🛠 Tecnologias

### Core
- **[Next.js 15.5.2](https://nextjs.org/)** - Framework React com App Router
- **[React 19.1.0](https://reactjs.org/)** - Biblioteca JavaScript para UI
- **[Turbopack](https://turbo.build/pack)** - Bundler ultra-rápido

### Requisições HTTP
- **[Axios 1.12.2](https://axios-http.com/)** - Cliente HTTP para requisições à API

### Gerenciamento de Estado
- **Context API** - Estado global (Auth, Family)
- **React Hooks** - Estado local e efeitos
- **Custom Hooks** - Lógica reutilizável (useFamilies)

### Estilização
- **CSS Modules** - Estilos com escopo de componente
- **CSS Variables** - Tema customizável
- **CSS Animations** - Transições e animações suaves

### Ferramentas de Desenvolvimento
- **[ESLint](https://eslint.org/)** - Linter para qualidade de código
- **[js-cookie 3.0.5](https://github.com/js-cookie/js-cookie)** - Gerenciamento de cookies

---

## 🏗 Arquitetura

### Padrão de Projeto
```
Frontend (Next.js)
    ↓
Context Providers (Auth, Family)
    ↓
Protected Routes
    ↓
Page Components
    ↓
Custom Hooks (useFamilies)
    ↓
API Service (Axios)
    ↓
Backend REST API (Express + Prisma)
```

### Fluxo de Autenticação
```
1. Usuário faz login/register
2. Backend retorna JWT token + dados do usuário
3. Token armazenado no localStorage
4. Token enviado em todas as requisições (Authorization header)
5. AuthContext mantém estado do usuário
6. ProtectedRoute valida autenticação antes de renderizar
```

### Fluxo de Famílias
```
1. Usuário autenticado
2. FamilyContext carrega famílias do usuário
3. Seleciona última família usada (localStorage) ou primeira
4. Todas as páginas usam selectedFamily para filtrar dados
5. Usuário pode trocar de família via FamilySelector
6. Dados são recarregados automaticamente
```

---

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Backend rodando em `http://localhost:4000`

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/pablodelgado26/frontEnd-Family-organizer.git
cd frontEnd-Family-organizer
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o backend**
   - Certifique-se de que o backend está rodando na porta 4000
   - O arquivo `src/services/api.js` aponta para `http://localhost:4000`

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

5. **Acesse a aplicação**
```
http://localhost:3000
```

### Scripts Disponíveis

```bash
# Desenvolvimento com Turbopack
npm run dev

# Build de produção
npm run build

# Iniciar servidor de produção
npm start

# Rodar linter
npm run lint
```

---

## 📁 Estrutura de Pastas

```
frontEnd-Family-organizer/
│
├── public/                          # Arquivos estáticos
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── src/
│   ├── app/                         # App Router (Next.js 15)
│   │   ├── layout.jsx              # Layout raiz com providers
│   │   ├── page.jsx                # Página inicial (home/login)
│   │   ├── globals.css             # Estilos globais + CSS variables
│   │   ├── page.module.css         # Estilos da home
│   │   │
│   │   ├── dashboard/              # Painel principal
│   │   │   ├── page.jsx
│   │   │   └── page.module.css
│   │   │
│   │   ├── agenda/                 # Calendário e eventos
│   │   │   ├── page.jsx
│   │   │   └── page.module.css
│   │   │
│   │   ├── notes/                  # Anotações da família
│   │   │   ├── page.jsx
│   │   │   └── page.module.css
│   │   │
│   │   ├── places/                 # Lugares importantes
│   │   │   ├── page.jsx
│   │   │   └── page.module.css
│   │   │
│   │   ├── gallery/                # Galeria de fotos
│   │   │   ├── page.jsx
│   │   │   └── page.module.css
│   │   │
│   │   ├── profile/                # Perfil do usuário
│   │   │   ├── page.jsx
│   │   │   └── page.module.css
│   │   │
│   │   └── family/                 # Gestão de famílias
│   │       ├── create/             # Criar nova família
│   │       │   ├── page.jsx
│   │       │   ├── page.module.css
│   │       │   └── SuccessModal.js
│   │       └── manage/             # Gerenciar membros e convites
│   │           ├── page.jsx
│   │           └── page.module.css
│   │
│   ├── components/                  # Componentes reutilizáveis
│   │   ├── ProtectedRoute.js       # HOC para rotas autenticadas
│   │   ├── FamilySelector.jsx      # Dropdown de troca de família
│   │   ├── FamilySelector.module.css
│   │   ├── CreateFamilyModal.jsx   # Modal para criar família
│   │   ├── JoinFamilyModal.jsx     # Modal para entrar em família
│   │   └── Modal.module.css        # Estilos compartilhados de modals
│   │
│   ├── contexts/                    # Context API
│   │   ├── AuthContext.js          # Autenticação global
│   │   └── FamilyContext.js        # Estado de famílias
│   │
│   ├── hooks/                       # Custom Hooks
│   │   └── useFamilies.js          # Hook para gestão de famílias
│   │
│   ├── services/                    # Serviços externos
│   │   └── api.js                  # Configuração do Axios
│   │
│   └── lib/                         # Utilitários
│       └── api.js                  # Helper functions
│
├── .eslintrc.json                   # Configuração ESLint
├── eslint.config.mjs                # Config ESLint (ES Modules)
├── jsconfig.json                    # Aliases de importação (@/)
├── next.config.mjs                  # Configuração do Next.js
├── package.json                     # Dependências e scripts
├── MULTIPLE_FAMILIES.md             # Docs sobre sistema de famílias
└── README.md                        # Este arquivo
```

---

## 🧩 Componentes

### ProtectedRoute
**Localização**: `src/components/ProtectedRoute.js`

Higher-Order Component que protege rotas que necessitam autenticação.

```jsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function SecurePage() {
  return (
    <ProtectedRoute>
      <YourComponent />
    </ProtectedRoute>
  );
}
```

**Funcionalidades**:
- ✅ Verifica se usuário está autenticado
- ✅ Redireciona para `/` se não autenticado
- ✅ Mostra loading durante verificação
- ✅ Permite acesso se autenticado

---

### FamilySelector
**Localização**: `src/components/FamilySelector.jsx`

Dropdown elegante para trocar entre famílias.

```jsx
import FamilySelector from '@/components/FamilySelector';
import { useFamily } from '@/contexts/FamilyContext';

function MyComponent() {
  const { families, selectedFamily, selectFamily } = useFamily();
  
  return (
    <FamilySelector
      families={families}
      selectedFamily={selectedFamily}
      onSelectFamily={selectFamily}
      onCreateFamily={() => setShowCreateModal(true)}
    />
  );
}
```

**Features**:
- 👑 Badge de admin para famílias onde usuário é admin
- 👥 Contagem de membros
- ➕ Opção "Criar Nova Família"
- 🎨 Animação slide-down
- 📱 Responsivo

---

### CreateFamilyModal
**Localização**: `src/components/CreateFamilyModal.jsx`

Modal para criar nova família.

```jsx
import CreateFamilyModal from '@/components/CreateFamilyModal';
import { useFamilies } from '@/hooks/useFamilies';

function MyComponent() {
  const { createFamily } = useFamilies();
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Criar Família
      </button>
      
      {showModal && (
        <CreateFamilyModal
          onClose={() => setShowModal(false)}
          onCreate={createFamily}
        />
      )}
    </>
  );
}
```

**Features**:
- ✏️ Campo para nome da família
- ✅ Validação de campo obrigatório
- ⏳ Loading state
- ❌ Botão de cancelar
- 🎭 Overlay com fade-in

---

### JoinFamilyModal
**Localização**: `src/components/JoinFamilyModal.jsx`

Modal para entrar em família com código de convite.

```jsx
import JoinFamilyModal from '@/components/JoinFamilyModal';
import { useFamilies } from '@/hooks/useFamilies';

function MyComponent() {
  const { joinFamily, joinFamilyTemp } = useFamilies();
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Entrar em Família
      </button>
      
      {showModal && (
        <JoinFamilyModal
          onClose={() => setShowModal(false)}
          onJoin={joinFamily}
          onJoinTemp={joinFamilyTemp}
        />
      )}
    </>
  );
}
```

**Features**:
- 🔀 Toggle entre código permanente (9 chars) e temporário (6 chars)
- 🔤 Conversão automática para maiúsculas
- 📏 Validação de tamanho
- ⏱️ Indicação de expiração (15 min para temporário)
- ✅ Validação de formato

---

## 🎣 Contexts e Hooks

### AuthContext
**Localização**: `src/contexts/AuthContext.js`

Gerencia autenticação global da aplicação.

#### Provider
```jsx
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

#### Hook useAuth
```jsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { 
    user,           // Dados do usuário logado
    login,          // Função de login
    register,       // Função de registro
    logout,         // Função de logout
    updateUser,     // Atualizar dados do usuário
    loading,        // Estado de carregamento
    isAuthenticated // Boolean se está autenticado
  } = useAuth();
  
  return <div>Olá, {user?.name}!</div>;
}
```

#### Métodos

**login(email, password)**
```javascript
const result = await login('user@example.com', 'senha123');

if (result.success) {
  console.log('Usuário logado:', result.user);
} else {
  console.error('Erro:', result.error);
}
```

**register(name, email, password, gender, photoUrl)**
```javascript
const result = await register(
  'João Silva',
  'joao@example.com',
  'senha123',
  'masculino',
  'https://example.com/photo.jpg' // opcional
);

if (result.success) {
  console.log('Usuário registrado:', result.user);
}
```

**logout()**
```javascript
logout(); // Remove token e dados do localStorage
```

**updateUser(updatedData)**
```javascript
updateUser({
  name: 'João da Silva',
  photoUrl: 'https://new-photo.jpg'
});
```

---

### FamilyContext
**Localização**: `src/contexts/FamilyContext.js`

Gerencia estado de famílias do usuário.

#### Provider
```jsx
import { FamilyProvider } from '@/contexts/FamilyContext';

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <FamilyProvider>
        {children}
      </FamilyProvider>
    </AuthProvider>
  );
}
```

#### Hook useFamily
```jsx
import { useFamily } from '@/contexts/FamilyContext';

function MyComponent() {
  const { 
    selectedFamily,   // Família atualmente selecionada
    families,         // Array de todas as famílias
    loading,          // Estado de carregamento
    selectFamily,     // Selecionar outra família
    isAdmin,          // Verifica se é admin da família atual
    refreshFamilies,  // Recarregar famílias
    
    // Aliases para compatibilidade
    currentGroup,     // = selectedFamily
    groups,           // = families
    switchGroup,      // = selectFamily
    refreshGroups     // = refreshFamilies
  } = useFamily();
}
```

#### Métodos

**selectFamily(family)**
```javascript
const family = families[0];
selectFamily(family); // Troca para essa família
```

**isAdmin()**
```javascript
if (isAdmin()) {
  // Usuário é admin da família atual
  // Pode gerar códigos temporários, remover membros, etc.
}
```

**refreshFamilies()**
```javascript
await refreshFamilies(); // Recarrega lista de famílias
```

---

### useFamilies Hook
**Localização**: `src/hooks/useFamilies.js`

Custom hook para operações CRUD em famílias.

```jsx
import { useFamilies } from '@/hooks/useFamilies';

function MyComponent() {
  const {
    families,         // Lista de famílias
    selectedFamily,   // Família selecionada
    selectFamily,     // Selecionar família
    isAdmin,          // Verifica se é admin
    createFamily,     // Criar nova família
    joinFamily,       // Entrar com código permanente
    joinFamilyTemp,   // Entrar com código temporário
    leaveFamily,      // Sair da família
    loading,          // Estado de carregamento
    error,            // Erro se houver
    refetch           // Recarregar dados
  } = useFamilies();
}
```

#### Métodos Detalhados

**createFamily(name)**
```javascript
try {
  const newFamily = await createFamily('Família Silva');
  console.log('Família criada:', newFamily);
  // Usuário automaticamente vira admin
} catch (error) {
  console.error('Erro:', error.message);
}
```

**joinFamily(inviteCode)**
```javascript
try {
  await joinFamily('ABC123XYZ'); // Código de 9 caracteres
  console.log('Entrou na família!');
} catch (error) {
  console.error('Código inválido:', error.message);
}
```

**joinFamilyTemp(tempInviteCode)**
```javascript
try {
  await joinFamilyTemp('A1B2C3'); // Código de 6 caracteres
  console.log('Entrou na família!');
} catch (error) {
  console.error('Código expirado ou inválido:', error.message);
}
```

**leaveFamily(familyId)**
```javascript
try {
  await leaveFamily(123);
  console.log('Saiu da família');
} catch (error) {
  console.error('Erro ao sair:', error.message);
}
```

---

## 🛣 Rotas

### Públicas (Não Autenticadas)

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | `app/page.jsx` | Página inicial/login |

### Protegidas (Requerem Autenticação)

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/dashboard` | `app/dashboard/page.jsx` | Painel principal |
| `/agenda` | `app/agenda/page.jsx` | Calendário e eventos |
| `/notes` | `app/notes/page.jsx` | Anotações da família |
| `/places` | `app/places/page.jsx` | Lugares importantes |
| `/gallery` | `app/gallery/page.jsx` | Galeria de fotos |
| `/profile` | `app/profile/page.jsx` | Perfil do usuário |
| `/family/create` | `app/family/create/page.jsx` | Criar nova família |
| `/family/manage` | `app/family/manage/page.jsx` | Gerenciar família |

### Navegação Programática

```jsx
import { useRouter } from 'next/navigation';

function MyComponent() {
  const router = useRouter();
  
  // Navegar para outra página
  router.push('/dashboard');
  
  // Voltar
  router.back();
  
  // Substituir (não adiciona ao histórico)
  router.replace('/login');
}
```

---

## 👨‍👩‍👧‍👦 Sistema de Famílias

### Conceitos Principais

#### 1. Família (Family Group)
- Grupo que agrupa usuários
- Possui nome único
- Código de convite permanente (9 caracteres)
- Pode gerar códigos temporários (6 caracteres, 15 min)

#### 2. Membros (Family Members)
- Relação Many-to-Many entre User e FamilyGroup
- Cada membro tem um role: `admin` ou `member`

#### 3. Roles

**Admin**
- ✅ Criar códigos temporários
- ✅ Remover membros
- ✅ Excluir família (futuro)
- ✅ Todas as permissões de member

**Member**
- ✅ Ver dados da família
- ✅ Criar/editar/excluir próprio conteúdo
- ✅ Sair da família
- ❌ Não pode remover outros membros

### Fluxo Completo

```
1. Usuário cria família
   ├─ Vira admin automaticamente
   ├─ Recebe código permanente (ABC123XYZ)
   └─ Família é selecionada automaticamente

2. Admin compartilha código
   ├─ Opção 1: Código permanente (nunca expira)
   └─ Opção 2: Gerar código temporário (15 min)

3. Outro usuário entra
   ├─ Digita código no JoinFamilyModal
   ├─ Backend valida
   ├─ Vira member da família
   └─ Família aparece no FamilySelector

4. Usuário trabalha na família
   ├─ Cria anotações, eventos, fotos
   ├─ Todos os membros veem os dados
   └─ Dados filtrados por selectedFamily

5. Usuário troca de família
   ├─ Usa FamilySelector dropdown
   ├─ Seleciona outra família
   └─ Dados são recarregados automaticamente

6. Admin gerencia membros
   ├─ Acessa /family/manage
   ├─ Vê lista de membros
   ├─ Pode remover members
   └─ Pode gerar códigos temporários
```

### Códigos de Convite

#### Código Permanente
- **Formato**: 9 caracteres alfanuméricos (ex: `ABC123XYZ`)
- **Validade**: Nunca expira
- **Geração**: Automática ao criar família
- **Uso**: Compartilhar com familiares de confiança

#### Código Temporário
- **Formato**: 6 caracteres alfanuméricos (ex: `A1B2C3`)
- **Validade**: 15 minutos
- **Geração**: Apenas admins podem gerar
- **Uso**: Convites rápidos, situações temporárias

### API Endpoints

```javascript
// Listar famílias do usuário
GET /family-groups
Response: { familyGroups: [...] }

// Criar família (vira admin)
POST /family-groups
Body: { name: "Família Silva" }
Response: { familyGroup: {...} }

// Entrar com código permanente
POST /family-groups/join
Body: { inviteCode: "ABC123XYZ" }
Response: { message: "...", familyGroup: {...} }

// Entrar com código temporário
POST /family-groups/join-temp
Body: { tempInviteCode: "A1B2C3" }
Response: { message: "...", familyGroup: {...} }

// Gerar código temporário (admin only)
POST /family-groups/:id/temp-invite
Response: { 
  tempInviteCode: "A1B2C3",
  expiresAt: "2025-10-06T15:30:00.000Z"
}

// Remover membro (admin only)
DELETE /family-groups/:id/members/:userId
Response: { message: "..." }

// Sair da família
DELETE /family-groups/:id/leave
Response: { message: "..." }

// Obter detalhes da família
GET /family-groups/:id
Response: { familyGroup: {...} }
```

---

## 🔐 Sistema de Autenticação

### Fluxo de Login

```
1. Usuário preenche email e senha
2. Frontend envia POST /auth/login
3. Backend valida credenciais
4. Backend retorna: { token: "jwt...", user: {...} }
5. Frontend salva no localStorage
6. AuthContext atualiza estado
7. Usuário redirecionado para /dashboard
```

### Fluxo de Registro

```
1. Usuário preenche: nome, email, senha, gênero
2. Frontend envia POST /auth/register
3. Backend cria usuário
4. Backend retorna: { token: "jwt...", user: {...} }
5. Frontend salva no localStorage
6. AuthContext atualiza estado
7. Usuário redirecionado para /family/create
```

### JWT Token

**Estrutura**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Armazenamento**:
```javascript
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));
```

**Envio em Requisições**:
```javascript
const token = localStorage.getItem('token');

api.get('/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Proteção de Rotas

Todas as páginas protegidas usam o componente `ProtectedRoute`:

```jsx
export default function SecurePage() {
  return (
    <ProtectedRoute>
      <PageContent />
    </ProtectedRoute>
  );
}
```

Internamente, o `ProtectedRoute`:
1. Verifica se `useAuth().user` existe
2. Se não existe, redireciona para `/`
3. Se existe, renderiza o conteúdo

---

## 🎨 Estilização

### CSS Variables

Definidas em `src/app/globals.css`:

```css
:root {
  /* Cores Principais */
  --primary-blue: #3b82f6;
  --secondary-blue: #1e40af;
  --light-blue: #e0f2fe;
  --very-light-blue: #f0f9ff;
  
  /* Cores de Estado */
  --success: #4CAF50;
  --error: #f44336;
  --warning: #ff9800;
  --info: #2196F3;
  
  /* Gradientes */
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-success: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  
  /* Cinzas */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  
  /* Espaçamentos */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Bordas */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  
  /* Sombras */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

### Animações

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Down */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide Up */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Spin (Loading) */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Shimmer (Skeleton) */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}
```

### Classes Utilitárias

```css
/* Loading Spinner */
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--gray-200);
  border-top-color: var(--primary-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Skeleton Loading */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--gray-200) 25%,
    var(--gray-300) 50%,
    var(--gray-200) 75%
  );
  background-size: 2000px 100%;
  animation: shimmer 2s infinite;
  border-radius: var(--radius-md);
}

/* Tooltips */
[data-tooltip] {
  position: relative;
  cursor: pointer;
}

[data-tooltip]::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--gray-900);
  color: white;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

[data-tooltip]:hover::before {
  opacity: 1;
}
```

### CSS Modules

Cada componente tem seu próprio arquivo `.module.css`:

```jsx
// Component.jsx
import styles from './Component.module.css';

export default function Component() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Título</h1>
    </div>
  );
}
```

```css
/* Component.module.css */
.container {
  padding: var(--spacing-lg);
}

.title {
  font-size: 2rem;
  color: var(--primary-blue);
}
```

### Scrollbar Customizada

```css
/* Webkit (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--gray-100);
}

::-webkit-scrollbar-thumb {
  background: var(--gray-400);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--gray-500);
}
```

### Responsividade

```css
/* Mobile First */
.container {
  padding: 16px;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
  }
}

/* Large Desktop */
@media (min-width: 1280px) {
  .container {
    padding: 40px;
  }
}
```

---

## 🔌 API Integration

### Configuração Base

**Arquivo**: `src/services/api.js`

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

### Uso em Componentes

```javascript
import api from '@/services/api';

async function fetchData() {
  try {
    const token = localStorage.getItem('token');
    
    const response = await api.get('/endpoint', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Data:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data?.message);
  }
}
```

### Principais Endpoints

#### Autenticação
```javascript
// Login
POST /auth/login
Body: { email, password }
Response: { token, user }

// Registro
POST /auth/register
Body: { name, email, password, gender, photoUrl? }
Response: { token, user }
```

#### Famílias
```javascript
// Listar famílias
GET /family-groups
Headers: { Authorization: Bearer token }
Response: { familyGroups: [...] }

// Criar família
POST /family-groups
Body: { name }
Response: { familyGroup: {...} }

// Entrar em família
POST /family-groups/join
Body: { inviteCode }
Response: { familyGroup: {...} }

// Código temporário
POST /family-groups/join-temp
Body: { tempInviteCode }
Response: { familyGroup: {...} }

// Gerar código temp
POST /family-groups/:id/temp-invite
Response: { tempInviteCode, expiresAt }

// Remover membro
DELETE /family-groups/:id/members/:userId
Response: { message }

// Sair da família
DELETE /family-groups/:id/leave
Response: { message }
```

#### Dashboard
```javascript
// Resumo
GET /dashboard/group/:familyId
Response: { summary: {...} }

// Agenda de hoje
GET /dashboard/group/:familyId/today
Response: { today: {...} }

// Estatísticas
GET /dashboard/group/:familyId/stats
Response: { stats: {...} }
```

#### Anotações
```javascript
// Listar notas
GET /notes/group/:familyId
Response: { notes: [...] }

// Criar nota
POST /notes
Body: { title, content, priority, category, familyGroupId }
Response: { note: {...} }

// Atualizar nota
PUT /notes/:id
Body: { title, content, priority, category }
Response: { note: {...} }

// Deletar nota
DELETE /notes/:id
Response: { message }
```

#### Eventos
```javascript
// Próximos compromissos
GET /appointments/group/:familyId/upcoming
Response: { appointments: [...] }

// Próximos eventos
GET /events/group/:familyId/upcoming
Response: { events: [...] }
```

#### Fotos
```javascript
// Fotos recentes
GET /photos/group/:familyId/recent
Response: { photos: [...] }
```

#### Perfil
```javascript
// Atualizar perfil
PUT /users/profile
Body: FormData (multipart/form-data)
  - name
  - email
  - gender
  - photo (file)
  - currentPassword?
  - newPassword?
Response: { user: {...} }
```

---

## 💻 Guia de Desenvolvimento

### Criando Uma Nova Página

1. **Criar estrutura de arquivos**
```bash
mkdir src/app/minha-pagina
touch src/app/minha-pagina/page.jsx
touch src/app/minha-pagina/page.module.css
```

2. **Implementar componente**
```jsx
// src/app/minha-pagina/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useFamily } from '@/contexts/FamilyContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/services/api';
import styles from './page.module.css';

function MinhaPaginaContent() {
  const { user } = useAuth();
  const { selectedFamily } = useFamily();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedFamily) {
      fetchData();
    }
  }, [selectedFamily]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await api.get(
        `/endpoint/group/${selectedFamily.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setData(response.data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner" />;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/dashboard">← Voltar</Link>
        <h1>Minha Página</h1>
      </header>

      <main className={styles.main}>
        {/* Seu conteúdo aqui */}
      </main>
    </div>
  );
}

export default function MinhaPagina() {
  return (
    <ProtectedRoute>
      <MinhaPaginaContent />
    </ProtectedRoute>
  );
}
```

3. **Estilizar**
```css
/* src/app/minha-pagina/page.module.css */
.container {
  min-height: 100vh;
  background: var(--gray-50);
}

.header {
  background: white;
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}
```

### Criando Um Novo Componente

1. **Criar arquivos**
```bash
touch src/components/MeuComponente.jsx
touch src/components/MeuComponente.module.css
```

2. **Implementar**
```jsx
// src/components/MeuComponente.jsx
import styles from './MeuComponente.module.css';

export default function MeuComponente({ title, onAction }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <button 
        className={styles.button}
        onClick={onAction}
      >
        Ação
      </button>
    </div>
  );
}
```

3. **Usar em uma página**
```jsx
import MeuComponente from '@/components/MeuComponente';

function MinhaPage() {
  return (
    <MeuComponente 
      title="Título" 
      onAction={() => console.log('Clicado!')}
    />
  );
}
```

### Criando Um Custom Hook

1. **Criar arquivo**
```bash
touch src/hooks/useMinhaFuncionalidade.js
```

2. **Implementar**
```javascript
// src/hooks/useMinhaFuncionalidade.js
import { useState, useEffect } from 'react';
import api from '@/services/api';

export function useMinhaFuncionalidade(familyId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (familyId) {
      fetchData();
    }
  }, [familyId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await api.get(
        `/endpoint/${familyId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (item) => {
    const token = localStorage.getItem('token');
    
    const response = await api.post(
      '/endpoint',
      item,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    await fetchData(); // Recarregar
    return response.data;
  };

  return {
    data,
    loading,
    error,
    createItem,
    refetch: fetchData
  };
}
```

3. **Usar**
```jsx
import { useMinhaFuncionalidade } from '@/hooks/useMinhaFuncionalidade';

function MyComponent() {
  const { data, loading, createItem } = useMinhaFuncionalidade(familyId);

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      <button onClick={() => createItem({ name: 'Novo' })}>
        Adicionar
      </button>
    </div>
  );
}
```

### Boas Práticas

✅ **Faça**:
- Use TypeScript se possível (ou JSDoc)
- Separe lógica em custom hooks
- Use CSS Modules para evitar conflitos
- Valide props com PropTypes ou TypeScript
- Trate erros adequadamente
- Use loading states
- Implemente skeleton loaders
- Adicione aria-labels para acessibilidade
- Use semantic HTML
- Teste em diferentes tamanhos de tela

❌ **Evite**:
- Estilos inline (exceto dinâmicos)
- Lógica complexa em componentes
- Requisições sem tratamento de erro
- Hardcode de valores
- Deixar console.logs em produção
- Props drilling excessivo
- Componentes gigantes (> 300 linhas)
- Manipulação direta do DOM
- Usar índices como keys em listas dinâmicas

---

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Erro: "Cannot read property 'name' of null"
**Causa**: Tentando acessar propriedades de `user` antes dele estar carregado.

**Solução**:
```jsx
const { user, loading } = useAuth();

if (loading) {
  return <div>Carregando...</div>;
}

if (!user) {
  return <div>Usuário não autenticado</div>;
}

return <div>Olá, {user.name}</div>;
```

#### 2. Erro: "Network Error" ou "timeout"
**Causa**: Backend não está rodando ou URL incorreta.

**Solução**:
1. Verifique se backend está rodando na porta 4000
2. Confirme URL em `src/services/api.js`:
```javascript
baseURL: 'http://localhost:4000'
```

#### 3. Erro: "401 Unauthorized"
**Causa**: Token expirado ou inválido.

**Solução**:
1. Fazer logout e login novamente
2. Verificar se token está sendo enviado:
```javascript
const token = localStorage.getItem('token');
console.log('Token:', token);
```

#### 4. Página não protegida redireciona para login
**Causa**: Faltou envolver com `ProtectedRoute`.

**Solução**:
```jsx
export default function MinhaPage() {
  return (
    <ProtectedRoute>
      <MinhaPageContent />
    </ProtectedRoute>
  );
}
```

#### 5. Família não carrega / selectedFamily é null
**Causa**: Usuário não pertence a nenhuma família.

**Solução**:
1. Verificar se usuário criou ou entrou em alguma família
2. Redirecionar para `/family/create`:
```jsx
useEffect(() => {
  if (!loading && families.length === 0) {
    router.push('/family/create');
  }
}, [families, loading]);
```

#### 6. CSS não aplica / classes não funcionam
**Causa**: CSS Module não importado corretamente.

**Solução**:
```jsx
// ✅ Correto
import styles from './Component.module.css';
<div className={styles.container}>

// ❌ Errado
import './Component.module.css';
<div className="container">
```

#### 7. Erro: "Hydration failed"
**Causa**: Diferença entre renderização server e client.

**Solução**:
- Use `'use client'` no topo do arquivo
- Evite usar `window` ou `localStorage` fora de `useEffect`
```jsx
'use client';

const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;
```

#### 8. Build falha com "Module not found"
**Causa**: Caminho de importação incorreto.

**Solução**:
- Use o alias `@/` configurado em `jsconfig.json`:
```javascript
// ✅ Correto
import Component from '@/components/Component';

// ❌ Errado
import Component from '../../components/Component';
```

#### 9. localStorage não persiste entre reloads
**Causa**: Navegador em modo privado ou localStorage desabilitado.

**Solução**:
- Verificar se está em modo normal
- Adicionar fallback:
```javascript
try {
  localStorage.setItem('key', 'value');
} catch (error) {
  console.warn('localStorage não disponível');
  // Usar memória ou cookies
}
```

#### 10. Performance ruim / página lenta
**Causas**:
- Muitas re-renderizações
- Requisições não otimizadas
- Imagens grandes

**Soluções**:
- Use `React.memo` em componentes pesados
- Use `useMemo` e `useCallback`
- Implemente pagination/infinite scroll
- Otimize imagens com Next.js Image:
```jsx
import Image from 'next/image';

<Image 
  src="/photo.jpg"
  width={500}
  height={300}
  alt="Descrição"
/>
```

---

## 📞 Suporte

### Documentação Adicional
- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação React](https://react.dev/)
- [Documentação Axios](https://axios-http.com/docs/intro)

### Contato
- **GitHub**: [pablodelgado26](https://github.com/pablodelgado26)
- **Repositório**: [frontEnd-Family-organizer](https://github.com/pablodelgado26/frontEnd-Family-organizer)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🙏 Agradecimentos

- Equipe Next.js pela excelente framework
- Comunidade React pelo suporte
- Todos os contribuidores do projeto

---

**Desenvolvido com ❤️ por Pablo Delgado**

*Última atualização: 06 de outubro de 2025*
