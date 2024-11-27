import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../server.db');

// Usando diretamente sqlite3.Database sem a interface personalizada
const db: sqlite3.Database = new sqlite3.Database(dbPath, (err: Error | null) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

export default db;
