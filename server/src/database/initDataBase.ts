
// Tabela de usuarios iniciais para testes no histórico de viagens.

import db from '../database/database';

interface Usuario {
  nome: string;
}

interface Motorista {
  nome: string;
  descricao: string;
  carro: string;
  avaliacao: number;
  taxaPorKm: number;
  kmMinimo: number;
}

interface Viagem {
  origem: string;
  destino: string;
  distancia: number;
  duracao: string;
  valor: number;
  usuario_id: number;
  motorista_id: number;
}

function criarTabelas(): void {
  db.serialize(() => {
    // Tabela de usuarios
    db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT
      )
    `);

    // Tabela de motoristas
    db.run(`
      CREATE TABLE IF NOT EXISTS motoristas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        descricao TEXT,
        carro TEXT,
        avaliacao INTEGER,
        taxaPorKm REAL,
        kmMinimo INTEGER
      )
    `);

    // Tabela de viagens (relacionamento com usuarios)
    db.run(`
      CREATE TABLE IF NOT EXISTS viagens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        origem TEXT,
        destino TEXT,
        distancia REAL,
        duracao TEXT,
        valor REAL,
        data DATETIME DEFAULT CURRENT_TIMESTAMP,
        usuario_id INTEGER,
        motorista_id INTEGER,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (motorista_id) REFERENCES motoristas(id)
      )
    `);
  });
}

function inserirDadosIniciais(): void {
  // Verificando se já existem usuários cadastrados
  db.get("SELECT COUNT(*) AS count FROM usuarios", (err: Error, row: { count: number }) => {
    if (err) {
      console.error('Erro ao verificar usuários:', err.message);
      return;
    }

    if (row.count === 0) {
      // Inserindo usuários de exemplo (apenas na primeira execução)
      const usuarios: Usuario[] = [
        { nome: "João Silva" },
        { nome: "Maria Souza" },
        { nome: "Carlos Lima" },
        { nome: "Ana Pereira" },
        { nome: "Pedro Costa" }
      ];

      const stmt = db.prepare("INSERT INTO usuarios (nome) VALUES (?)");
      usuarios.forEach(usuario => {
        stmt.run(usuario.nome);
      });
      stmt.finalize();

      console.log('Usuários de exemplo inseridos.');
    } else {
      console.log('Usuários já cadastrados no banco de dados.');
    }
  });

  // Verificando se já existem motoristas cadastrados
  db.get("SELECT COUNT(*) AS count FROM motoristas", (err: Error, row: { count: number }) => {
    if (err) {
      console.error('Erro ao verificar motoristas:', err.message);
      return;
    }

    if (row.count === 0) {
      // Inserindo motoristas de exemplo (apenas na primeira execução)
      const motoristas: Motorista[] = [
        { nome: "Homer Simpson", descricao: "Olá! Sou o Homer...", carro: "Plymouth Valiant 1973 rosa e enferrujado", avaliacao: 2, taxaPorKm: 2.50, kmMinimo: 1 },
        { nome: "Dominic Toretto", descricao: "Ei, aqui é o Dom...", carro: "Dodge Charger R/T 1970 modificado", avaliacao: 4, taxaPorKm: 5.00, kmMinimo: 1 },
        { nome: "James Bond", descricao: "Boa noite, sou James Bond...", carro: "Aston Martin DB5 clássico", avaliacao: 5, taxaPorKm: 10.00, kmMinimo: 1 },
        { nome: "Mario Andretti", descricao: "Olá! Sou Mario Andretti, uma lenda das pistas...", carro: "Lotus 79 preto e dourado", avaliacao: 5, taxaPorKm: 7.50, kmMinimo: 2 },
        { nome: "Vincent Vega", descricao: "Oi, eu sou o Vincent. Vou levá-lo com estilo.", carro: "Chevrolet Nova 1970 preto", avaliacao: 3, taxaPorKm: 3.50, kmMinimo: 1 },
        { nome: "Mad Max", descricao: "Sou Max, especialista em estradas perigosas...", carro: "Ford Falcon XB modificado para o apocalipse", avaliacao: 5, taxaPorKm: 6.00, kmMinimo: 1 },
        { nome: "Lightning McQueen", descricao: "Ka-chow! Sou Lightning McQueen, rápido e eficiente!", carro: "Corrida Stock Car vermelho brilhante", avaliacao: 4, taxaPorKm: 4.00, kmMinimo: 1 },
        { nome: "Elwood Blues", descricao: "Oi, sou o Elwood, especialista em fugas dramáticas.", carro: "Dodge Monaco 1974 com uma sirene", avaliacao: 3, taxaPorKm: 3.00, kmMinimo: 1 }
      ];
      

      const stmt = db.prepare("INSERT INTO motoristas (nome, descricao, carro, avaliacao, taxaPorKm, kmMinimo) VALUES (?, ?, ?, ?, ?, ?)");
      motoristas.forEach(motorista => {
        stmt.run(motorista.nome, motorista.descricao, motorista.carro, motorista.avaliacao, motorista.taxaPorKm, motorista.kmMinimo);
      });
      stmt.finalize();

      console.log('Motoristas de exemplo inseridos.');
    } else {
      console.log('Motoristas já cadastrados no banco de dados.');
    }
  });

  // Inserindo viagens fictícias para os usuários de id 1 a 5
  db.get("SELECT COUNT(*) AS count FROM viagens", (err: Error, row: { count: number }) => {
    if (err) {
      console.error('Erro ao verificar viagens:', err.message);
      return;
    }

    if (row.count === 0) {
      const viagens: Viagem[] = [
        { origem: "Criciúma", destino: "Içara", distancia: 10.0, duracao: "20 minutos", valor: 25.00, usuario_id: 2, motorista_id: 2 },
        // { origem: "Tubarao", destino: "Criciúma", distancia: 15.0, duracao: "30 minutos", valor: 40.00, usuario_id: 2, motorista_id: 2 },
        // { origem: "Ararangua", destino: "Tubarao", distancia: 20.0, duracao: "45 minutos", valor: 50.00, usuario_id: 3, motorista_id: 3 },
        // { origem: "Içara", destino: "Ararangua", distancia: 25.0, duracao: "55 minutos", valor: 60.00, usuario_id: 4, motorista_id: 4 },
        // { origem: "Criciúma", destino: "Ararangua", distancia: 30.0, duracao: "60 minutos", valor: 75.00, usuario_id: 5, motorista_id: 5 },
        // { origem: "Içara", destino: "Tubarao", distancia: 12.0, duracao: "25 minutos", valor: 28.50, usuario_id: 6, motorista_id: 6 },
        // { origem: "Ararangua", destino: "Criciúma", distancia: 18.0, duracao: "40 minutos", valor: 45.00, usuario_id: 7, motorista_id: 7 },
        // { origem: "Tubarao", destino: "Içara", distancia: 8.0, duracao: "18 minutos", valor: 22.00, usuario_id: 8, motorista_id: 8 }
      ];

      const stmt = db.prepare("INSERT INTO viagens (origem, destino, distancia, duracao, valor, usuario_id, motorista_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
      viagens.forEach(viagem => {
        stmt.run(viagem.origem, viagem.destino, viagem.distancia, viagem.duracao, viagem.valor, viagem.usuario_id, viagem.motorista_id);
      });
      stmt.finalize();

      console.log('Viagens de exemplo inseridas.');
    } else {
      console.log('Viagens já cadastradas no banco de dados.');
    }
  });
}

export { criarTabelas, inserirDadosIniciais };
