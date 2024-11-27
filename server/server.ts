import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import routes from './src/routes/routes';  // Importa as rotas
import { criarTabelas, inserirDadosIniciais } from './src/database/initDataBase';  // Funções importadas diretamente

// Configurar o caminho para o arquivo .env
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const app: Application = express();

app.use(cors());
app.use(express.json());

// Usando as funções diretamente, sem a necessidade de 'initDatabase'
criarTabelas();  // Criar as tabelas
inserirDadosIniciais();  // Inserir dados de exemplo

// Usando as rotas
app.use(routes);

const port = 8080;  // Definido diretamente como 8080
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Database URL: ${process.env.DATABASE_URL ?? 'Não Definido'}`);
});
