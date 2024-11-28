
import { Request, Response } from 'express';


// Controlador para enviar a chave da API para o frontend
export const getGoogleApiKey = (req: Request, res: Response): void => {
  const googleApiKey = process.env.GOOGLE_API_KEY;

  if (!googleApiKey) {
    res.status(400).json({ error: 'Google API key not found' });
    return;
  }

  res.status(200).json({
    message: 'Chave da API enviada com sucesso',
    apiKey: googleApiKey,
  });
};

