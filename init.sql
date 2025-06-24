-- Scripts de inicialização do banco de dados
-- Este arquivo será executado automaticamente na primeira inicialização do container

-- Exemplo: Criar extensões se necessário
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Exemplo: Criar schemas customizados
-- CREATE SCHEMA IF NOT EXISTS public;

-- Exemplo: Configurações específicas
-- ALTER DATABASE ${DATABASE_NAME} SET timezone TO 'America/Sao_Paulo';

-- Log de inicialização
SELECT 'Banco de dados inicializado com sucesso!' as status; 