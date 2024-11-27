import sqlite3 from 'sqlite3';
import path from 'path';

// Detecta o ambiente: se estamos rodando no Docker ou localmente
const isDocker = process.env.DOCKER_ENV === 'true';

// Define o caminho do banco de dados com base no ambiente
const dbPath = isDocker
  ? path.resolve('/app/data/server.db') // Caminho dentro do Docker
  : path.resolve(__dirname, '../../server.db'); // Caminho local para rodar fora do Docker

// Inicializa o banco de dados SQLite
const db: sqlite3.Database = new sqlite3.Database(dbPath, (err: Error | null) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log(`Conectado ao banco de dados SQLite em: ${dbPath}`);
  }
});

export default db;

