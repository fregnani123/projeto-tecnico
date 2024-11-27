import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../server.db');

// Definir a interface para o banco de dados, caso necessário para o uso do SQLite
interface SQLiteDatabase extends sqlite3.Database {
  // Aqui você pode adicionar métodos personalizados se necessário
}

const db: SQLiteDatabase = new sqlite3.Database(dbPath, (err: Error | null) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

export default db;

