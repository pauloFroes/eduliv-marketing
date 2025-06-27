import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      import: (await import('eslint-plugin-import')).default,
      '@typescript-eslint': (await import('@typescript-eslint/eslint-plugin')).default,
    },
    rules: {
      // Organização de imports
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js built-in modules
            'external', // Installed dependencies
            'internal', // Paths aliased to internal app directories
            'parent', // Parent directory imports
            'sibling', // Same directory imports
            'index', // Index file imports
            'object', // Object-imports
            'type', // Type imports
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'next/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@/config/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react', 'next'],
        },
      ],
      'import/no-unresolved': 'error',
      'import/no-duplicates': 'error',
      'import/no-unused-modules': 'warn',
      // Regra global: proíbe importação direta de Button e Tooltip da pasta /ui
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/components/ui/button',
              message:
                'Use o wrapper personalizado em vez de importar Button diretamente da pasta /ui. Importe de "@/components/ui/simple-button"',
            },
            {
              name: '@/components/ui/tooltip',
              message:
                'Use o wrapper personalizado em vez de importar Tooltip diretamente da pasta /ui. Importe de "@/components/ui/simple-tooltip"',
            },
          ],
        },
      ],
      // Convenções de nomes do projeto
      '@typescript-eslint/naming-convention': [
        'error',
        // Exceção para __filename e __dirname
        {
          selector: 'variable',
          format: null,
          filter: {
            regex: '^__filename$|^__dirname$',
            match: true,
          },
        },
        // Variáveis: camelCase, UPPER_CASE ou PascalCase (para componentes React)
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
        // Funções: camelCase (ou PascalCase para componentes)
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        // Tipos, interfaces, enums: PascalCase
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        // Parâmetros genéricos: prefixo T
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
          prefix: ['T'],
        },
        // Interfaces não podem começar com I
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: false,
          },
        },
      ],
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          moduleDirectory: ['node_modules', 'src', 'config'],
        },
      },
    },
  },
  // Sobrescreve a regra para permitir em src/components/wrapper
  {
    files: ['src/components/wrapper/*'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    ignores: [
      'src/generated/**/*',
      'generated/**/*',
      'prisma/generated/**/*',
      'node_modules/**/*',
      '.next/**/*',
      'dist/**/*',
      'build/**/*',
      'scripts/**/*',
    ],
  },
]

export default eslintConfig
