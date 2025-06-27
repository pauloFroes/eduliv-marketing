#!/usr/bin/env node

/**
 * Script para verificar nomes de arquivos conforme as convenções do projeto
 * Baseado em doc/naming-conventions.md
 */

const fs = require('fs')
const path = require('path')

// Configurações
const CONFIG = {
  // Diretórios para verificar
  directories: ['src', 'prisma', 'public', 'config'],

  // Diretórios para ignorar
  ignoreDirectories: ['node_modules', '.next', 'dist', 'build', 'coverage', 'prisma/generated', 'src/generated'],

  // Arquivos para ignorar
  ignoreFiles: [
    '.gitignore',
    '.env',
    '.env.local',
    '.env.example',
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'next.config.ts',
    'vitest.config.ts',
    'postcss.config.mjs',
    'tailwind.config.js',
    'eslint.config.mjs',
    'docker-compose.yml',
    'init.sql',
    'README.md',
    'components.json',
  ],

  // Padrões de sufixos obrigatórios
  requiredSuffixes: {
    // Serviços
    services: '.service.ts',
    // Helpers
    helpers: '.helper.ts',
    // Configurações
    config: '.config.ts',
    // Tipos
    types: '.types.ts',
    // Testes
    test: '.test.ts',
    // Componentes
    form: '.form.tsx',
    wrapper: '.wrapper.tsx',
    tooltip: '.tooltip.tsx',
    component: '.component.tsx',
  },

  // Arquivos que devem ter sufixo específico baseado no diretório
  directorySuffixes: {
    'src/services': '.service.ts',
    'src/helpers': '.helper.ts',
    'src/config': '.config.ts',
    'src/types': '.types.ts',
  },

  // Arquivos especiais permitidos em cada diretório
  allowedSpecialFiles: {
    'src/services': ['.service.ts', '.service.test.ts', '.service.types.ts', '.service.schema.ts', 'index.ts'],
    'src/helpers': ['.helper.ts', '.helper.test.ts', 'index.ts'],
    'src/config': ['.config.ts', 'index.ts'],
    'src/types': ['.types.ts', 'index.ts'],
  },

  // Padrões de nomenclatura permitidos
  allowedPatterns: [
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/, // kebab-case
    /^[a-z][a-zA-Z0-9]*$/, // camelCase
    /^[A-Z][a-zA-Z0-9]*$/, // PascalCase
  ],

  // Padrões específicos para componentes
  componentPatterns: [
    /^[a-z0-9]+(?:-[a-z0-9]+)*\.component\.(ts|tsx)$/, // form-input.component.tsx
    /^[a-z0-9]+(?:-[a-z0-9]+)*\.form\.(ts|tsx)$/, // login.form.tsx
    /^[a-z0-9]+(?:-[a-z0-9]+)*\.wrapper\.(ts|tsx)$/, // button.wrapper.tsx
  ],

  // Exceções especiais
  exceptions: [
    'index.ts',
    'index.tsx',
    'layout.tsx',
    'page.tsx',
    'globals.css',
    'favicon.ico',
    'migration.sql',
    'migration_lock.toml',
    'schema.prisma',
    'seed.ts',
    'test.ts',
    'test.tsx',
    'setup.ts',
    'test.setup.ts',
    'service.types.ts',
    'services.schema.ts',
  ],

  // Padrões de nomes com pontos permitidos (como cookie.helper.ts, auth.service.ts)
  dotPatterns: [
    /^[a-z]+\.[a-z]+\.(ts|tsx|js|jsx)$/, // cookie.helper.ts, auth.service.ts
    /^[a-z]+\.[a-z]+\.(types|service|helper|config)\.(ts|tsx)$/, // auth.service.types.ts
    /^[a-z]+\.[a-z]+\.(test|spec)\.(ts|tsx)$/, // cookie.helper.test.ts, auth.service.test.ts
    /^[a-z]+\.[a-z]+\.(schema)\.(ts|tsx)$/, // auth.service.schema.ts, user.service.schema.ts
  ],

  // Padrões de nomes redundantes proibidos
  forbiddenPatterns: [
    // Evita arquivos com nome igual ao diretório pai
    /^([a-z-]+)\/\1\.(ts|tsx|js|jsx)$/, // form/form.tsx, button/button.tsx
    // Evita nomes muito genéricos (exceto exceções)
    /^(index|main|app|component)\.(ts|tsx|js|jsx)$/, // index.ts, main.tsx
  ],
}

/**
 * Verifica se um nome de arquivo segue os padrões permitidos
 */
