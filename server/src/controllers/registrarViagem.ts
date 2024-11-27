import { Request, Response } from 'express';
import db from '../database/database';

interface Viagem {
  usuario_id: number;
  motorista_id: number;
  origem: string;
  destino: string;
  distancia: number;
  duracao: number;
  valor: number;
  data: string;
}

async function registrarViagem(req: Request, res: Response): Promise<void> {
  const {
    usuario_id,
    motorista_id,
    origem,
    destino,
    distancia,
    duracao,
    valor,
    data
  }: Viagem = req.body;

  // Verificar campos obrigatórios
  const missingFields: string[] = [];
  if (!usuario_id) missingFields.push('usuario_id');
  if (!motorista_id) missingFields.push('motorista_id');
  if (!origem) missingFields.push('origem');
  if (!destino) missingFields.push('destino');
  if (!distancia) missingFields.push('distancia');
  if (!duracao) missingFields.push('duracao');
  if (!valor) missingFields.push('valor');
  if (!data) missingFields.push('data');

  if (missingFields.length > 0) {
    res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: `Campos obrigatórios ausentes ou inválidos: ${missingFields.join(', ')}`
    });
    return;
  }

  const sql = `
    INSERT INTO viagens (
      usuario_id, 
      motorista_id, 
      origem, 
      destino, 
      distancia, 
      duracao, 
      valor, 
      data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = [usuario_id, motorista_id, origem, destino, distancia, duracao, valor, data];

  // Utilizando o método Promisify para lidar com a inserção assíncrona
  try {
    const result = await new Promise<any>((resolve, reject) => {
      db.run(sql, params, function (err: Error | null) {
        if (err) {
          reject(new Error('Erro ao inserir viagem: ' + err.message));
        }
        resolve(this); // retorna o objeto com lastID
      });
    });

    res.status(201).json({
      message: "Viagem inserida com sucesso.",
      viagem: {
        id: result.lastID,
        usuario_id,
        motorista_id,
        origem,
        destino,
        distancia,
        duracao,
        valor,
        data
      }
    });
  } catch (err) {
    // Asserção de tipo para garantir que err é um erro do tipo Error
    const error = err as Error;
    res.status(500).json({
      error_code: "INTERNAL_SERVER_ERROR",
      error_description: error.message
    });
  }
}

export { registrarViagem };
