import { Request, Response } from 'express';
import db from '../database/database';

interface Motorista {
  id: number;
  kmMinimo: number;
  taxaPorKm: number;
}

interface DistanciaTempo {
  distance: number;  // em km
  duration: number;  // em segundos
}

// Função para calcular a distância e o tempo usando a API do Google Maps
async function calcularDistancia(origem: string, destino: string): Promise<DistanciaTempo> {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origem)}&destination=${encodeURIComponent(destino)}&key=${process.env.GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Erro ao buscar dados da API');
    }

    const data = await response.json();

    if (data.status === 'OK') {
      const leg = data.routes[0].legs[0];
      const distance = leg.distance.value / 1000; // distância em km
      const duration = leg.duration.value;  // duração em segundos

      return { distance, duration };
    } else {
      throw new Error('Não foi possível calcular a distância e o tempo');
    }
  } catch (error: unknown) {
    // Verificando se o erro é uma instância de Error
    if (error instanceof Error) {
      throw new Error('Erro na requisição à API do Google Maps: ' + error.message);
    } else {
      throw new Error('Erro desconhecido ao calcular a distância');
    }
  }
}

// Controller para calcular a rota e listar os motoristas disponíveis
async function calcularRota(req: Request, res: Response): Promise<void> {
  const { origem, destino } = req.body;

  if (!origem || !destino) {
    res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Os endereços de origem e destino não podem estar em branco."
    });
    return;
  }

  if (origem === destino) {
    res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Os endereços de origem e destino não podem ser iguais."
    });
    return;
  }

  try {
    const { distance, duration } = await calcularDistancia(origem, destino);

    // Busca motoristas no banco de dados
    db.all("SELECT * FROM motoristas WHERE kmMinimo <= ?", [distance], (err, rows: Motorista[]) => {
      if (err) {
        res.status(500).json({
          error_code: "INTERNAL_SERVER_ERROR",
          error_description: "Erro ao buscar motoristas: " + err.message
        });
        return;
      }

      if (rows.length === 0) {
        res.status(404).json({
          error_code: "DRIVER_NOT_FOUND",
          error_description: "Nenhum motorista disponível para a distância informada."
        });
        return;
      }

      // Adiciona o custo da corrida para cada motorista
      const motoristasComCusto = rows.map((motorista) => {
        const custo = motorista.taxaPorKm * distance;
        return { ...motorista, custoCorrida: custo };
      });

      res.json({
        distancia: distance,
        tempo: duration,
        motoristas: motoristasComCusto,
        apiKey: process.env.GOOGLE_API_KEY // Inclui a chave da API na resposta
      });
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        error_code: "INTERNAL_SERVER_ERROR",
        error_description: error.message
      });
    } else {
      res.status(500).json({
        error_code: "INTERNAL_SERVER_ERROR",
        error_description: 'Erro desconhecido ao calcular a rota'
      });
    }
  }
}

export { calcularRota };
