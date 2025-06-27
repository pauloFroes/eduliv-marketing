# Padrão de Tipos e Exports

Este documento define as regras para organização de tipos TypeScript e padrões de export no projeto.

## 📋 Índice

1. [Tipos vs Interfaces](#tipos-vs-interfaces)
2. [Onde Declarar Tipos](#onde-declarar-tipos)
3. [Padrão de Exports](#padrão-de-exports)
4. [Barrel Files](#barrel-files)
5. [Checklist](#checklist)

---

## 🎯 Tipos vs Interfaces

### Regra Geral: Use `type` por padrão

**Use `type` para:**

- ✅ Union types e intersection types
- ✅ Tipos inferidos de Zod (`z.infer<typeof schema>`)
- ✅ Tipos utilitários (`Pick`, `Omit`, `Partial`, etc.)
- ✅ Tipos de configuração e constantes
- ✅ Tipos de contexto React
- ✅ Tipos simples de dados
- ✅ Parâmetros de funções
- ✅ Retornos de funções

**Use `interface` apenas para:**

- ✅ Props de componentes React
- ✅ APIs públicas que podem ser estendidas

### Exemplos

```ts
// ✅ Union type
export type ApiError = 'invalidCredentials' | 'alreadyExists' | 'validationError'

// ✅ Tipo inferido de Zod
export type UserCreate = z.infer<typeof schemaUserCreate>

// ✅ Props de componente React
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
}

// ✅ Tipo de configuração
export type AuthConfig = {
  tokenCookieName: string
  jwtSecret: string
}
```

### ❌ Evite

```ts
// ❌ Interface para union types
interface ApiError = 'invalidCredentials' | 'alreadyExists'

// ❌ Interface para tipos inferidos de Zod
interface UserCreate = z.infer<typeof schemaUserCreate>

// ❌ Misturar padrões no mesmo arquivo
interface Config { ... }
type OtherConfig = { ... }
```

---

## 📁 Onde Declarar Tipos

### 1. Exclusivos de um arquivo

Declare no topo do próprio arquivo.

```ts
// ✅ Tipo usado apenas neste arquivo
type JwtPayload = {
  userId: string
  iat: number
  exp: number
}

export const verifyJwt = (token: string): JwtPayload | null => {
  // ...
}
```

### 2. Compartilhados dentro do domínio

Crie um arquivo `meu-dominio.types.ts` (use o nome da pasta como prefixo).

```
helpers/
  cookie/
    cookie.types.ts      // ✅ usa o nome da pasta
  jwt/
    jwt.helper.ts        // ✅ tipos internos ficam no arquivo principal
services/
  auth/
    auth.types.ts
  user/
    user.types.ts
```

### 3. Compartilhados globalmente

Adicione ao barrel `src/types/` (importe como `@/types`).

```ts
// src/types/index.ts
export * from './common.types'
export * from '../services/user/user.types'
```

```ts
// Importação
import { ApiError } from '@/types'
```

### ⚠️ Regra Importante: Não Exporte Tipos Desnecessários

**Só exporte tipos quando:**

- ✅ São usados por outros domínios
- ✅ Fazem parte da API pública do domínio
- ✅ Precisam ser compartilhados

**NÃO exporte tipos quando:**

- ❌ São usados apenas internamente
- ❌ São detalhes de implementação
- ❌ Não fazem parte da API pública

```ts
// ✅ Correto - tipo usado apenas internamente
type JwtPayload = {
  userId: string
}

// ❌ Incorreto - export desnecessário
export type JwtPayload = {
  userId: string
}
```

---

## 📤 Padrão de Exports

### Regra Geral: Export Inline + Barrel Files

**Use export inline para:**

- ✅ Funções e constantes
- ✅ Tipos e interfaces
- ✅ Schemas Zod

```ts
// ✅ Export inline
export const setCookie = async (params: Cookie): Promise<void> => {
  // ...
}

export type Cookie = {
  name: string
  value?: string
}

export const schemaUserCreate = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})
```

---

## 📦 Barrel Files

### Quando Criar

**Crie barrel files (index.ts) para:**

- ✅ Domínios que exportam múltiplos itens
- ✅ Facilitar imports e organização

**NÃO crie barrel files para:**

- ❌ Arquivos únicos (apenas um export)
- ❌ Componentes React (mantenha import direto)
- ❌ Configurações globais

### Estrutura

```
helpers/
  cookie/
    index.ts           // ✅ Barrel file
    cookie.helper.ts   // ✅ Implementação
```

### Exemplo de Barrel File

```ts
// src/helpers/cookie/index.ts
export { setCookie, deleteCookie, getCookie } from './cookie.helper'
export type { Cookie } from './cookie.types'
```

### Importação

```ts
// ✅ Import limpo via barrel file
import { setCookie, deleteCookie, getCookie, Cookie } from '@/helpers/cookie'
```

---

## ✅ Checklist

### Antes de Commitar

- [ ] Tipos usam `type` por padrão?
- [ ] Interfaces são usadas apenas para props React?
- [ ] Tipos estão no local correto (arquivo, domínio ou global)?
- [ ] Exports são inline quando apropriado?
- [ ] Barrel files existem para domínios com múltiplos exports?
- [ ] Tipos desnecessários não são exportados?

### Para Novos Tipos

- [ ] Tipo está no local correto?
- [ ] Nome é semântico e descritivo?
- [ ] Export é necessário?
- [ ] Barrel file foi atualizado?
