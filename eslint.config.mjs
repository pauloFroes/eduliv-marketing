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
    },
    rules: {
      // Regra para impedir importações diretas de Button e Tooltip da pasta /ui
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/components/ui/button'],
              message:
                'Use o wrapper personalizado em vez de importar Button diretamente da pasta /ui. Importe de "@/components/ui/simple-button"',
            },
            {
              group: ['@/components/ui/tooltip'],
              message:
                'Use o wrapper personalizado em vez de importar Tooltip diretamente da pasta /ui. Importe de "@/components/ui/simple-tooltip"',
            },
          ],
        },
      ],
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
          ],
          pathGroupsExcludedImportTypes: ['react', 'next'],
        },
      ],
      'import/no-unresolved': 'error',
      'import/no-duplicates': 'error',
      'import/no-unused-modules': 'warn',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
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
    ],
  },
]

export default eslintConfig
