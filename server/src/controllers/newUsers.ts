import { Request, Response } from 'express';
import db from '../database/database';

async function cadastrarUsuario(req: Request, res: Response): Promise<void> {
  const { nome } = req.body;

  if (!nome || nome.trim() === "") {
    res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Nome do usuário é obrigatório."
    });
    return;
  }

  const sql = "INSERT INTO usuarios (nome) VALUES (?)";
  const params = [nome];

  try {
    const result = await new Promise<any>((resolve, reject) => {
      const stmt = db.prepare(sql);

      stmt.run(params, function (err: Error | null) {
        if (err) {
          reject(new Error('Erro ao cadastrar usuário: ' + err.message));
        }
        resolve(this); // Retorna o objeto com lastID
      });

      stmt.finalize();
    });

    res.status(201).json({
      message: "Usuário cadastrado com sucesso.",
      usuario: { id: result.lastID, nome }
    });

  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      error_code: "INTERNAL_SERVER_ERROR",
      error_description: error.message
    });
  }
}

const listarUsuarios = (req: Request, res: Response): void => {
  const query = 'SELECT * FROM usuarios';

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ usuarios: rows });
  });
};


export { cadastrarUsuario, listarUsuarios };
