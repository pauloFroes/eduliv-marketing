# Padrões de Nomenclatura

Este documento define as regras para nomenclatura de arquivos, identificadores e estrutura de imports no projeto.

## 📋 Índice

1. [Arquivos](#arquivos)
2. [Identificadores](#identificadores)
3. [Estrutura de Testes](#estrutura-de-testes)
4. [Imports](#imports)
5. [Checklist](#checklist)

---

## 📁 Arquivos

### Sufixos Obrigatórios

**Sempre adicione sufixo descritivo para evitar conflitos:**

```
❌ Antes                    ✅ Depois
service.ts → auth.service.ts
config.ts → app.config.ts
cookie.ts → cookie.helper.ts
text.ts → text.helper.ts
core.types.ts → common.types.ts
```

**Regra:** Arquivos que podem ter conflitos de nome devem ter sufixo descritivo.

### Padrões por Tipo

**Serviços:**

```
services/auth/auth.service.ts
services/auth/auth.service.test.ts
services/auth/auth.service.types.ts
services/auth/auth.service.schema.ts
services/user/user.service.ts
services/user/user.service.test.ts
services/user/user.service.types.ts
services/user/user.service.schema.ts
```

**Helpers:**

```
helpers/cookie/cookie.helper.ts
helpers/cookie/cookie.helper.test.ts
helpers/crypt/crypt.helper.ts
helpers/crypt/crypt.helper.test.ts
helpers/jwt/jwt.helper.ts
helpers/jwt/jwt.helper.test.ts
helpers/text/text.helper.ts
helpers/text/text.helper.test.ts
helpers/toast/toast.helper.ts
helpers/toast/toast.helper.test.ts
```

**Configurações:**

```
config/app/app.config.ts
config/cn/cn.config.ts
config/db/db.config.ts
```

**Tipos:**

```
types/common.types.ts
types/index.ts
```

**Componentes:**

```
components/form-input.component.tsx
components/auth/login.form.tsx
components/ui/button.tsx
components/wrapper/button.wrapper.tsx
components/wrapper/notification.wrapper.tsx
```

---

## 🏷️ Identificadores

### Funções de Serviço

**Use verbos descritivos e específicos:**

```ts
// ❌ Verbos genéricos
export const serviceAuthLogin = async (params: AuthLogin)
export const serviceUserCreate = async (params: UserCreate)

// ✅ Verbos descritivos e específicos
export const authenticateUser = async (credentials: AuthLogin)
export const createUser = async (userData: UserCreate)
export const logoutUser = async ()
export const verifyUserToken = async ()
```

### Funções Helper

**Use verbos de ação:**

```ts
// ❌ Prefixos genéricos
export const cookieSet = async (params: Cookie)
export const cryptHash = async (password: string)

// ✅ Verbos de ação
export const setCookie = async (params: Cookie)
export const hashPassword = async (password: string)
export const getFirstName = (name: string)
export const capitalizeText = (text: string)
```

### Configurações

**Use nomes específicos:**

```ts
// ❌ Nome genérico
export const config: AppConfig = { ... }

// ✅ Nome específico
export const appConfig: AppConfig = { ... }
```

### Tipos

**Use nomes semânticos e específicos:**

```ts
// ❌ Nomes genéricos
export type ErrorType = 'invalidCredentials' | 'alreadyExists'
export type ResponsePromise<T = undefined>

// ✅ Nomes específicos
export type ApiError = 'invalidCredentials' | 'alreadyExists'
export type ApiResponse<T = undefined>
```

---

## 🧪 Estrutura de Testes

### Padrão de Nomenclatura

**Nome do arquivo deve refletir o arquivo testado:**

```
❌ Antes                    ✅ Depois
user.test.ts → user.service.test.ts
test.ts → cookie.helper.test.ts
```

**Regra:** `[arquivo-testado].[tipo].test.ts`

### Exemplos

```
services/user/user.service.test.ts
helpers/cookie/cookie.helper.test.ts
components/auth/login.form.test.tsx
```

---

## 📥 Imports

### Use Barrel Files

**Sempre use barrel files quando disponíveis:**

```ts
// ❌ Imports verbosos
import { setCookie } from '@/helpers/cookie/cookie.helper'
import { authenticateUser } from '@/services/auth/auth.service'

// ✅ Imports limpos
import { setCookie } from '@/helpers/cookie'
import { authenticateUser } from '@/services/auth'
```

### Padrão de Import

**Ordem de imports:**

```ts
// 1. React/Next.js
import { useRouter } from 'next/navigation'

// 2. Bibliotecas externas
import { zodResolver } from '@hookform/resolvers/zod'

// 3. Imports internos (barrel files primeiro)
import { setCookie } from '@/helpers/cookie'
import { authenticateUser } from '@/services/auth'

// 4. Imports relativos
import { AuthLogin } from './auth.service.types'
```

---

## ✅ Checklist

### Antes de Commitar

- [ ] Arquivos têm sufixo descritivo para evitar conflitos?
- [ ] Funções usam verbos de ação específicos?
- [ ] Configurações têm nomes descritivos?
- [ ] Tipos têm nomes semânticos e específicos?
- [ ] Testes refletem o arquivo testado?
- [ ] Imports usam barrel files quando disponíveis?
- [ ] Imports seguem a ordem correta?

### Para Novos Arquivos

- [ ] Nome do arquivo segue o padrão de sufixo?
- [ ] Identificadores são descritivos?
- [ ] Barrel file foi atualizado?
- [ ] Teste foi criado com nomenclatura correta?

### Padrões Específicos por Diretório

#### Services (`src/services/`)

- Arquivos principais: `[nome].service.ts`
- Testes: `[nome].service.test.ts`
- Tipos: `[nome].service.types.ts`
- Schemas: `[nome].service.schema.ts`
- Barrel file: `index.ts`

#### Helpers (`src/helpers/`)

- Arquivos principais: `[nome].helper.ts`
- Testes: `[nome].helper.test.ts`
- Barrel file: `index.ts`

#### Config (`src/config/`)

- Arquivos principais: `[nome].config.ts`
- Barrel file: `index.ts`

#### Types (`src/types/`)

- Arquivos principais: `[nome].types.ts`
- Barrel file: `index.ts`

#### Components (`src/components/`)

- Componentes: `[nome].component.tsx` ou `[nome].form.tsx` ou `[nome].wrapper.tsx`
- Testes: `[nome].component.test.tsx` ou `[nome].form.test.tsx` ou `[nome].wrapper.test.tsx`
