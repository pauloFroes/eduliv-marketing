# Padrões de Testes

Este documento define as regras para escrita de testes, cobertura e organização no projeto.

## 📋 Índice

1. [Estrutura de Testes](#estrutura-de-testes)
2. [Padrão AAA](#padrão-aaa)
3. [Descrições de Testes](#descrições-de-testes)
4. [Cobertura de Cenários](#cobertura-de-cenários)
5. [Organização por Cenários](#organização-por-cenários)
6. [Variáveis Descritivas](#variáveis-descritivas)
7. [Assertions Específicas](#assertions-específicas)
8. [Checklist](#checklist)

---

## 🧪 Estrutura de Testes

### Nomenclatura de Arquivos

**Siga o padrão: `[arquivo-testado].[tipo].test.ts`**

```
❌ Antes                    ✅ Depois
user.test.ts → user.service.test.ts
test.ts → cookie.helper.test.ts
auth.test.ts → auth.service.test.ts
```

### Estrutura Hierárquica

**Use `describe` blocks para organizar cenários:**

```ts
describe('Nome do Helper/Serviço', () => {
  describe('nomeDaFunção', () => {
    describe('quando [condição específica]', () => {
      it('deve [comportamento esperado] quando [variação de entrada]', () => {
        // teste
      })
    })
  })
})
```

---

## 🎯 Padrão AAA

### Arrange - Act - Assert

**Sempre use comentários para separar as seções:**

```ts
it('deve retornar o primeiro nome quando receber nome completo', () => {
  // Arrange
  const fullName = 'João Silva Santos'

  // Act
  const result = getFirstName(fullName)

  // Assert
  expect(result).toBe('João')
})
```

### Regras do AAA

**Arrange:**

- ✅ Declare todas as variáveis de entrada
- ✅ Configure mocks quando necessário
- ✅ Use nomes descritivos para variáveis

**Act:**

- ✅ Execute apenas a função sendo testada
- ✅ Armazene o resultado em uma variável se necessário

**Assert:**

- ✅ Verifique o resultado esperado
- ✅ Use assertions específicas
- ✅ Verifique comportamentos colaterais quando relevante

---

## 📝 Descrições de Testes

### Padrão de Descrição

**Use o formato: `deve [comportamento esperado] quando [condição/entrada]`**

```ts
// ✅ Descrições claras e específicas
it('deve retornar o primeiro nome quando receber nome completo', () => {})
it('deve mostrar toast de sucesso quando promise resolve com success: true', () => {})
it('deve executar actionOnSuccess quando fornecido e promise resolve com success: true', () => {})
it('deve mostrar erro padrão quando errorMap não contém o erro específico', () => {})
it('deve não executar actionOnSuccess quando promise resolve com success: false', () => {})
```

### ❌ Evite

```ts
// ❌ Descrições vagas
it('should work', () => {})
it('testes o comportamento', () => {})
it('funciona corretamente', () => {})
```

---

## 🎯 Cobertura de Cenários

### Cenários Obrigatórios

**Para cada função, teste:**

1. **Cenário de sucesso principal**
2. **Cenários de erro/edge cases**
3. **Variações de entrada**
4. **Comportamentos colaterais**
5. **Valores limites**

### Exemplo de Cobertura Completa

```ts
describe('getFirstName', () => {
  describe('quando receber nome válido', () => {
    it('deve retornar o primeiro nome quando receber nome completo', () => {})
    it('deve retornar o nome recebido quando há apenas um nome', () => {})
  })

  describe('quando receber entrada inválida', () => {
    it('deve retornar string vazia quando receber nome vazio', () => {})
    it('deve retornar string vazia quando receber nome nulo', () => {})
    it('deve retornar string vazia quando receber nome undefined', () => {})
  })

  describe('quando receber entrada com formatação', () => {
    it('deve retornar o primeiro nome sem espaços extras quando receber nome com espaços extras no início', () => {})
    it('deve retornar o primeiro nome sem espaços extras quando receber nome com espaços extras no final', () => {})
    it('deve retornar o primeiro nome sem espaços extras quando receber nome com múltiplos espaços entre palavras', () => {})
  })
})
```

---

## 📁 Organização por Cenários

### Use `describe` para Agrupar Cenários Relacionados

```ts
describe('toastPromise', () => {
  describe('quando a promise resolve com success: true', () => {
    // testes de sucesso
  })

  describe('quando a promise resolve com success: false', () => {
    // testes de erro
  })

  describe('quando a promise rejeita', () => {
    // testes de rejeição
  })

  describe('mapeamento de erros', () => {
    // testes específicos de mapeamento
  })

  describe('comportamento do actionOnSuccess', () => {
    // testes do callback
  })
})
```

### Benefícios da Organização

- ✅ Facilita encontrar testes específicos
- ✅ Agrupa cenários relacionados
- ✅ Melhora a legibilidade
- ✅ Facilita manutenção

---

## 🏷️ Variáveis Descritivas

### Use Nomes Específicos e Descritivos

```ts
// ❌ Nomes genéricos
const promise = Promise.resolve({ success: true })
const message = 'Carregando...'

// ✅ Nomes descritivos
const mockPromise = Promise.resolve({ success: true } as ApiResponse)
const loadingMessage = 'Carregando dados...'
const successMessage = 'Dados carregados com sucesso!'
const errorMap = { validationError: 'Erro de validação encontrado' }
```

### Padrões de Nomenclatura

**Para mocks:**

```ts
const mockPromise = Promise.resolve(...)
const mockActionOnSuccess = vi.fn()
const mockApiResponse = { success: true }
```

**Para mensagens:**

```ts
const loadingMessage = 'Processando...'
const successMessage = 'Processado com sucesso!'
const errorMessage = 'Erro de validação'
```

**Para configurações:**

```ts
const errorMap = { validationError: 'Erro de validação' }
const partialErrorMap = { validationError: 'Erro de validação' }
```

---

## ✅ Assertions Específicas

### Use Assertions Detalhadas

```ts
// ❌ Assertions genéricas
expect(result).toBeTruthy()
expect(mockFunction).toHaveBeenCalled()

// ✅ Assertions específicas
expect(result).toBe('João')
expect(mockFunction).toHaveBeenCalledTimes(1)
expect(mockFunction).toHaveBeenCalledWith('specific-param')
expect(mockFunction).not.toHaveBeenCalled()
```

### Padrões de Assertion

**Para resultados:**

```ts
expect(result).toBe(expectedValue)
expect(result).toEqual(expectedObject)
expect(result).toContain(expectedItem)
```

**Para mocks:**

```ts
expect(mockFunction).toHaveBeenCalled()
expect(mockFunction).toHaveBeenCalledTimes(1)
expect(mockFunction).toHaveBeenCalledWith(expectedParams)
expect(mockFunction).not.toHaveBeenCalled()
```

**Para verificações negativas:**

```ts
expect(toast.error).not.toHaveBeenCalled()
expect(mockActionOnSuccess).not.toHaveBeenCalled()
```

---

## 🧪 Cobertura de Testes Específica

### Para Funções Helper

**Teste todas as variações de entrada:**

```ts
describe('capitalizeText', () => {
  describe('quando receber texto válido', () => {
    it('deve retornar a primeira letra de cada palavra em maiúsculo quando receber texto simples', () => {})
    it('deve retornar a primeira letra de cada palavra em maiúsculo quando receber texto já capitalizado', () => {})
    it('deve retornar a primeira letra de cada palavra em maiúsculo quando receber texto todo em maiúsculo', () => {})
  })

  describe('quando receber entrada inválida', () => {
    it('deve retornar string vazia quando receber texto vazio', () => {})
    it('deve retornar string vazia quando receber texto nulo', () => {})
    it('deve retornar string vazia quando receber texto undefined', () => {})
  })

  describe('quando receber texto com formatação', () => {
    it('deve retornar a primeira letra de cada palavra em maiúsculo quando receber texto com espaços extras no início', () => {})
    it('deve retornar a primeira letra de cada palavra em maiúsculo quando receber texto com espaços extras no final', () => {})
    it('deve retornar a primeira letra de cada palavra em maiúsculo quando receber texto com múltiplos espaços entre palavras', () => {})
  })
})
```

### Para Funções de Serviço

**Teste todos os cenários de resposta da API:**

```ts
describe('toastPromise', () => {
  describe('quando a promise resolve com success: true', () => {
    it('deve mostrar toast de loading e depois toast de sucesso', () => {})
    it('deve executar actionOnSuccess quando fornecido e promise resolve com success: true', () => {})
  })

  describe('quando a promise resolve com success: false', () => {
    it('deve mostrar toast de loading e depois toast de erro com mensagem do errorMap', () => {})
    it('deve mostrar erro padrão quando errorMap não contém o erro específico', () => {})
    it('deve mostrar erro padrão quando errorMap não é fornecido', () => {})
    it('deve mostrar erro padrão quando error é undefined', () => {})
    it('deve mostrar erro padrão quando resultado não possui propriedade success', () => {})
    it('deve não executar actionOnSuccess quando promise resolve com success: false', () => {})
  })

  describe('quando a promise rejeita', () => {
    it('deve mostrar toast de loading e depois toast de erro padrão', () => {})
    it('deve mostrar toast de loading e depois toast de erro padrão quando rejeita com string', () => {})
    it('deve mostrar toast de loading e depois toast de erro padrão quando rejeita sem parâmetros', () => {})
    it('deve não executar actionOnSuccess quando promise rejeita', () => {})
  })
})
```

---

## ✅ Checklist

### Antes de Escrever Testes

- [ ] Entendi completamente o comportamento da função?
- [ ] Identifiquei todos os cenários possíveis?
- [ ] Identifiquei todas as variações de entrada?
- [ ] Identifiquei todos os comportamentos colaterais?

### Durante a Escrita

- [ ] Descrição do teste é clara e específica?
- [ ] Variáveis têm nomes descritivos?
- [ ] Segui o padrão AAA com comentários?
- [ ] Assertions são específicas e detalhadas?
- [ ] Teste cobre apenas um cenário específico?

### Para Cobertura Completa

- [ ] Testei o cenário de sucesso principal?
- [ ] Testei todos os cenários de erro?
- [ ] Testei variações de entrada?
- [ ] Testei valores limites?
- [ ] Testei comportamentos colaterais?
- [ ] Testei casos edge (nulo, undefined, vazio)?

### Organização

- [ ] Testes estão organizados em `describe` blocks?
- [ ] Cenários relacionados estão agrupados?
- [ ] Estrutura hierárquica faz sentido?
- [ ] Fácil de encontrar testes específicos?

### Qualidade

- [ ] Cada teste é independente?
- [ ] Testes não têm dependências entre si?
- [ ] Mocks são limpos entre testes?
- [ ] Assertions verificam o comportamento correto?
- [ ] Testes são determinísticos?

---

## 📚 Exemplos de Referência

### Helper Function

```ts
describe('Text Helpers', () => {
  describe('getFirstName', () => {
    it('deve retornar o primeiro nome de um nome completo', () => {
      // Arrange
      const fullName = 'João Silva Santos'

      // Act
      const result = getFirstName(fullName)

      // Assert
      expect(result).toBe('João')
    })

    it('deve retornar string vazia quando receber nome vazio ou nulo', () => {
      // Arrange
      const emptyName = ''

      // Act
      const result = getFirstName(emptyName)

      // Assert
      expect(result).toBe('')
    })
  })
})
```

### Service Function

```ts
describe('Toast Helpers', () => {
  describe('toastPromise', () => {
    describe('quando a promise resolve com success: true', () => {
      it('deve mostrar toast de loading e depois toast de sucesso', async () => {
        // Arrange
        const mockPromise = Promise.resolve({ success: true } as ApiResponse)
        const loadingMessage = 'Carregando dados...'
        const successMessage = 'Dados carregados com sucesso!'

        // Act
        await toastPromise({
          promise: mockPromise,
          loading: loadingMessage,
          success: successMessage,
        })

        // Assert
        expect(toast.loading).toHaveBeenCalledWith(loadingMessage)
        expect(toast.success).toHaveBeenCalledWith(successMessage, { id: 'toast-id' })
        expect(toast.error).not.toHaveBeenCalled()
      })
    })
  })
})
```