function isValidFileName(filename) {
  const nameWithoutExt = path.parse(filename).name

  // Verifica se é uma exceção
  if (CONFIG.exceptions.includes(filename)) {
    return { valid: true, reason: 'Exceção permitida' }
  }

  // Verifica se segue padrões específicos de componentes
  const followsComponentPattern = CONFIG.componentPatterns.some(pattern => pattern.test(filename))

  if (followsComponentPattern) {
    return { valid: true, reason: 'Padrão de componente válido' }
  }

  // Verifica se segue padrões com pontos (como cookie.helper.ts, auth.service.ts)
  const followsDotPattern = CONFIG.dotPatterns.some(pattern => pattern.test(filename))

  if (followsDotPattern) {
    return { valid: true, reason: 'Padrão com pontos válido' }
  }

  // Verifica se segue algum padrão permitido
  const followsPattern = CONFIG.allowedPatterns.some(pattern => pattern.test(nameWithoutExt))

  if (!followsPattern) {
    return {
      valid: false,
      reason: `Nome deve seguir kebab-case, camelCase ou PascalCase: ${filename}`,
    }
  }

  return { valid: true, reason: 'Padrão válido' }
}

/**
 * Verifica se um arquivo tem o sufixo obrigatório baseado no diretório
 */
function hasRequiredSuffix(filePath, filename) {
  const relativePath = path.relative(process.cwd(), filePath)
  const dirPath = path.dirname(relativePath)

  // Permite arquivos index.ts e test.ts em qualquer lugar
  if (
    filename === 'index.ts' ||
    filename === 'index.tsx' ||
    filename === 'test.ts' ||
    filename === 'test.tsx' ||
    filename === 'setup.ts' ||
    filename === 'test.setup.ts' ||
    filename === 'service.types.ts' ||
    filename === 'services.schema.ts'
  ) {
    return { valid: true, reason: 'Arquivo especial permitido' }
  }

  // Verifica arquivos especiais permitidos por diretório
  for (const [dirPattern, allowedFiles] of Object.entries(CONFIG.allowedSpecialFiles)) {
    if (dirPath.startsWith(dirPattern)) {
      const isAllowed = allowedFiles.some(suffix => filename.endsWith(suffix))
      if (isAllowed) {
        return { valid: true, reason: `Arquivo permitido em ${dirPattern}` }
      }
    }
  }

  // Verifica sufixos baseados no diretório
  for (const [dirPattern, requiredSuffix] of Object.entries(CONFIG.directorySuffixes)) {
    if (dirPath.startsWith(dirPattern)) {
      if (!filename.endsWith(requiredSuffix)) {
        return {
          valid: false,
          reason: `Arquivo em ${dirPattern} deve terminar com ${requiredSuffix}: ${filename}`,
        }
      }
      return { valid: true, reason: `Sufixo correto: ${requiredSuffix}` }
    }
  }

  // Verifica sufixos baseados no nome do arquivo (apenas para casos específicos)
  for (const [suffixName, requiredSuffix] of Object.entries(CONFIG.requiredSuffixes)) {
    if (filename.includes(suffixName) && !filename.endsWith(requiredSuffix)) {
      // Ignora verificações para componentes UI e componentes em geral
      if (dirPath.includes('components/')) {
        continue
      }
      // Ignora arquivos que já têm sufixo .component.tsx
      if (filename.endsWith('.component.tsx')) {
        continue
      }
      // Ignora arquivos especiais
      if (filename === 'test.setup.ts' || filename === 'service.types.ts' || filename === 'services.schema.ts') {
        continue
      }
      return {
        valid: false,
        reason: `Arquivo com "${suffixName}" deve terminar com ${requiredSuffix}: ${filename}`,
      }
    }
  }

  return { valid: true, reason: 'Sufixo não obrigatório' }
}

/**
 * Verifica se um arquivo deve ter sufixo baseado no conteúdo
 */
function checkContentBasedSuffix(filePath, filename) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')

    // Verifica se é um tipo (contém type ou interface) e não tem .types.ts
    if (
      (content.includes('export type') || content.includes('export interface')) &&
      !filename.endsWith('.types.ts') &&
      !filename.includes('.types.') &&
      !filename.includes('index.ts')
    ) {
      return {
        valid: false,
        reason: `Arquivo com tipos deve terminar com .types.ts: ${filename}`,
      }
    }
  } catch (err) {
    // Ignora erros de leitura (arquivos binários, etc.)
  }

  return { valid: true, reason: 'Conteúdo válido' }
}

/**
 * Verifica se um arquivo tem nome redundante com o diretório pai
 */
