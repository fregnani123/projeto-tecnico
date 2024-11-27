import { Request, Response } from 'express';
import db from '../database/database';

interface Viagem {
  viagem_id: number;
  origem: string;
  destino: string;
  distancia: number;
  duracao: number;
  valor: number;
  data: string;
  motorista_id: number;
  motorista_nome: string;
}

interface ViagemResponse {
  id: number;
  date: string;
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  valor: number;
  driver: {
    id: number;
    name: string;
  };
}

interface BuscarViagensResponse {
  customer_id: string;
  rides: ViagemResponse[];
}

// Controller para buscar as viagens
export const buscarViagens = (req: Request, res: Response): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { usuario_id, motorista_id } = req.query;

    if (!usuario_id || !motorista_id) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Os parâmetros usuario_id e motorista_id são obrigatórios.',
      });
    }

    const query = `
      SELECT 
        v.id AS viagem_id, 
        v.origem, 
        v.destino, 
        v.distancia, 
        v.duracao,
        v.valor,
        v.data, 
        m.id AS motorista_id, 
        m.nome AS motorista_nome 
      FROM viagens v
      JOIN motoristas m ON v.motorista_id = m.id
      WHERE v.usuario_id = ? AND v.motorista_id = ?
    `;

    db.all(query, [usuario_id, motorista_id], (err: Error | null, rows: Viagem[] | undefined) => {
      if (err) {
        return res.status(500).json({
          error_code: 'INTERNAL_SERVER_ERROR',
          error_description: `Erro ao buscar viagens: ${err.message}`,
        });
      }

      if (!rows || rows.length === 0) {
        return res.status(404).json({
          error_code: 'NO_TRIPS_FOUND',
          error_description: 'Nenhuma viagem encontrada para o usuário e motorista fornecidos.',
        });
      }

      const response: BuscarViagensResponse = {
        customer_id: usuario_id as string,
        rides: rows.map((viagem) => ({
          id: viagem.viagem_id,
          date: viagem.data,
          origin: viagem.origem,
          destination: viagem.destino,
          distance: viagem.distancia,
          duration: viagem.duracao,
          valor: viagem.valor,
          driver: {
            id: viagem.motorista_id,
            name: viagem.motorista_nome,
          },
        })),
      };

      res.json(response); // Envia a resposta para o cliente

      resolve(); // Resolve a promessa
    });
  });
};