function hasRedundantName(filePath, filename) {
  const relativePath = path.relative(process.cwd(), filePath)
  const dirPath = path.dirname(relativePath)
  const nameWithoutExt = path.parse(filename).name

  // Verifica se o nome do arquivo é igual ao nome da pasta pai
  const parentDirName = path.basename(dirPath)

  if (nameWithoutExt === parentDirName) {
    return {
      valid: false,
      reason: `Nome redundante: arquivo "${filename}" tem o mesmo nome da pasta "${parentDirName}". Use um nome mais específico.`,
    }
  }

  // Verifica padrões proibidos
  for (const pattern of CONFIG.forbiddenPatterns) {
    if (pattern.test(relativePath)) {
      return {
        valid: false,
        reason: `Padrão proibido: "${relativePath}" não é permitido. Use um nome mais específico.`,
      }
    }
  }

  return { valid: true, reason: 'Nome não redundante' }
}

/**
 * Verifica um arquivo específico
 */
function checkFile(filePath) {
  const filename = path.basename(filePath)
  const relativePath = path.relative(process.cwd(), filePath)

  // Verifica se deve ser ignorado
  if (CONFIG.ignoreFiles.includes(filename)) {
    return { valid: true, reason: 'Arquivo ignorado', path: relativePath }
  }

  // Verifica padrão de nomenclatura
  const patternCheck = isValidFileName(filename)
  if (!patternCheck.valid) {
    return { valid: false, reason: patternCheck.reason, path: relativePath }
  }

  // Verifica sufixos obrigatórios
  const suffixCheck = hasRequiredSuffix(filePath, filename)
  if (!suffixCheck.valid) {
    return { valid: false, reason: suffixCheck.reason, path: relativePath }
  }

  // Verifica sufixos baseados no conteúdo (apenas para arquivos .ts/.tsx)
  if (filename.endsWith('.ts') || filename.endsWith('.tsx')) {
    const contentCheck = checkContentBasedSuffix(filePath, filename)
    if (!contentCheck.valid) {
      return { valid: false, reason: contentCheck.reason, path: relativePath }
    }
  }

  // Verifica se o arquivo tem nome redundante com o diretório pai
  const redundantNameCheck = hasRedundantName(filePath, filename)
  if (!redundantNameCheck.valid) {
    return { valid: false, reason: redundantNameCheck.reason, path: relativePath }
  }

  return { valid: true, reason: 'Arquivo válido', path: relativePath }
}

/**
 * Percorre um diretório recursivamente
 */
function walkDirectory(dirPath) {
  const results = []

  try {
    const items = fs.readdirSync(dirPath)

    for (const item of items) {
      const fullPath = path.join(dirPath, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        // Verifica se deve ignorar o diretório
        const shouldIgnore = CONFIG.ignoreDirectories.some(ignoreDir => fullPath.includes(ignoreDir))

        if (!shouldIgnore) {
          results.push(...walkDirectory(fullPath))
        }
      } else if (stat.isFile()) {
        // Verifica apenas arquivos TypeScript, JavaScript e outros relevantes
        const ext = path.extname(item)
        if (['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.yml', '.yaml'].includes(ext)) {
          results.push(checkFile(fullPath))
        }
      }
    }
  } catch (error) {
    console.error(`Erro ao ler diretório ${dirPath}:`, error.message)
  }

  return results
}

/**
 * Função principal
 */
function main() {
  console.log('🔍 Verificando nomes de arquivos conforme as convenções do projeto...\n')

  const allResults = []

  // Verifica cada diretório configurado
  for (const dir of CONFIG.directories) {
    if (fs.existsSync(dir)) {
      console.log(`📁 Verificando diretório: ${dir}`)
      const results = walkDirectory(dir)
      allResults.push(...results)
    }
  }

  // Filtra resultados inválidos
  const invalidFiles = allResults.filter(result => !result.valid)
  const validFiles = allResults.filter(result => result.valid)

  // Exibe resultados
  console.log(`\n📊 Resultados:`)
  console.log(`✅ Arquivos válidos: ${validFiles.length}`)
  console.log(`❌ Arquivos com problemas: ${invalidFiles.length}`)

  if (invalidFiles.length > 0) {
    console.log('\n❌ Problemas encontrados:')
    invalidFiles.forEach(file => {
      console.log(`   ${file.path}: ${file.reason}`)
    })

    console.log('\n💡 Sugestões:')
    console.log('   - Verifique doc/naming-conventions.md para as regras')
    console.log('   - Use sufixos descritivos (.service.ts, .helper.ts, etc.)')
    console.log('   - Siga kebab-case, camelCase ou PascalCase')

    process.exit(1)
  } else {
    console.log('\n🎉 Todos os arquivos seguem as convenções de nomenclatura!')
    process.exit(0)
  }
}

// Executa o script
if (require.main === module) {
  main()
}

module.exports = {
  checkFile,
  walkDirectory,
  isValidFileName,
  hasRequiredSuffix,
  checkContentBasedSuffix,
  hasRedundantName,
}
